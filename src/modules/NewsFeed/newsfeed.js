import React, { Component } from 'react';
import {
	View,
	Text,
	Image,
	Dimensions,
	TouchableOpacity,
	FlatList,
	RefreshControl,
	WebView,
	BackHandler,
	ActivityIndicator,
	AppState,
	StatusBar,
	Platform
} from 'react-native';
import PropTypes from 'prop-types';
import COLORS from '../../common/colors';
import IMAGES from '../../common/images';
import { commonStyle as cs, newsFeed as nf, storyPage as sp, ModalStyle as ms } from '../../common/style';
import StyleMethods from '../../common/Style_Methods';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as loginActions from '../../common/reducers/app.actions';
import network from '../../common/network';
import Indicator from '../../common/libs/indicator';
import MenuModal from '../menu/MenuModal';
import Modal from "react-native-modal";
import Realm from '../../common/realm';
import Toast from 'react-native-easy-toast';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { CachedImage } from "react-native-img-cache";
import Share from 'react-native-share';
import Orientation from 'react-native-orientation';
import { Analytics, Hits as GAHits } from 'react-native-google-analytics';
import DeviceInfo from 'react-native-device-info';
import GlobalEvent from '../../common/GlobalEvent';


class Newsfeed extends Component {
	constructor(props) {
		super(props);

		let userprofiledata = Realm.ReadData('UserProfile');
    
		let user = JSON.parse(userprofiledata[0].profiledata);
		let fontSize = user.big_font_size;

		console.log("User Profile", user, fontSize);
	
		this.jsCode = `
			setTimeout(() => {
				window.postMessage(document.body.clientHeight);
				${fontSize ? 'document.getElementById("btn-text-large").click();' : 
							 'document.getElementById("btn-text-normal").click();'}
			}, 100);

			document.getElementById("btn-text-normal").addEventListener("click", function() {
				window.postMessage(document.body.clientHeight);
			});

			document.getElementById("btn-text-large").addEventListener("click", function(){
				window.postMessage(document.body.clientHeight);
			});
		`;

		if (this.props.hasOwnProperty('item')) {
			this.state = {
				storyCover: this.props.item.image,
				storyTitle: this.props.item.title,
				storySubtitle: this.props.item.subtitle,
				storyHasvideo: this.props.item.has_video,
				url: '',
				refreshing: false,
				relatedVideos: [],
				isModalVisible: false,
				newsfeedFlag: false,
				related_flag: false,
				label: '',
				IndicatorModalFlag: false,
				appState: '',
				shareLabel: '',
				shareUrl: '',
				visible: false,
				experiments: {},
				isSaved: false,
				feedDetail: null,
				wbHeight: 300,
			};
		} else {
			this.state = {
				imageDetails: '',
				storyCover: '',
				storyTitle: '',
				storySubtitle: '',
				storyHasvideo: '',
				url: '',
				cacheHtml: null,
				isLocal: false,
				refreshing: false,
				relatedVideos: [],
				isModalVisible: false,
				newsfeedFlag: false,
				related_flag: false,
				label: '',
				IndicatorModalFlag: false,
				appState: '',
				shareLabel: '',
				shareUrl: '',
				visible: false,
				experiments: {},
				isSaved: false,
				feedDetail: null,
				wbHeight: 300,
			};
		}
		this._handleAppStateChange = this._handleAppStateChange.bind(this);
	}

	onCancel() {
		console.log("CANCEL")
		this.setState({ visible: false });
	}

	onOpen() {
		console.log("OPEN")
		this.setState({ visible: true });
	}

