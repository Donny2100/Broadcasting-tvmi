import React, {  Component } from 'react';
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
  WebView,
	BackHandler,
	Platform
} from 'react-native';
import PropTypes from 'prop-types';
import IMAGES from '../../common/images';
import { commonStyle as cs, bulletins as bi, newsFeed as nf, storyPage as sp, livetv as lt,  ModalStyle as ms } from '../../common/style';
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
import MyWebView from 'react-native-webview-autoheight';
import {Analytics, Hits as GAHits, Experiment as GAExperiment} from 'react-native-google-analytics';
import DeviceInfo from 'react-native-device-info';
import ScrollableTabView, { DefaultTabBar, } from 'react-native-scrollable-tab-view';
import Toast, {DURATION} from 'react-native-easy-toast';
import TrackPlayer, {CAPABILITY_PAUSE, CAPABILITY_PLAY, CAPABILITY_STOP} from 'react-native-track-player';
import {CachedImage} from "react-native-img-cache";
var indicatorOBJ = null;
var privacyModalOBJ = null;
const databaseobj = firebase.database();
const tvref = databaseobj.ref('/web/upcoming-programmes/tv');

class LiveTv extends Component {
	constructor(props) {
		super(props);
    this.state={
      page:'tv',
			isModalVisible: false,
			fixed_url:'',
			fixed_label:'TVMi',
      tvdata:[],
			radiodata:[],
			newsfeedFlag:false,
			liveTvDB:null,
			radioLabel:'RADIO',
			experiments: {},
    };
	}

	componentWillMount = () => {
		if(Platform.OS === 'android'){
			BackHandler.addEventListener('hardwareBackPress', this.onBackHandler);
		}
		tvref.on('value', (e) => {
			if(e.val() !== null){
				this.setState({liveTvDB:e.val()});
				this.props.actions.TvData(e.val());
				this.newsStory();
			}else{
				if(this.props.appdata.hasOwnProperty('tvdata') && this.props.appdata.tvdata){
					var newdata = this.props.appdata.tvdata;
					this.setState({liveTvDB:newdata});
				}
			}
		});
	}

  componentDidMount(){
		let experiment = this.state.experiments['welcome-message'];
		let clientId = DeviceInfo.getUniqueID();
		let ga = new Analytics('UA-44380471-1', clientId, 1, DeviceInfo.getUserAgent());
		let events = new GAHits.Event(
			'Live',
			'screen opens',
			'Live',
			'',
			experiment
		);
		ga.send(events);
		indicatorOBJ.setModalVisible(true);
		this.newsStory();
  }

	componentWillReceiveProps(nextProps){
//		const track_data = Realm.ReadData('MediaPlayer');
//		const current_track = (Platform.OS === 'android')?((this.props.appdata.currentTrack)?this.props.appdata.currentTrack:(track_data.length !== 0)?track_data[track_data.length-1].track:null):(this.props.appdata.currentTrack);
//		const current_state = (Platform.OS === 'android')?((this.props.appdata.status)?this.props.appdata.status:(track_data.length !== 0)?track_data[track_data.length-1].data:null):(this.props.appdata.status);
		const current_track = this.props.appdata.currentTrack;
		const current_state = this.props.appdata.status;

		var currentArray = this.state.radiodata;
		var newArray = [];
		for(var i = 0; i < currentArray.length; i++){
			if(current_track === i+1){
				newArray.push({id:i+1, name:currentArray[i].name, url:currentArray[i].url, logo:currentArray[i].logo, playing:current_state});
			}else{
				newArray.push({id:i+1, name:currentArray[i].name, url:currentArray[i].url, logo:currentArray[i].logo, playing:false});
			}
		}
		this.setState({radiodata:newArray});
	}

