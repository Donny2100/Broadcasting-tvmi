import React, { Component } from 'react';
import {
	View,
	Text,
	Image,
	Alert,
	Dimensions,
	TextInput,
	TouchableOpacity,
	ImageBackground,
	FlatList,
	ScrollView,
	BackHandler,
	AppState,
	Platform
} from 'react-native';
import PropTypes from 'prop-types';
import IMAGES from '../../common/images';
import { commonStyle as cs, newsFeed as nf, bulletins as bi, ModalStyle as ms } from '../../common/style';
import StyleMethods from '../../common/Style_Methods';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as loginActions from '../../common/reducers/app.actions';
import TextField from '../../common/libs/FloatingLabel/TextField';
import network from '../../common/network';
import firebase, { Notification } from 'react-native-firebase';
import LinearGradient from 'react-native-linear-gradient';
import MenuModal from '../menu/MenuModal';
import Modal from "react-native-modal";
import Realm from '../../common/realm';
import Indicator from '../../common/libs/indicator';
import { CachedImage } from "react-native-img-cache";
import { Analytics, Hits as GAHits, Experiment as GAExperiment } from 'react-native-google-analytics';
import DeviceInfo from 'react-native-device-info';
var indicatorOBJ = null;
import Toast, { DURATION } from 'react-native-easy-toast';
var privacyModalOBJ = null;

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');