	_handleAppStateChange = (nextAppState) => {
		if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
			console.log("appState", this.state.appState);
			if (this.props.appdata.currentTrack !== 0 && this.props.appdata.currentTrack !== undefined) {
				console.log("page", this.props.appdata.currentTrack);
				console.log("props", this.props);
				var temp = '';
				this.props.navigator.resetTo({
					passProps: { temp },
					screen: 'TVM.LiveTv',
					navigatorStyle: StyleMethods.newNavigationStyle(),
					animated: false
				});
			}
		}
		this.setState({ appState: nextAppState });
	}

	componentDidMount() {
		if (this.props.hasOwnProperty('advertUrl')) {
			this.setState({ url: this.props.advertUrl });
		} else {
			this.newsStory(this.props.id);
		}
		if (Platform.OS === 'ios') {
			Orientation.unlockAllOrientations();
		}
	}

	componentWillMount() {
		if (Platform.OS === 'android') {
			BackHandler.addEventListener('hardwareBackPress', this.onBackHandler);
		}
		if (Platform.OS === 'ios') {
			Dimensions.addEventListener('change', () => {
				StatusBar.setHidden(false);
			});
		}
		AppState.addEventListener('change', this._handleAppStateChange);
	}

	componentWillUnmount() {
		if (Platform.OS === 'android') {
			BackHandler.removeEventListener('hardwareBackPress', this.onBackHandler);
		}
		if (Platform.OS === 'ios') {
			Dimensions.removeEventListener('change', () => {
				StatusBar.setHidden(false);
			});
			Orientation.lockToPortrait();
		}
		AppState.removeEventListener('change', this._handleAppStateChange);
	}

	onBackHandler = () => {
		this.close();
		return true;
	}

	close() {
		this.props.id = null;
		this.props.navigator.popToRoot({
			animationType: 'fade',
			animated: true,
		});
	}

	_onRefresh() {
		this.close();
	}

	_showMenu = () => {
		this.setState({ isModalVisible: !this.state.isModalVisible })
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

	getSavedFeed(id) {
		let items = Realm.ReadDataWithFilters('NewsFeed', 'id == ' + id);
		return items && items.length > 0 ? this.cloneFeed(items[0]) : null;
	}

	// need this function to clone the realm object to javascript object
	cloneFeed(origin) {
		var result = {
			id: origin.id,
			date: origin.date,
			category: origin.category,
			url: origin.url,
			cache_html: origin.cache_html,
			height: origin.height,
			type: origin.type,
			title: origin.title,
			subtitle: origin.subtitle,
			image: origin.image,
			has_video: origin.has_video,
			has_gallery: origin.has_gallery,
			related_label: origin.related_label,
			share_url: origin.share_url,
			share_label: origin.share_label,
			is_related: origin.is_related,
			related_news_feeds: []
		};
		if (origin.related_news_feeds && origin.related_news_feeds.length > 0) {
			origin.related_news_feeds.forEach((item) => {
				result.related_news_feeds.push(this.cloneFeed(item));
			});
		}
		return result;
	}

	newsStory = (id) => {
		try {
			this.setState({ IndicatorModalFlag: true });
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
			var language = this.props.appdata.profiledata;
			network.TimeMethod("POST", "getStory?id=" + id, (flag, response) => {
				try {
					var related_data = null;
					var allVideos = [];

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
							console.log(response.error);
							this.refs.redtoast.show('Something went wrong, please try again!', 3000);
						} else {
							if (response.length > 0) {
								related_data = response[0];
								console.log(videos);
								if (related_data.related.data.length !== 0) {
									var videos = related_data.related.data;
									for (var i = 0; i < videos.length; i++) {
										allVideos.push({
											id: videos[i].ID, image: videos[i].image, title: videos[i].title, subtitle: videos[i].subtitle, url: videos[i].url,
											has_video: videos[i].has_video, has_gallery: videos[i].has_gallery
										});
									}
								}
								related_data.is_local = false;
								/*
															'article url: '+related_data.url,
															related_data.url,
								*/
								let experiment = this.state.experiments['welcome-message'];
								let clientId = DeviceInfo.getUniqueID();
								let ga = new Analytics('UA-44380471-1', clientId, 1, DeviceInfo.getUserAgent());
								let events = new GAHits.Event(
									'Story_Page',
									'article opens',
									'article url',
									related_data.url.toString(),
									experiment
								);
								ga.send(events);

								console.log("Story Url", related_data.url);
							} else {
								console.log('No data for feed');
								this.refs.redtoast.show('No data for News feeds found', 3000);
							}
						}
					} else {
						console.log(response);
						this.refs.redtoast.show(response, 3000);
					}

					let saveFeed = this.getSavedFeed(id);
					// if cannot get data from remote server, it'll try to get from local
					if (!related_data) {
						related_data = saveFeed;
						if (related_data) {
							related_data.is_local = true;
						}
					}

					if (related_data) {
						if (saveFeed) {
							related_data.is_saved = true;
						}
						related_data.id = id;
					}

					if (related_data) {
						this.setState({
							relatedVideos: related_data.is_local ? related_data.related_news_feeds : allVideos, url: related_data.url, storyCover: related_data.image, storyTitle: related_data.title, storySubtitle: related_data.subtitle,
							storyHasvideo: related_data.has_video, label: related_data.is_local ? related_data.related_label : related_data.related.label,
							shareUrl: related_data.is_local ? related_data.share_url : related_data.share.url, shareLabel: related_data.is_local ? related_data.share_label : related_data.share.label,
							cacheHtml: related_data.cache_html, isLocal: related_data.is_local, isSaved: related_data.is_saved, feedDetail: related_data
						});
					}
				} catch (e) {
					console.log(e);
				}
			}, null, formBody);
		}
		catch (err) {
			StyleMethods.LogException("Story Page / getStory / " + err.message);
		}
	}

	onlinkclick(item) {
		try {
			if (this.state.newsfeedFlag) {
				return;
			} else {
				var id = item.id;
				this.setState({ newsfeedFlag: true });
				this.props.navigator.push({
					passProps: { id, item },
					screen: 'TVM.Newsfeed',
					navigatorStyle: StyleMethods.newNavigationStyle(),
					animationType: 'fade',
					animated: true
				});
				setTimeout(() => { this.setState({ newsfeedFlag: false }) }, 3000);
			}
		}
		catch (err) {
			StyleMethods.LogException("Story Page / Related_Story Clicked / " + err.message);
		}
	}

	_relatedVideos = () => {
		if (Platform.OS === 'android') {
			setTimeout(() => { this.setState({ related_flag: true, IndicatorModalFlag: false }) }, 2000
			);
		} else {
			this.setState({ related_flag: true, IndicatorModalFlag: false });
		}
	}

	handleMessage(evt) {
		const { data } = evt.nativeEvent
		if(isNaN(data)) return;

		console.log("Handle Message", data)
		this.setState({wbHeight: Number(data)})
	}

	handleNavState(evt) {
		console.log("Nav State Message", evt)
	}

	_rendernewsFeeds = ({ item }) => (
		<TouchableOpacity style={nf.relatedStoryrowView} onPress={() => { this.onlinkclick(item); this.setState({ url: '' }) }}>
			<View style={{ flex: 0.3 }}>
				{(Platform.OS === 'ios') ?
					<CachedImage source={{ uri: (item.image) }} style={{ flex: 1, marginLeft: (StyleMethods.getHeight() * 0.02), marginVertical: (StyleMethods.getHeight() * 0.02), borderRadius: StyleMethods.getFontSize(10), resizeMode: 'cover' }} />
					:
					<Image source={{ uri: (item.image) }} style={{ flex: 1, marginLeft: (StyleMethods.getHeight() * 0.02), marginVertical: (StyleMethods.getHeight() * 0.02), borderRadius: StyleMethods.getFontSize(10), resizeMode: 'cover' }} />
				}
			</View>
			<View style={{ flex: 0.7, justifyContent: 'center', paddingHorizontal: StyleMethods.getFontSize(10) }}>
				<Text style={nf.relatedStoryCategory}>{item.subtitle}</Text>
				<Text style={nf.relatedStoryText}>{item.title}</Text>
			</View>
		</TouchableOpacity>
	);

	onweblinkclick(id) {
		try {
			if (this.state.newsfeedFlag) {
				return;
			} else {
				var item = '';
				this.setState({ newsfeedFlag: true });
				this.props.navigator.push({
					passProps: { id, item },
					screen: 'TVM.Newsfeed',
					navigatorStyle: StyleMethods.newNavigationStyle(),
					animationType: 'fade',
					animated: true
				});
				setTimeout(() => { this.setState({ newsfeedFlag: false }) }, 3000);
			}
		}
		catch (err) {
			StyleMethods.LogException("Story Page / story_Link Clicked / " + err.message);
		}
	}

	onSelect(id) {
		this.onweblinkclick(id);
	}

	async onSaveFeedClicked() {
		if (this.state.isLoading) return;

		this.setState({ isLoading: true });
		
		try {
			let feedDetail = this.state.feedDetail;
			if (!this.state.isSaved) { // if item is not saved => save the item
				try {
					let response = await fetch(feedDetail.url);
					let html = await response.text();
					feedDetail.cache_html = html;
					Realm.WriteData('NewsFeed', feedDetail);
					this.updateUIForSavedOrUnSavedItem();
				} catch (e) {
					console.log(e);
					this.refs.redtoast.show(this.props.appdata.profiledata.titles.save_feed_error, 3000);
				}
			} else { // if item is saved => unsave the item
				Realm.DeleteDataWithFilters('NewsFeed', 'id == ' + feedDetail.id);
				this.updateUIForSavedOrUnSavedItem();
			}
			GlobalEvent.publishEvent('RefreshNewsFeedData');
		} catch (e) {
			console.log(e);
			this.refs.redtoast.show('Cannot to ' + (this.state.isSaved ? 'unsave' : 'save') + ' the feed. Please try again!', 3000);
		} finally {
			this.setState({ isLoading: false });
		}
	}

	updateUIForSavedOrUnSavedItem() {
		this.setState({
			isSaved: !this.state.isSaved
		});
	}

	render() {

		let shareOptions = {
			title: this.state.shareLabel,
			message: "",
			url: this.state.shareUrl,
		};
		return (
			<View style={cs.container}>
				{this.state.isModalVisible ?
					<View style={ms.modalTransparentBG}></View>
					: null}
				<Modal backdropOpacity={0} animationOut="slideOutUp" animationIn="slideInDown" animationInTiming={1000} animationOutTiming={1000} backdropTransitionInTiming={3000} backdropTransitionOutTiming={3000} style={ms.menuModal} isVisible={this.state.isModalVisible}>
					<MenuModal onSelect={this.updateScreen.bind(this)} ref={(ref) => this.privacyModalOBJ = privacyModalOBJ = ref} />
				</Modal>
				<ParallaxScrollView
					style={{ flex: 1, backgroundColor: 'hotpink', overflow: 'hidden' }}
					ref={(scrollView) => { this.scrollView = scrollView }}
					refreshControl={
						<RefreshControl
							refreshing={this.state.refreshing}
							onRefresh={this._onRefresh.bind(this)}
						/>
					}
					renderBackground={() => <Image source={{ uri: (this.state.storyCover), width: StyleMethods.getWidth(), height: StyleMethods.getWidth() }} />}
					renderFixedHeader={() =>
						<View style={nf.topViewparallex}>
							<View style={nf.topViewLeftparallex}>
								{(!this.state.isModalVisible) ?
									<TouchableOpacity style={nf.newsfeedmenuButton} onPress={this._showMenu.bind(this)}>
										<Image style={nf.menuImage} source={require('../../common/assets/img/menu-icon.png')} />
									</TouchableOpacity> : null}
							</View>
							<View style={nf.topViewRightparallex}>
								<TouchableOpacity style={{ position: 'absolute', right: 0, top: 0 }} onPress={this.close.bind(this)}>
									<Image source={require('../../common/assets/img/closestory-icon.png')} style={{ height: StyleMethods.getFontSize(20), width: StyleMethods.getFontSize(20), padding: StyleMethods.getFontSize(15), resizeMode: 'contain' }} />
								</TouchableOpacity>
							</View>
						</View>
					}
					parallaxHeaderHeight={StyleMethods.getWidth()}
					renderForeground={() =>
						<View style={sp.mainView}>
							{(this.state.storyHasvideo === 1) ?
								<Image source={IMAGES.STORY_PLAY} style={{ alignSelf: 'flex-end', marginBottom: StyleMethods.getFontSize(20), height: StyleMethods.getFontSize(38), width: StyleMethods.getFontSize(38), resizeMode: 'contain' }} />
								: null}
							<View style={nf.feedsimageBottom2}>
								<Text style={nf.categoryText}>{this.state.storySubtitle}</Text>
							</View>
							<View style={sp.storyimageBottom}>
								<Text style={nf.categorytitleText}>{this.state.storyTitle}</Text>
							</View>
						</View>
					}>
					{this.state.IndicatorModalFlag ?
						<View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center', left: 0, right: 0, top: 20, zIndex: 100, backgroundColor: 'rgba(255,255,255,.5)' }}>
							<ActivityIndicator size="large" color={COLORS.BUTTONBG} />
						</View> : null
					}
					<View>
					<WebView
							style={{height: this.state.wbHeight}}
							source={this.state.isLocal ? { html: this.state.cacheHtml } : { uri: this.state.url }}
							startInLoadingState={false}
							javaScriptEnabled={true}
							domStorageEnabled={true}
							automaticallyAdjustContentInsets={true}
							injectedJavaScript={this.jsCode}
							onSelect={this.onSelect.bind(this)}
							onNavigationStateChange={(evt) => this.handleNavState(evt)}
							onMessage={(evt) => this.handleMessage(evt)}
							onLoad={() => { this._relatedVideos() }}
						/>
						{this.state.isLocal ?
							<View style={{ backgroundColor: 'white', width: '100%', height: StyleMethods.getFontSize(30), position: 'absolute' }} />
							: null}
					</View>
					<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: StyleMethods.getFontSize(60), backgroundColor: '#DADEE5' }}>
						{(this.state.relatedVideos.length !== 0 && this.state.related_flag === true) ?
							<TouchableOpacity style={{ height: StyleMethods.getFontSize(60), marginTop: StyleMethods.getFontSize(10), justifyContent: 'center', alignItems: 'center', marginHorizontal: StyleMethods.getFontSize(10) }} onPress={() => {
								this.onCancel();
								setTimeout(() => {
									Share.open(shareOptions)
								}, 300);
							}}>
								<Image style={nf.shareIcon} source={IMAGES.SHARE_ICON} />
								<Text style={nf.sharetext}>{this.state.shareLabel}</Text>
							</TouchableOpacity>
							: null}
						<TouchableOpacity style={{ height: StyleMethods.getFontSize(60), marginTop: StyleMethods.getFontSize(10), justifyContent: 'center', alignItems: 'center', marginHorizontal: StyleMethods.getFontSize(10) }} onPress={() => this.onSaveFeedClicked()}>
							<Image style={nf.shareIcon} source={this.state.isSaved == true ? IMAGES.REMOVE_SAVE_ICON : IMAGES.UNSAVE_ICON} />
							<Text style={nf.sharetext}>{this.state.isSaved == true ? "Unsave" : "Save"}</Text>
						</TouchableOpacity>
					</View>
					{(this.state.relatedVideos.length !== 0 && this.state.related_flag === true) ?
						<View style={{ backgroundColor: '#082F5E' }}>
							<View style={{ height: (StyleMethods.getHeight() * 0.1), marginHorizontal: StyleMethods.getFontSize(20), justifyContent: 'center', borderBottomWidth: StyleMethods.getFontSize(1), borderBottomColor: 'white' }}>
								<Text style={nf.relatedStoryheadingtext}>{this.state.label}</Text>
							</View>
							<FlatList
								data={this.state.relatedVideos}
								renderItem={this._rendernewsFeeds.bind(this)}
							/>
						</View>
						: null}

				</ParallaxScrollView>
				<Toast style={cs.redtoastBackground} textStyle={cs.redtoast} ref="redtoast" position={'top'} />
				{this.state.isLoading ? 
					<Indicator modalVisible={true} />
					: null
				}
				
			</View>
		);
	}
}

Newsfeed.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Newsfeed);