	newsStory = () => {
		try{
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
			network.TimeMethod("POST", "live", (flag, response)=>{
				if(flag === true){
					if(response.hasOwnProperty('error')){
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
					}else{
						livetv_data = response.tv.data;
						tv_array = [];
						radio_data = response.radio.data;
						radio_array = [];
						fixed_data = response.fixed;
						let tv_Name = response.tv.label.toUpperCase();
						let radio_Name = response.radio.label.toUpperCase();
						let second_Name = response.fixed.label.toUpperCase();

	//					const track_data = Realm.ReadData('MediaPlayer');
	//					const current_track = (Platform.OS === 'android')?((this.props.appdata.currentTrack)?this.props.appdata.currentTrack:(track_data.length !== 0)?track_data[track_data.length-1].track:null):(this.props.appdata.currentTrack);
	//					const palying_status = (Platform.OS === 'android')?((this.props.appdata.status)?this.props.appdata.status:(track_data.length !== 0)?track_data[track_data.length-1].data:null):(this.props.appdata.status);
						const current_track = this.props.appdata.currentTrack;
						const palying_status = this.props.appdata.status;
						for(i = 0; i < livetv_data.length; i++){
							var newIcon = livetv_data[i].logo;
							var icon_array = newIcon.split(".");
							var index = icon_array.length;
							var imageType = icon_array[index-1];
							if(i === 0){
								if(this.state.liveTvDB && this.state.liveTvDB.hasOwnProperty('tvm') && this.state.liveTvDB.tvm){
									var realtv = this.state.liveTvDB.tvm;
									if(realtv.length === 0){
										tv_array.push({ now:'No Title', next:'No Title', image:'', name:livetv_data[i].name, url:livetv_data[i].url, logo:livetv_data[i].logo, logotype:imageType});
									}else if(realtv.length === 1){
										tv_array.push({ now:realtv[0].title, next:"", image:realtv[0].image, name:livetv_data[i].name, url:livetv_data[i].url, logo:livetv_data[i].logo, logotype:imageType});
									}else{
										tv_array.push({ now:realtv[0].title, next:realtv[1].title, image:realtv[0].image, name:livetv_data[i].name, url:livetv_data[i].url, logo:livetv_data[i].logo, logotype:imageType});
									}
								}else{
									////STATIC DATA////
									tv_array.push({ now:'No Title', next:'No Title', image:'', name:livetv_data[i].name, url:livetv_data[i].url, logo:livetv_data[i].logo, logotype:imageType});
								}
							}else{
								if(this.state.liveTvDB && this.state.liveTvDB.hasOwnProperty('tvm2') && this.state.liveTvDB.tvm2){
									var realtv = this.state.liveTvDB.tvm2;
									if(realtv.length === 0){
										tv_array.push({ now:'No Title', next:'No Title', image:'', name:livetv_data[i].name, url:livetv_data[i].url, logo:livetv_data[i].logo, logotype:imageType});
									}else if(realtv.length === 1){
										tv_array.push({ now:realtv[0].title, next:"", image:realtv[0].image, name:livetv_data[i].name, url:livetv_data[i].url, logo:livetv_data[i].logo, logotype:imageType});
									}else{
										tv_array.push({ now:realtv[0].title, next:realtv[1].title, image:realtv[0].image, name:livetv_data[i].name, url:livetv_data[i].url, logo:livetv_data[i].logo, logotype:imageType});
									}
								}else{
									////STATIC DATA////
									tv_array.push({ now:'No Show Streaming', next:'No Show Streaming', image:'', name:livetv_data[i].name, url:livetv_data[i].url, logo:livetv_data[i].logo, logotype:imageType});
								}
							}
						}
						for(var j = 0; j < radio_data.length; j++){
							if(current_track === j+1 && palying_status === true){
								radio_array.push({id: j+1, name:radio_data[j].name, url:radio_data[j].url, logo:radio_data[j].logo, playing:true});
								this.props.actions.TrackState(current_track, palying_status);
							}else{
								radio_array.push({id: j+1, name:radio_data[j].name, url:radio_data[j].url, logo:radio_data[j].logo, playing:false});
							}
						}
						this.setState({tvdata:tv_array, radioLabel:radio_Name, radiodata:radio_array, fixed_label:fixed_data.label, fixed_url:fixed_data.url});
					}
				}else{
					this.refs.redtoast.show(response, 3000);
				}
				if(indicatorOBJ !== null){
					indicatorOBJ.setModalVisible(false);
				}
			}, null, formBody);
		}
		catch(err){
			StyleMethods.LogException("Live / live / " + err.message);
		}
	}

	_showMenu = () =>{
		this.setState({isModalVisible: !this.state.isModalVisible})
	}

	updateScreen = (ScreenValue) =>{
		if(this.state.isModalVisible){
	    this.setState({isModalVisible: !this.state.isModalVisible});
	    if(ScreenValue !== ''){
				this.props.navigator.resetTo({
					screen: ScreenValue,
					navigatorStyle:{navBarHidden:true},
					animated: true,
				});
	    }
		}else{
			return;
		}
  }