class BulletIns extends Component {
	constructor(props) {
		super(props);
		this.state = {
			page: 'topstories',
			isModalVisible: false,
			newsfeedFlag: false,
			bullet_url: '',
			bullet_thumbnail: '',
			bullet_date: '',
			bullet_label: '',
			nextepDate: '',
			nextLabel: '',
			videoDetails: [],
			videoText1: '',
			appState: '',
			label: '',
			experiments: {},
		};
		this._handleAppStateChange = this._handleAppStateChange.bind(this);
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

	_showMenu = () => {
		this.setState({ isModalVisible: !this.state.isModalVisible })
	}

	componentWillMount() {
		if (Platform.OS === 'android') {
			BackHandler.addEventListener('hardwareBackPress', this.onBackHandler);
		}
		AppState.addEventListener('change', this._handleAppStateChange);
	}

	componentWillUnmount() {
		if (Platform.OS === 'android') {
			BackHandler.removeEventListener('hardwareBackPress', this.onBackHandler);
		}
		AppState.removeEventListener('change', this._handleAppStateChange);
	}

	onBackHandler = () => {
		this.close();
		return true;
	}

	close() {
		this.props.navigator.resetTo({
			screen: 'TVM.Landing',
			navigatorStyle: StyleMethods.newNavigationStyle(),
			animationType: 'fade',
			animated: true,
		});
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

	componentDidMount() {
		let experiment = this.state.experiments['welcome-message'];
		let clientId = DeviceInfo.getUniqueID();
		let ga = new Analytics('UA-44380471-1', clientId, 1, DeviceInfo.getUserAgent());
		let events = new GAHits.Event(
			'Featured_Videos',
			'screen opens',
			'Featured_Videos',
			'',
			experiment
		);
		ga.send(events);
		var user = this.props.appdata.profiledata;
		this.setState({ videoText1: this.toTitleCase(user.titles.featured_videos) });
		this.newsFeedData();
	}

	toTitleCase(str) {
		return str.replace(/\w\S*/g, function (txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	}

	newsFeedData = () => {
		try {
			indicatorOBJ.setModalVisible(true);
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
			network.TimeMethod("POST", "featuredVideos", (flag, response) => {
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
						this.refs.redtoast.show('Something went wrong, please try again!', 3000);
					} else {
						var nextEpisode = response.next;
						var bulletins = response.bulletins;
						var featured_array = response.videos.data;
						var featuredVideos = [];
						for (var i = 0; i < featured_array.length; i++) {
							featuredVideos.push({
								id: featured_array[i].id, title: featured_array[i].title, thumbnail: featured_array[i].thumbnail,
								date: featured_array[i].date, url: featured_array[i].url
							});
						}
						this.setState({ bullet_url: bulletins.url, label: response.videos.label, bullet_date: bulletins.date, bullet_thumbnail: bulletins.image, bullet_label: bulletins.label, videoDetails: featuredVideos, nextepDate: nextEpisode.data, nextLabel: nextEpisode.label });
					}
				} else {
					this.refs.redtoast.show(response, 3000);
					console.log(response);
				}
				indicatorOBJ.setModalVisible(false);
			}, null, formBody);
		}
		catch (err) {
			StyleMethods.LogException("Featured Videos / featuredVideos / " + err.message);
		}
	}

	onlinkclick(videoUrl) {
		try {
			if (this.state.newsfeedFlag) {
				return;
			} else {
				this.setState({ newsfeedFlag: true });
				this.props.navigator.push({
					passProps: { videoUrl },
					screen: 'TVM.WebPages',
					navigatorStyle: StyleMethods.newNavigationStyle(),
					animationType: 'fade',
					animated: true
				});
				setTimeout(() => { this.setState({ newsfeedFlag: false }) }, 3000);
			}
		}
		catch (err) {
			StyleMethods.LogException("Featured Videos / bulletins / " + err.message);
		}
	}

	onClickBulletIns(videoUrl) {
		try {
			if (this.state.newsfeedFlag) {
				return;
			} else {
				/*
				'video url:'+videoUrl.toString(),
				videoUrl.toString(),
				*/
				let experiment = this.state.experiments['welcome-message'];
				let clientId = DeviceInfo.getUniqueID();
				let ga = new Analytics('UA-44380471-1', clientId, 1, DeviceInfo.getUserAgent());
				let events = new GAHits.Event(
					'BulletIns',
					'video opens',
					'video url',
					videoUrl.toString(),
					experiment
				);
				ga.send(events);

				this.setState({ newsfeedFlag: true });
				this.props.navigator.push({
					passProps: { videoUrl },
					screen: 'TVM.Simpleweb',
					navigatorStyle: StyleMethods.newNavigationStyle(),
					animationType: 'fade',
					animated: true
				});
				setTimeout(() => { this.setState({ newsfeedFlag: false }) }, 3000);
			}
		}
		catch (err) {
			StyleMethods.LogException("Featured Videos / bulletins / " + err.message);
		}
	}

	onClickSimpleWeb(item) {
		try {
			if (this.state.newsfeedFlag) {
				return;
			} else {
				/*
				'video url:'+item.url,
				item.url.toString(),
				*/
				let experiment = this.state.experiments['welcome-message'];
				let clientId = DeviceInfo.getUniqueID();
				let ga = new Analytics('UA-44380471-1', clientId, 1, DeviceInfo.getUserAgent());
				let events = new GAHits.Event(
					'Featured_Video',
					'video opens',
					'video url',
					item.url.toString(),
					experiment
				);
				ga.send(events);
				let videoUrl = item.url;
				this.setState({ newsfeedFlag: true });
				this.props.navigator.push({
					passProps: { videoUrl },
					screen: 'TVM.Simpleweb',
					navigatorStyle: StyleMethods.newNavigationStyle(),
					animationType: 'fade',
					animated: true
				});
				setTimeout(() => { this.setState({ newsfeedFlag: false }) }, 3000);
			}
		}
		catch (err) {
			StyleMethods.LogException("Featured Videos / featured video / " + err.message);
		}
	}

	_rendernewsBulletins = ({ item }) => (
		<LinearGradient colors={['#062244', '#3b5998']} style={bi.bulletinslistSingleView}>
			<TouchableOpacity style={bi.rowTouchView} onPress={() => this.onClickSimpleWeb(item)}>
				<View style={bi.rowTouchstartView}>
					{(Platform.OS === 'ios') ?
						<CachedImage style={bi.videoImage} source={{ uri: (item.thumbnail) }} borderRadius={StyleMethods.getFontSize(3)} borderWidth={StyleMethods.getFontSize(2)} borderColor='#C51A25' />
						:
						<Image style={bi.videoImage} source={{ uri: (item.thumbnail) }} borderRadius={StyleMethods.getFontSize(3)} borderWidth={StyleMethods.getFontSize(2)} borderColor='#C51A25' />
					}
					<Image source={IMAGES.STORY_PLAY} style={{ position: 'absolute', top: (StyleMethods.getHeight() * 0.04), left: (StyleMethods.getHeight() * 0.09), height: (StyleMethods.getHeight() * 0.04), width: (StyleMethods.getHeight() * 0.04), resizeMode: 'contain' }} />
				</View>
				<View style={bi.rowTouchcenterView}>
					<Text style={bi.videoname}>{item.title}</Text>
					<Text style={bi.videodate}>{item.date}</Text>
				</View>
				<View style={bi.rowTouchendView}>
					<Image source={IMAGES.PLAY} style={{ height: (StyleMethods.getHeight() * 0.05), width: (StyleMethods.getHeight() * 0.04), resizeMode: 'contain' }} />
				</View>
			</TouchableOpacity>
		</LinearGradient>
	);

	render() {
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
						<View style={bi.toptextView}>
							<Text style={bi.toptext}>{this.state.videoText1}</Text>
						</View>
					</View>
				</View>
				<View style={nf.bottomView}>
					<View style={bi.bulletsinstabsView}>
						<Text style={bi.tabstext}>{this.state.nextLabel}</Text>
						<Text style={bi.tabstext}>{this.state.nextepDate}</Text>
					</View>
					<View style={bi.bulletinsbelowTabsView}>

						<LinearGradient colors={['#062244', '#3b5998']} style={bi.bulletinslistSingleView}>
							<TouchableOpacity style={bi.rowTouchView} onPress={() => this.onClickBulletIns(this.state.bullet_url)}>
								<View style={bi.rowTouchstartView}>
									{(Platform.OS === 'ios') ?
										<CachedImage style={bi.videoImage} source={{ uri: (this.state.bullet_thumbnail) }} borderRadius={StyleMethods.getFontSize(3)} borderWidth={StyleMethods.getFontSize(2)} borderColor='#C51A25' />
										:
										<Image style={bi.videoImage} source={{ uri: (this.state.bullet_thumbnail) }} borderRadius={StyleMethods.getFontSize(3)} borderWidth={StyleMethods.getFontSize(2)} borderColor='#C51A25' />
									}
									<Image source={IMAGES.STORY_PLAY} style={{ position: 'absolute', top: (StyleMethods.getHeight() * 0.04), left: (StyleMethods.getHeight() * 0.09), height: (StyleMethods.getHeight() * 0.04), width: (StyleMethods.getHeight() * 0.04), resizeMode: 'contain' }} />
								</View>
								<View style={bi.rowTouchcenterView}>
									<Text style={bi.videoname}>{this.state.bullet_label}</Text>
									<Text style={bi.videodate}>{this.state.bullet_date}</Text>
								</View>
								<View style={bi.rowTouchendView}>
									<Image source={IMAGES.PLAY} style={{ height: (StyleMethods.getHeight() * 0.05), width: (StyleMethods.getHeight() * 0.04), resizeMode: 'contain' }} />
								</View>
							</TouchableOpacity>
						</LinearGradient>

						<View style={{ height: StyleMethods.getFontSize(60), backgroundColor: '#04162B', justifyContent: 'center', paddingLeft: StyleMethods.getFontSize(20) }}>
							<Text style={bi.featuredVideosheadingText}>{this.state.label}</Text>
						</View>
						<FlatList
							data={this.state.videoDetails}
							renderItem={this._rendernewsBulletins.bind(this)}
						/>
					</View>
				</View>
				<Indicator ref={(ref) => this.indicatorOBJ = indicatorOBJ = ref} />
				<Toast style={cs.redtoast} ref="redtoast" position={'top'} />
			</View>
		);
	}
}

BulletIns.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(BulletIns);
