import React, {  Component } from 'react';
import {
	View,
	Text,
	Image,
	TextInput,
	TouchableOpacity,
  ImageBackground,
	FlatList,
	BackHandler,
	AppState,
	Platform
} from 'react-native';
import PropTypes from 'prop-types';
import IMAGES from '../../common/images';
import { commonStyle as cs, bulletins as bi, newsFeed as nf, searchPage as se,  ModalStyle as ms } from '../../common/style';
import StyleMethods from '../../common/Style_Methods';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as loginActions from '../../common/reducers/app.actions';
import network from '../../common/network';
import MenuModal from '../menu/MenuModal';
import Modal from "react-native-modal";
import Realm from '../../common/realm';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Indicator from '../../common/libs/indicator';
import Toast from 'react-native-easy-toast';
import {CachedImage} from "react-native-img-cache";
import {Analytics, Hits as GAHits} from 'react-native-google-analytics';
import DeviceInfo from 'react-native-device-info';

var indicatorOBJ = null;

class Search extends Component {
	constructor(props) {
		super(props);
    this.state={
      searchFlag : false,
			isModalVisible: false,
			newsFeed:[],
      searchItem:null,
			videoText1:'',
			appState:'',
			experiments: {},
    };
		this._handleAppStateChange = this._handleAppStateChange.bind(this);
	}