	componentWillUnmount(){
		if(Platform.OS === 'android'){
			BackHandler.removeEventListener('hardwareBackPress', this.onBackHandler);
		}
	}

	onBackHandler = () => {
		this.close();
		return true;
	}

	close(){
		this.props.navigator.resetTo({
			screen:'TVM.Landing',
			navigatorStyle:StyleMethods.newNavigationStyle(),
			animationType: 'fade',
			animated:true,
		});
	}

	updateRadioState(_id, check){
		var oldArray = this.state.radiodata;
		var newArray = [];
		for(var i = 0; i < oldArray.length; i++){
			if(_id === oldArray[i].id){
				newArray.push({id:_id, name:oldArray[i].name, url:oldArray[i].url, logo:oldArray[i].logo, playing:check});
			}else{
				newArray.push({id:oldArray[i].id, name:oldArray[i].name, url:oldArray[i].url, logo:oldArray[i].logo, playing:false});
			}
		}
		this.setState({radiodata:newArray});
	}

	trackPlayer(item){
		try{
	//		const track_data = Realm.ReadData('MediaPlayer');
	//		const current_track = (Platform.OS === 'android')?((this.props.appdata.currentTrack)?this.props.appdata.currentTrack:(track_data.length !== 0)?track_data[track_data.length-1].track:null):(this.props.appdata.currentTrack);
	//		const current_state = (Platform.OS === 'android')?((this.props.appdata.status)?this.props.appdata.status:(track_data.length !== 0)?track_data[track_data.length-1].data:null):(this.props.appdata.status);
			const current_track = this.props.appdata.currentTrack;
			const current_state = this.props.appdata.status;
			const track_state = this.props.appdata.track;
			if(track_state === undefined){
				TrackPlayer.setupPlayer({}).then(async () => {
					TrackPlayer.updateOptions({
						stopWithApp: true,
						capabilities: [
							TrackPlayer.CAPABILITY_PLAY,
							TrackPlayer.CAPABILITY_PAUSE,
							TrackPlayer.CAPABILITY_STOP
						],
					});
				});
			}
			if(item.id === current_track && current_state === true){
				TrackPlayer.pause();
				this.updateRadioState(item.id, false);
				this.props.actions.TrackState(item.id, false);
				/*
				Realm.WriteData('MediaPlayer',{
					data:false,
					track:item.id
				});
				*/
			}else{
				/*
				Realm.WriteData('MediaPlayer',{
					data:true,
					track:item.id
				});
				*/
				this.props.actions.TrackState(item.id, true);
				this.updateRadioState(item.id, true);
				TrackPlayer.reset();
				TrackPlayer.setupPlayer().then(async () => {
				    await TrackPlayer.add({
				        id: item.id.toString(),
				        url:item.url,
				        title: 'TVM',
				        artist: item.name,
				        artwork:item.logo
				    });
				    TrackPlayer.play();
				});
			}
		}
		catch(err){
			StyleMethods.LogException("Live / Radio channel / " + err.message);
		}
	}

	_renderradioView = ({item}) => (
		<LinearGradient colors={['#062244', '#04162B', '#3b5998']} style={bi.bulletinslistSingleView}>
			<TouchableOpacity style={bi.rowTouchView} onPress={()=>this.trackPlayer(item)}>
				<View style={lt.radiorowlogoView}>
					<CachedImage style={lt.radiochannelLogo} source={{uri:(item.logo)}}/>
				</View>
				<View style={lt.radiorowplayView}>
				{(item.playing === false)?
					<Image source={IMAGES.RADIO_PLAY} style={{height:StyleMethods.getFontSize(53), width:StyleMethods.getFontSize(53), resizeMode:'contain'}} />
					: (item.playing === true)?
					<Image source={IMAGES.PAUSE} style={{height:StyleMethods.getFontSize(53), width:StyleMethods.getFontSize(53), resizeMode:'contain'}} />
					:null
				}
				</View>
			</TouchableOpacity>
    </LinearGradient>
	);

	onlinkclick(videoUrl){
		try{
			if(this.state.newsfeedFlag){
				return;
			}else{
				this.setState({newsfeedFlag:true});
				this.props.navigator.push({
					passProps:{videoUrl},
					screen:'TVM.Simpleweb',
					navigatorStyle:StyleMethods.newNavigationStyle(),
					animated:true
				});
				setTimeout(() => {this.setState({newsfeedFlag:false})}, 3000);
			}
		}
		catch(err){
			StyleMethods.LogException("Live / TV channels / " + err.message);
		}
	}

