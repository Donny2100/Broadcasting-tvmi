import React, { Component } from 'react';
import {
	View,
	Text,
	Image,
	TouchableOpacity,
	ImageBackground,
	FlatList,
	WebView,
	Easing,
	RefreshControl,
	BackHandler,
	AppState,
	Linking,
	Platform
} from 'react-native';
import PropTypes from 'prop-types';
import IMAGES from '../../common/images';
import COLORS from '../../common/colors';
import { commonStyle as cs, newsFeed as nf, ModalStyle as ms } from '../../common/style';
import StyleMethods from '../../common/Style_Methods';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as loginActions from '../../common/reducers/app.actions';
import network from '../../common/network';
import firebase from 'react-native-firebase';
import Realm from '../../common/realm';
import MenuModal from '../menu/MenuModal';
import Modal from "react-native-modal";
import Indicator from '../../common/libs/indicator';
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import Toast from 'react-native-easy-toast';
import { CachedImage } from "react-native-img-cache";
import RNExitApp from 'react-native-exit-app-no-history';
import { Analytics, Hits as GAHits } from 'react-native-google-analytics';
import DeviceInfo from 'react-native-device-info';
import GlobalEvent from '../../common/GlobalEvent';
import SharedData from '../../common/SharedData';
var moment = require('moment');
var indicatorOBJ = null;
const databaseobj = firebase.database();

const staticTabs = {
	Saved: {
		name: "Saved"
	},
	NonStopNews: {
		name: "Non Stop News"
	}
};
const expiredThresholdInDay = 14; // day