	_handleAppStateChange = (nextAppState) => {
		if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
			console.log("appState", this.state.appState);
			if(this.props.appdata.currentTrack !== 0 && this.props.appdata.currentTrack !== undefined){
				console.log("page", this.props.appdata.currentTrack);
				console.log("props", this.props);
					var temp = '';
					this.props.navigator.resetTo({
						passProps:{temp},
						screen:'TVM.LiveTv',
						navigatorStyle:StyleMethods.newNavigationStyle(),
						animated:false
					});
			}
    }
    this.setState({appState: nextAppState});
  }

	componentDidMount(){
		let experiment = this.state.experiments['welcome-message'];
		let clientId = DeviceInfo.getUniqueID();
		let ga = new Analytics('UA-44380471-1', clientId, 1, DeviceInfo.getUserAgent());
		let events = new GAHits.Event(
			'Search',
			'screen opens',
			'Search',
			'',
			experiment
		);
		ga.send(events);
		var user = this.props.appdata.profiledata;
		this.setState({videoText1:this.toTitleCase(user.titles.search)});
	}

	toTitleCase(str) {
	    return str.replace(/\w\S*/g, function(txt){
	        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	    });
	}

	_showMenu = () =>{
		this.setState({isModalVisible: !this.state.isModalVisible})
	}

	componentWillMount(){
		if(Platform.OS === 'android'){
			BackHandler.addEventListener('hardwareBackPress', this.onBackHandler);
		}
		AppState.addEventListener('change', this._handleAppStateChange);
	}

	componentWillUnmount(){
		if(Platform.OS === 'android'){
			BackHandler.removeEventListener('hardwareBackPress', this.onBackHandler);
		}
		AppState.removeEventListener('change', this._handleAppStateChange);
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

	searchFunc(){
		try{
			if(this.state.searchItem === null || this.state.searchItem === ' '){
				return;
			}else{
				indicatorOBJ.setModalVisible(true);
				var data = Realm.ReadData('User');
				var _token = data[0].wp;
				var res = _token.split(",");
				var res2 = res[0].split(":");
				const token_data = res2[1];
				var details = {
						'token': stripEndQuotes(token_data),
						'search': this.state.searchItem,
				};
		    var formBody = [];
		    for (var property in details) {
		      var encodedKey = encodeURIComponent(property);
		      var encodedValue = encodeURIComponent(details[property]);
		      formBody.push(encodedKey + "=" + encodedValue);
		    }
		    formBody = formBody.join("&");

				network.TimeMethod("POST", "search", (flag, response)=>{
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
						var categories = this.data_to_array(response);
						var categories_array = [];
						var sub_array = [];
						for(var i = 0; i <categories.length; i++){
							categories_array.push({name:categories[i].key});
							var sub_category = categories[i].data;
							for(var j = 0; j < sub_category.length; j++){
								sub_array.push({category:categories[i].key ,id:sub_category[j].ID, title:sub_category[j].title, subtitle:sub_category[j].subtitle,
																image:sub_category[j].image, has_video: sub_category[j].has_video, has_gallery:sub_category[j].has_gallery});
							}
						}
						if(categories.length === 0){
							this.setState({newsFeed:sub_array, searchFlag:false});
						}else{
							this.setState({newsFeed:sub_array, searchFlag:true});
						}
					}
				}else{
					this.refs.redtoast.show(response, 3000);
					console.log(response);
				}
				indicatorOBJ.setModalVisible(false);
				}, null, formBody);
			}
		}
		catch(err){
			StyleMethods.LogException("Search / search / " + err.message);
		}
	}

	data_to_array(obj) {
	var categories = [];
	for (var p in obj) {
			categories.push({key:p, data:obj[p]}); //[p] = obj[p];
	}
	return categories;
}

	onlinkclick(item){
		try{
			var id = item.id;
			this.props.navigator.push({
				passProps:{id, item},
				screen:'TVM.Newsfeed',
				navigatorStyle:StyleMethods.newNavigationStyle(),
				animationType: 'fade',
				animated:true
			});
		}
		catch(err){
			StyleMethods.LogException("Search / article / " + err.message);
		}
	}

  _rendernewsFeeds = ({item}) => (
		<View style={[nf.feedssingleMainView, cs.elevatedShadow]}>
			{(Platform.OS === 'ios')?
			<TouchableOpacity style={nf.feedsimageView} onPress={()=>this.onlinkclick(item)}>
				<CachedImage source={{ uri:item.image}} style={nf.feedssingleView} borderRadius={StyleMethods.getFontSize(20)}/>
				{(item.has_video === 1)?
					<Image source={IMAGES.STORY_PLAY} style={{position:'absolute', left:10, top:10, height:StyleMethods.getFontSize(38), width:StyleMethods.getFontSize(38), resizeMode:'contain'}}/>
				:null}
				<View style={nf.feedsTextmainView}>
					<View style={nf.feedsimageBottom2}>
						<Text style={nf.categoryText}>{item.subtitle}</Text>
					</View>
					<View style={nf.feedsimageBottom}>
						<Text style={nf.categorytitleText}>{item.title}</Text>
					</View>
				</View>
			</TouchableOpacity>
			:
			<ImageBackground source={{uri:(item.image)}} style={se.searchsingleView} borderRadius={StyleMethods.getFontSize(20)}>
				<TouchableOpacity style={nf.feedsimageView} onPress={()=>this.onlinkclick(item)}>
					<View style={{flex:0.92}}>
					{(item.has_video === 1)?
						<Image source={IMAGES.STORY_PLAY} style={{position:'absolute', left:10, top:10, height:StyleMethods.getFontSize(38), width:StyleMethods.getFontSize(38), resizeMode:'contain'}}/>
					:null}
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
			}
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
							<Text style={bi.toptext}>{this.state.videoText1}</Text>
						</View>
					</View>
				</View>
        <View style={nf.bottomView}>
				<KeyboardAwareScrollView contentContainerstyle={(Platform.OS === 'android')?{backgroundColor:'transparent'}:{flex:1, backgroundColor:'transparent'}} enableOnAndroid={true}>
          <View style={se.searchInputView}>
						<View style={se.textInputView}>
	            <TextInput
	              placeholder="What are you looking for?"
	              placeholderTextColor="white"
	              underlineColorAndroid='rgba(0,0,0,0)'
	              autoCorrect={true}
	              autoCapitalize={"words"}
	              returnKeyType="go"
	              onSubmitEditing={() => this.searchFunc()}
	              ref={(input)=> this.searchInput = input}
	              style={se.search_textInput}
	              onChangeText={(searchItem) => this.setState({searchItem})}
	            />
							<TouchableOpacity onPress={this.searchFunc.bind(this)}>
								<Image style={se.searchImage} source={IMAGES.SEARCHICON} />
							</TouchableOpacity>
						</View>
          </View>
          <View style={se.searchWholeView}>
          {!this.state.searchFlag ?
          <Image source={require('../../common/assets/img/searchimage.jpg')} style={se.backgroundImage} />
          :
          <FlatList
          	data={this.state.newsFeed}
          	renderItem={this._rendernewsFeeds.bind(this)}
          />
          }
          </View>
					</KeyboardAwareScrollView>
        </View>
				<Indicator ref={(ref) => this.indicatorOBJ = indicatorOBJ = ref}/>
				<Toast style={cs.redtoastBackground} textStyle={cs.redtoast} ref="redtoast" position={'top'}/>
			</View>
		);
	}
}

Search.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Search);