	_renderlivetv = ({item}) => (
		<View style={lt.singletvView}>
			<View style={lt.logoView}>
				<Image style={lt.channelLogo} source={{uri:(item.logo)}} />
			</View>
			<View style={lt.nowtextView}>
				<Text style={[lt.nowtext1,{flexWrap:'wrap'}]}>NOW: <Text style={lt.nowtext2}>{item.now}</Text></Text>
			</View>
			<View style={lt.nowtextView}>
				<Text style={[lt.nowtext1,{flexWrap:'wrap'}]}>NEXT: <Text style={lt.nowtext2}>{item.next}</Text></Text>
			</View>
			<TouchableOpacity style={lt.livetvPlay} onPress={()=>this.onlinkclick(item.url)}>
				<CachedImage style={lt.livetvImage} source={{uri:(item.image)}} />
				<Image source={IMAGES.STORY_PLAY} style={{position:'absolute', top:70 ,left:(StyleMethods.getWidth()/2 - 45) ,height:StyleMethods.getFontSize(50), width:StyleMethods.getFontSize(50), resizeMode:'contain'}} />
			</TouchableOpacity>
		</View>
	);

	render() {
		return (
			<View style={cs.container}>
				{this.state.isModalVisible?
				<View style={ms.modalTransparentBG}></View>
				:null}
				<Modal backdropOpacity={0} animationOut="slideOutUp" animationIn="slideInDown" animationInTiming={1000} animationOutTiming={1000} backdropTransitionInTiming={3000} backdropTransitionOutTiming={3000} style ={ms.menuModal} isVisible={this.state.isModalVisible}>
						<MenuModal onSelect={this.updateScreen.bind(this)} ref={(ref) => this.privacyModalOBJ = privacyModalOBJ = ref}/>
				</Modal>
				<View style={nf.topView}>
					<ImageBackground style={nf.topViewLeft} source={require('../../common/assets/img/bg-storyfeed.png')}>
					{ (!this.state.isModalVisible)?
					<TouchableOpacity style={nf.menuButton} onPress={this._showMenu.bind(this)}>
						<Image style={nf.menuImage} source={require('../../common/assets/img/menu-icon.png')} />
					</TouchableOpacity>:null}
					</ImageBackground>
					<View style={nf.topViewRight}>
						<View style={bi.toptextView}>
							<Text style={bi.toptext}>Live</Text>
						</View>
					</View>
				</View>

        <View style={nf.bottomView}>
          <View style={bi.bulletinsbelowTabsView}>
						<ScrollableTabView renderTabBar={() => <DefaultTabBar />} tabBarTextStyle={lt.livetabText} initialPage={(this.props.hasOwnProperty('temp')?1:0)} prerenderingSiblingsNumber={Infinity} tabBarBackgroundColor={'#C51A25'} tabBarActiveTextColor={'white'} tabBarInactiveTextColor={'rgba(255,255,255,.5)'} tabBarUnderlineStyle={{backgroundColor:'white', height:StyleMethods.getFontSize(2)}}>
			        <View tabLabel="TV" style={bi.bulletinsbelowTabsView}>
								<FlatList
									data={this.state.tvdata}
									renderItem={this._renderlivetv.bind(this)}
								/>
							</View>
			        <View tabLabel={this.state.radioLabel} style={bi.bulletinsbelowTabsView}>
								<FlatList
									data={this.state.radiodata}
									renderItem={this._renderradioView.bind(this)}
								/>
							</View>
			        <View tabLabel={this.state.fixed_label} style={bi.bulletinsbelowTabsView}>
								<MyWebView
									source={{uri:this.state.fixed_url}}
									startInLoadingState={true}
									scrollEnabled={true}
								/>
							</View>
			      </ScrollableTabView>
					</View>
        </View>
				<Indicator ref={(ref) => this.indicatorOBJ = indicatorOBJ = ref}/>
				<Toast style={cs.redtoast} ref="redtoast" position={'top'}/>
			</View>
		);
	}
}

LiveTv.propTypes = {
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
function stripEndQuotes(s){
	var t=s.length;
	if (s.charAt(0)=='"') s=s.substring(1,t--);
	if (s.charAt(--t)=='"') s=s.substring(0,t);
	return s;
}
export default connect(mapStateToProps, mapDispatchToProps)(LiveTv);