class Landing extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			refreshing: false,
			isModalVisible: false,
			imageUrl: '',
			newsFeed: [],
			savedStatuses: [],
			allCategories: [],
			newsfeedFlag: false,
			settingFlag: false,
			welcomeText: '',
			initials: '',
			appState: '',
			count: 1,
			notification_check: true,
			experiments: {},
		};
		//alert(StyleMethods.getHeight());
		this._handleAppStateChange = this._handleAppStateChange.bind(this);
		this.onSaveFeedItemClicked = this.onSaveFeedItemClicked.bind(this);
		this._rendernewsFeeds = this._rendernewsFeeds.bind(this);
		this.handleEvents = this.handleEvents.bind(this);

		self = this;
	}

	_handleAppStateChange = (nextAppState) => {
		if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
			if (this.props.appdata.currentTrack !== 0 && this.props.appdata.currentTrack !== undefined) {
				var temp = '';
				this.props.navigator.resetTo({
					passProps: { temp },
					screen: 'TVM.LiveTv',
					navigatorStyle: StyleMethods.newNavigationStyle(),
					animated: false
				});
			} else if (this.state.count === 2) {
				this.props.navigator.resetTo({
					screen: 'TVM.Landing',
					navigatorStyle: StyleMethods.newNavigationStyle(),
					animationType: 'fade',
					animated: true
				})
				this.setState({ count: 1 });
			}
		}
		this.setState({ appState: nextAppState });
	}

	componentWillUnmount() {
		if (Platform.OS === 'android') {
			BackHandler.removeEventListener('hardwareBackPress', this.onBackHandler);
		}
		AppState.removeEventListener('change', this._handleAppStateChange);
		
		if(this.notificationOpenedListener) {
			this.notificationOpenedListener();
		}

		SharedData.setCallback(null)
	}

	onBackHandler = () => {
		RNExitApp.exitApp();
	}

	_showMenu = () => {
		this.setState({ isModalVisible: !this.state.isModalVisible })
	}

	_onRefresh() {
		this.setState({ refreshing: true });
		this.loadData();
	}

	handleEvents(eventName) {
		switch (eventName) {
			case 'RefreshNewsFeedData':
				this._onRefresh();
				break;
		}
	}

	componentWillMount() {
		if (Platform.OS === 'android') {
			BackHandler.addEventListener('hardwareBackPress', this.onBackHandler);
		}
		GlobalEvent.addCallback(this.handleEvents);
		AppState.addEventListener('change', this._handleAppStateChange);
		let userprofileData = Realm.ReadData('UserProfile');
		let USER = JSON.parse(userprofileData[0].profiledata);
		this.props.actions.UserProfile(USER);
		this.setState({ language: USER.preferences.language.data, welcomeText: this.toTitleCase(USER.titles.welcome), initials: USER.initials, name: USER.first_name.data.toUpperCase() });

		staticTabs.Saved.name = USER.titles.saved;
		staticTabs.NonStopNews.name = USER.titles.non_stop_news;
		this.removeExpiredSavedNewsFeedData();

		let experiment = this.state.experiments['welcome-message'];
		let clientId = DeviceInfo.getUniqueID();
		let ga = new Analytics('UA-44380471-1', clientId, 1, DeviceInfo.getUserAgent());
		let events = new GAHits.Event(
			'News Feed',
			'screen opens',
			'News Feed',
			'',
			experiment
		);
		ga.send(events);
	}

	toTitleCase(str) {
		return str.replace(/\w\S*/g, function (txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	}

	componentDidMount() {
		setTimeout(() => this.doPrepareData(), 100);
	}

	async doPrepareData() {
		SharedData.setCallback(() => {
			let userprofileData = Realm.ReadData('UserProfile');
			let USER = JSON.parse(userprofileData[0].profiledata);

			indicatorOBJ.setModalVisible(true);
			
			console.log("Callback called!")

            SharedData.setObject("SAVE_PERF", 0);

			this.setState({
				language: USER.preferences.language.data, 
				welcomeText: this.toTitleCase(USER.titles.welcome), 
				initials: USER.initials, name: USER.first_name.data.toUpperCase(),
			});

			this.loadData();	
		})

		let object = SharedData.getObject("SAVE_PERF");
		console.log("SAVE_PERF", object)

		if (this.indicatorOBJ !== null) {
			this.indicatorOBJ.setModalVisible(true);
		}

		if(object == 1) {
			this.indicatorOBJ.setModalVisible(true);
			return;
		}

		this.loadData();
		this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
			// Get the action triggered by the notification being opened
			const action = notificationOpen.action;
			// Get information about the notification that was opened
			const notification = notificationOpen.notification;
			if (notification.data.article_id) {
				console.log("onNotificationOpened", notification.data.article_id);
				var id = notification.data.article_id;
				this.props.navigator.push({
					passProps: { id },
					screen: 'TVM.Newsfeed',
					navigatorStyle: StyleMethods.newNavigationStyle(),
					animationType: 'fade',
					animated: true
				});
				Realm.DeleteData('NotificationCheck');
				Realm.WriteData('NotificationCheck', {
					data: false
				});
			} else {
				console.log(notification);
			}
		});
		const notificationOpen = await firebase.notifications().getInitialNotification();
		if (notificationOpen) {
			// App was opened by a notification
			// Get the action triggered by the notification being opened
			const action = notificationOpen.action;
			// Get information about the notification that was opened
			const notification = notificationOpen.notification;
			var notifyCheck = Realm.ReadData('NotificationCheck');
			console.log("NotificationCheck", notifyCheck[0].data);
			if (notifyCheck[0].data === true) {
				if (notification.data.article_id) {
					var id = notification.data.article_id;
					var temp = '';
					Realm.DeleteData('NotificationCheck');
					Realm.WriteData('NotificationCheck', {
						data: false
					});
					this.props.navigator.push({
						passProps: { id, temp },
						screen: 'TVM.Newsfeed',
						navigatorStyle: StyleMethods.newNavigationStyle(),
						animationType: 'fade',
						animated: true
					});
				} else {
					console.log(notification);
				}
			}
		}
	}

	updateScreen = (ScreenValue) => {
		if (this.state.isModalVisible) {
			this.setState({ isModalVisible: !this.state.isModalVisible });
			if (ScreenValue !== '') {
				this.props.navigator.resetTo({
					screen: ScreenValue,
					navigatorStyle: { navBarHidden: true },
					animated: true,
				});
			}
		} else {
			return;
		}
	}

	async loadData() {
		let savedFeedData = this.getSavedNewsFeedData();
		let realTimeFeedData = [];
		this.newsFeedData(savedFeedData, realTimeFeedData);
	}

	newsFeedData(savedFeedData, realTimeFeedData) {
		try {
			var data = Realm.ReadData('User');
			var _token = data[0].wp;
			var res = _token.split(",");
			var res2 = res[0].split(":");
			var token_data = res2[1];
			//token_data = token_data.replace('U5OCJ9fX0', 'aaaaaaaaa');
			var details = {
				'token': stripEndQuotes(token_data),
			};
			var formBody = [];
			for (var property in details) {
				var encodedKey = encodeURIComponent(property);
				var encodedValue = encodeURIComponent(details[property]);
				formBody.push(encodedKey + "=" + encodedValue);
			}
			formBody = formBody.join("&");

			// var categories_array = [staticTabs.Saved, staticTabs.NonStopNews];
			// var totalArray = [savedFeedData, realTimeFeedData];

			var categories_array = [];
			var totalArray = [];
			network.TimeMethod("POST", "feeds", (flag, response) => {
				if (flag === true) {
					if (response.hasOwnProperty('error')) {
						if (response.error.statusCode == 403 || response.error.statusCode == 401) {
							Realm.DeleteData('UserProfile');
							Realm.DeleteData('User');
							this.props.navigator.resetTo({
								screen: 'TVM.LoginScreen',
								navigatorStyle: { navBarHidden: true }
							});
							return;
						}
						this.refs.redtoast.show(this.props.appdata.profiledata.titles.something_went_wrong, 3000);
					} else {
						var categories = this.data_to_array(response);
						for (var i = 0; i < categories.length; i++) {
							var sub_array = [];
							var catname = categories[i].key;
							var cateName = catname.toUpperCase();
							categories_array.push({ name: cateName });
							var sub_category = categories[i].data;
							for (var j = 0; j < sub_category.length; j++) {
								sub_array.push({
									category: cateName, id: sub_category[j].ID, url: sub_category[j].url, height: sub_category[j].height, type: sub_category[j].type, title: sub_category[j].title, subtitle: sub_category[j].subtitle,
									image: sub_category[j].image, has_video: sub_category[j].has_video, has_gallery: sub_category[j].has_gallery
								});
							}
							sub_array = this.mergeRemoteDataWithSavedData(sub_array, savedFeedData);
							totalArray.push(sub_array);
						}

						categories_array.push(staticTabs.Saved);
						categories_array.push(staticTabs.NonStopNews);
						totalArray.push(savedFeedData)
						totalArray.push(realTimeFeedData)
					}
				} else {
					this.refs.redtoast.show(response, 3000);
				}

				this.setState({ allCategories: categories_array, newsFeed: totalArray, savedStatuses: totalArray, refreshing: false });
				setTimeout(() => {
					let platform = SharedData.getObject("PLATFORM")

					if(platform === 'NONSTOP') {
						let tab = this.state.allCategories.length - 1
						this.mainTabs.goToPage(tab);
						SharedData.setObject("PLATFORM", "")
					} else {
						this.mainTabs.goToPage(0);
					}
				}, 100);

				setTimeout(() => this.getRealTimeFeedData(), 100);

				if (indicatorOBJ !== null) {
					indicatorOBJ.setModalVisible(false);
				}
			}, null, formBody);
		}
		catch (err) {
			StyleMethods.LogException("Landing / feeds / " + err.message);
		}
	}

	getSavedNewsFeedData() {
		return Realm.ReadDataWithFilters('NewsFeed', 'is_related == false');
	}

	getRealTimeFeedData() {
		let lang = this.state.language.toLowerCase();
		let news = SharedData.getNonStopNews(lang);

		if(!news) {
			let path = '/app/nonstopnews/' + this.state.language.toLowerCase();
			const nonStopNewsRef = databaseobj.ref(path);
			console.log("Load Non Stop News ->", path);
			
			nonStopNewsRef.on('value', (e) => {
				try {
					var data = e.val();
					var keys = Object.keys(data);

					console.log('getRealTimeFeedData', path, 'success', keys.length);

					var nonStopNews = [];
	
					keys.forEach((key) => {
						var item = data[key];
						item.subtitle = item.category;
						nonStopNews.push(item);
					});
	
					var newsFeeds = this.state.newsFeed;
					let idx = newsFeeds.length - 1;
					newsFeeds[idx] = nonStopNews;
					SharedData.setNonStopNews(nonStopNews, lang);
					this.setState({newsFeed: newsFeeds});
				} catch (ex) {
					console.log('getRealTimeFeedData Error ->', ex);
				}
			}, (e) => {
				console.log('getRealTimeFeedData Error ->', e);
			});	
		} else {
			var newsFeeds = this.state.newsFeed;
			let idx = newsFeeds.length - 1;
			newsFeeds[idx] = news;
			SharedData.setNonStopNews(news, lang);
			this.setState({newsFeed: newsFeeds});
		}

		return [];
	}

	removeExpiredSavedNewsFeedData() {
		let savedDate = moment(new Date()).subtract(expiredThresholdInDay, 'day').toDate();
		Realm.DeleteDataWithFilters('NewsFeed', 'date <= $0', savedDate);
	}

	async onSaveFeedItemClicked({ item, index }, categoryIndex) {
		indicatorOBJ.setModalVisible(true);

		if (!item.isSaved) { // if item is not saved => save the item
			// get feed's detail first
			let feedDetail = await this.getFeedDetail(item.id);
			if (feedDetail) {
				try {
					let response = await fetch(feedDetail.url);
					let html = await response.text();
					item.cache_html = html;
					item = { ...item, ...feedDetail };
					//item.date = moment(new Date()).subtract(30, 'day').toDate();
					Realm.WriteData('NewsFeed', item);
					this.updateUIForSavedOrUnSavedItem({ item, index }, categoryIndex);
				} catch (e) {
					console.log(e);
					this.refs.redtoast.show(this.props.appdata.profiledata.titles.save_feed_error, 3000);
				}
			} else {
				this.refs.redtoast.show(this.props.appdata.profiledata.titles.save_feed_error, 3000);
			}
		} else { // if item is saved => unsave the item
			Realm.DeleteDataWithFilters('NewsFeed', 'id == ' + item.id);
			this.updateUIForSavedOrUnSavedItem({ item, index }, categoryIndex);
		}

		indicatorOBJ.setModalVisible(false);
	}

	updateUIForSavedOrUnSavedItem({ item, index }, categoryIndex) {
		let changedStatuses = [];
		let originStatuses = this.state.savedStatuses;
		for (var i = 0; i < originStatuses.length; i++) {
			for (var j = 0; j < originStatuses[i].length; j++) {
				if (i == categoryIndex && j == index) {
					originStatuses[i][j].isSaved = !item.isSaved;
					break;
				}
			}
			changedStatuses.push(originStatuses[i]);
		}
		this.setState({
			savedStatuses: changedStatuses
		});
	}

	getFeedDetail(id) {
		return new Promise(async (resolve) => {
			var data = Realm.ReadData('User');
			var _token = data[0].wp;
			var res = _token.split(",");
			var res2 = res[0].split(":");
			const token_data = res2[1];
			var details = {
				'token': stripEndQuotes(token_data),
			};
			var formBody = [];
			for (var property in details) {
				var encodedKey = encodeURIComponent(property);
				var encodedValue = encodeURIComponent(details[property]);
				formBody.push(encodedKey + "=" + encodedValue);
			}
			formBody = formBody.join("&");
			network.TimeMethod("POST", "getStory?id=" + id, (flag, response) => {
				if (flag === true) {
					if (response.hasOwnProperty('error')) {
						if (response.error.statusCode == 403 || response.error.statusCode == 401) {
							Realm.DeleteData('UserProfile');
							Realm.DeleteData('User');
							this.props.navigator.resetTo({
								screen: 'TVM.LoginScreen',
								navigatorStyle: { navBarHidden: true }
							});
							return;
						}
						resolve(null);
					} else {
						if (response.length > 0) {
							var related_data = response[0];
							console.log(videos);
							var allVideos = [];
							if (related_data.related.data.length !== 0) {
								var videos = related_data.related.data;
								for (var i = 0; i < videos.length; i++) {
									allVideos.push({
										id: videos[i].ID, image: videos[i].image, title: videos[i].title, subtitle: videos[i].subtitle, url: videos[i].url,
										has_video: videos[i].has_video, has_gallery: videos[i].has_gallery, is_related: true
									});
								}
							}
							resolve({
								related_news_feeds: allVideos, url: related_data.url, image: related_data.image, title: related_data.title, subtitle: related_data.subtitle,
								has_video: related_data.has_video, related_label: related_data.related.label, share_url: related_data.share.url, share_label: related_data.share.label
							});
						} else {
							resolve(null);
						}
					}
				} else {
					resolve(null);
				}
			}, null, formBody);
		});
	}

	data_to_array(obj) {
		var categories = [];
		for (var p in obj) {
			categories.push({ key: p, data: obj[p] });
		}
		return categories;
	}

	mergeRemoteDataWithSavedData(remoteData, savedData) {
		for (var i = 0; i < remoteData.length; i++) {
			let existingItem = savedData.find((item) => {
				return item.id == remoteData[i].id
			});
			remoteData[i].isSaved = existingItem != undefined;
		}
		return remoteData;
	}

	onlinkclick(item) {
		try {
			if (this.state.newsfeedFlag) {
				return;
			} else {
				var id = item.id;
				this.setState({ newsfeedFlag: true });
				this.props.navigator.push({
					passProps: {
						id, item: {
							image: item.image,
							title: item.title,
							subtitle: item.subtitle,
							has_video: item.has_video
						}
					},
					screen: 'TVM.Newsfeed',
					navigatorStyle: StyleMethods.newNavigationStyle(),
					animationType: 'fade',
					transitionSpec: {
						duration: 1000,
						timing: 1000,
						easing: Easing.elastic(0.9),
					},
					animated: true
				});
				setTimeout(() => { this.setState({ newsfeedFlag: false }) }, 3000);
			}
		}
		catch (err) {
			StyleMethods.LogException("Landing / storyClicked / " + err.message);
		}
	}

	_renderSavedFeeds = ({ item }) => (
		<TouchableOpacity style={nf.savedStoryrowView} onPress={() => { this.onlinkclick(item); this.setState({ url: '' }) }}>
			<View style={{ flex: 0.3 }}>
				{(Platform.OS === 'ios') ?
					<CachedImage source={{ uri: (item.image) }} style={{ flex: 1, borderRadius: StyleMethods.getFontSize(10), resizeMode: 'cover' }} />
					:
					<Image source={{ uri: (item.image) }} style={{ flex: 1, borderRadius: StyleMethods.getFontSize(10), resizeMode: 'cover' }} />
				}
				{(item.has_video === 1) ?
					<Image source={IMAGES.STORY_PLAY} style={{ position: 'absolute', left: 8, top: 8, height: StyleMethods.getFontSize(38), width: StyleMethods.getFontSize(38), resizeMode: 'contain' }} />
					: null}
			</View>
			<View style={{ flex: 0.7, justifyContent: 'center', paddingLeft: StyleMethods.getFontSize(10) }}>
				<Text style={nf.savedStoryDate}>{typeof item.date === 'string' ? item.date : StyleMethods.getFullDateTime(item.date)}</Text>
				<Text style={nf.savedStoryCategory}>{item.subtitle}</Text>
				<Text style={nf.savedStoryText} numberOfLines={2}>{item.title.toUpperCase()}</Text>
			</View>
		</TouchableOpacity>
	);

	_rendernewsFeeds = ({ item, index }, categoryIndex) => (
		<View>
			{(item.type !== 'advert') ?
				<View style={[nf.feedssingleMainView, cs.elevatedShadow]}>
					{(Platform.OS === 'android') ?
						<ImageBackground source={{ uri: (item.image) }} style={nf.feedssingleView} borderRadius={StyleMethods.getFontSize(20)}>
							<TouchableOpacity style={nf.feedsimageView} onPress={() => this.onlinkclick(item)}>
								<View style={{ flex: 0.92 }}>
									{(item.has_video === 1) ?
										<Image source={IMAGES.STORY_PLAY} style={{ position: 'absolute', left: 10, top: 10, height: StyleMethods.getFontSize(38), width: StyleMethods.getFontSize(38), resizeMode: 'contain' }} />
										: null}
									<TouchableOpacity style={{ position: 'absolute', right: 10, top: 10, height: StyleMethods.getFontSize(38), width: StyleMethods.getFontSize(38) }}
										onPress={() => this.onSaveFeedItemClicked({ item, index }, categoryIndex)}>
										<Image source={this.state.savedStatuses[categoryIndex][index].isSaved == true ? IMAGES.SAVE_ICON : IMAGES.UNSAVE_ICON} style={{ height: StyleMethods.getFontSize(38), width: StyleMethods.getFontSize(38), resizeMode: 'contain' }} />
									</TouchableOpacity>
								</View>
								<View style={nf.feedsTextmainView}>
									<View style={nf.feedsimageBottom2}>
										<Text style={nf.categoryText}>{item.subtitle}</Text>
									</View>
									<View style={nf.feedsimageBottom}>
										<Text style={nf.categorytitleText}>{item.title}</Text>
									</View>
								</View>
							</TouchableOpacity>
						</ImageBackground>
						:
						<TouchableOpacity style={nf.feedsimageView} onPress={() => this.onlinkclick(item)}>
							<CachedImage source={{ uri: item.image }} style={nf.feedssingleView} borderRadius={StyleMethods.getFontSize(20)} />
							{(item.has_video === 1) ?
								<Image source={IMAGES.STORY_PLAY} style={{ position: 'absolute', left: 10, top: 10, height: StyleMethods.getFontSize(38), width: StyleMethods.getFontSize(38), resizeMode: 'contain' }} />
								: null}
							<TouchableOpacity style={{ position: 'absolute', right: 10, top: 10, height: StyleMethods.getFontSize(38), width: StyleMethods.getFontSize(38) }}
								onPress={() => this.onSaveFeedItemClicked({ item, index }, categoryIndex)}>
								<Image source={this.state.savedStatuses[categoryIndex][index].isSaved == true ? IMAGES.SAVE_ICON : IMAGES.UNSAVE_ICON} style={{ height: StyleMethods.getFontSize(38), width: StyleMethods.getFontSize(38), resizeMode: 'contain' }} />
							</TouchableOpacity>
							<View style={nf.feedsTextmainView}>
								<View style={nf.feedsimageBottom2}>
									<Text style={nf.categoryText}>{item.subtitle}</Text>
								</View>
								<View style={nf.feedsimageBottom}>
									<Text style={nf.categorytitleText}>{item.title}</Text>
								</View>
							</View>
						</TouchableOpacity>
					}
				</View>
				: (item.type === 'advert') ?
					<View style={{ height: item.height, marginHorizontal: StyleMethods.getFontSize(10), borderWidth: StyleMethods.getFontSize(1), borderColor: 'grey', marginVertical: StyleMethods.getFontSize(10) }}>
						<View style={nf.feedsimageView}>
							<WebView
								source={{ uri: item.url }}
								startInLoadingState={true}
								scrollEnabled={false}
								onNavigationStateChange={(event) => {
									var index = this.state.count;
									if (event.url !== item.url && index === 1) {
										Linking.openURL(event.url);
										index = index + 1;
										this.setState({ count: 2 });
									}
								}}
							/>
						</View>
					</View> : null
			}
		</View>
	);

	goToSettings = () => {
		try {
			if (this.state.settingFlag) {
				return;
			} else {
				this.setState({ settingFlag: true });
				this.props.navigator.resetTo({
					screen: 'TVM.SettingsScreen',
					navigatorStyle: { navBarHidden: true }
				});
				setTimeout(() => { this.setState({ settingFlag: false }) }, 5000);
			}
		}
		catch (err) {
			StyleMethods.LogException("Landing / settings / " + err.message);
		}
	}

	render() {
		const { allCategories } = this.state;
		return (
			<View style={cs.container}>
				{this.state.isModalVisible ?
					<View style={ms.modalTransparentBG}></View>
					: null}
				<Modal backdropOpacity={0} animationOut="slideOutUp" animationIn="slideInDown" animationInTiming={1000} animationOutTiming={1000} backdropTransitionInTiming={3000} backdropTransitionOutTiming={3000} style={ms.menuModal} isVisible={this.state.isModalVisible}>
					<MenuModal onSelect={this.updateScreen.bind(this)} ref={(ref) => this.privacyModalOBJ = privacyModalOBJ = ref} />
				</Modal>
				<View style={nf.topView}>
					<ImageBackground style={nf.topViewLeft} source={require('../../common/assets/img/bg-storyfeed.png')}>
						{(!this.state.isModalVisible) ?
							<TouchableOpacity style={nf.menuButton} onPress={this._showMenu.bind(this)}>
								<Image style={nf.menuImage} source={require('../../common/assets/img/menu-icon.png')} />
							</TouchableOpacity> : null}
					</ImageBackground>
					<View style={nf.topViewRight}>
						<TouchableOpacity onPress={this.goToSettings} style={nf.usernameView}>
							<Text style={nf.welcomeText}>{this.state.welcomeText}</Text>
							<Text style={nf.welcomeText}>{this.state.name}</Text>
						</TouchableOpacity>
						<View style={nf.initialnameView}>
							<TouchableOpacity onPress={this.goToSettings} style={nf.piView}>
								<Text style={nf.piText}>{this.state.initials}</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
				<View style={nf.bottomView}>
					{(this.state.allCategories.length !== 0) ?
						<ScrollableTabView ref={(ref) => this.mainTabs = ref} renderTabBar={() => <ScrollableTabBar />} prerenderingSiblingsNumber={Infinity} tabBarTextStyle={nf.tabText} tabBarBackgroundColor={'transparent'} tabBarActiveTextColor={COLORS.PRIMARYTEXT} tabBarInactiveTextColor={COLORS.BLUETHEMECOLOR} tabBarUnderlineStyle={{ backgroundColor: 'transparent' }}>
							{allCategories.map((category, key) => {
								return (
									<View key={key} tabLabel={category.name.toUpperCase()} style={{ flex: 1 }}>
										{category.name == staticTabs.Saved.name && this.state.newsFeed[key].length == 0 ?
											<Text style={nf.noListItem}>{this.props.appdata.profiledata.titles.no_saved_story ? this.props.appdata.profiledata.titles.no_saved_story : 'No saved story.'}</Text>
											:
											<FlatList
												data={this.state.newsFeed[key]}
												keyExtractor={(item, index) => index + ''}
												renderItem={({ item, index }) => (category.name == staticTabs.Saved.name || category.name == staticTabs.NonStopNews.name) ? this._renderSavedFeeds({ item }) : this._rendernewsFeeds({ item, index }, key)}
												// renderItem={({ item, index }) => (category.name == staticTabs.Saved.name || category.name == staticTabs.NonStopNews.name) ? this._renderSavedFeeds({ item }) : this._rendernewsFeeds({ item, index }, key)}
												refreshControl={
													<RefreshControl
														refreshing={this.state.refreshing}
														onRefresh={this._onRefresh.bind(this)}
													/>
												}
											/>
										}
									</View>
								)
							})}
						</ScrollableTabView>
						: null}
				</View>
				<Toast ref="redtoast" style={cs.redtoastBackground} textStyle={cs.redtoast} position={'top'} />
				<Indicator ref={(ref) => this.indicatorOBJ = indicatorOBJ = ref} />

			</View>
		);
	}
}

Landing.propTypes = {
	actions: PropTypes.object.isRequired,
	navigator: PropTypes.object
};

function mapStateToProps(state, ownProps) {
	return {
		appdata: state.appdata
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(loginActions, dispatch)
	};
}

function stripEndQuotes(s) {
	var t = s.length;
	if (s.charAt(0) == '"') s = s.substring(1, t--);
	if (s.charAt(--t) == '"') s = s.substring(0, t);
	return s;
}

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
