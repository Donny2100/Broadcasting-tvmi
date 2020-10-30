import React, {  Component } from 'react';
import {
	View,
	Text,
	Image,
	Alert,
  WebView,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
	BackHandler,
	Platform,
	AppState,
	Dimensions,
	StatusBar,
	ActivityIndicator
} from 'react-native';
import PropTypes from 'prop-types';
import COLORS from '../../common/colors';
import { commonStyle as cs, newsFeed as nf, bulletins as bi, storyPage as sp } from '../../common/style';
import StyleMethods from '../../common/Style_Methods';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as loginActions from '../../common/reducers/app.actions';
import network from '../../common/network';
import MyWebView from 'react-native-webview-autoheight';
import Indicator from '../../common/libs/indicator';
import Orientation from 'react-native-orientation';
import NewWebView from 'react-native-android-fullscreen-webview-video';

var indicatorOBJ = null;

class WebPages extends Component {
	constructor(props) {
		super(props);
    this.state={
      url:this.props.videoUrl,
			refreshing: false,
			IndicatorModalFlag:false,
			appState:''
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

	componentWillMount(){
		if(Platform.OS === 'android'){
			BackHandler.addEventListener('hardwareBackPress', this.onBackHandler);
		}
		if(Platform.OS === 'ios'){
			Dimensions.addEventListener('change', () => {
				StatusBar.setHidden(false);
			});
		}
		AppState.addEventListener('change', this._handleAppStateChange);
	}

	componentWillUnmount(){
		if(Platform.OS === 'android'){
			BackHandler.removeEventListener('hardwareBackPress', this.onBackHandler);
		}
		if(Platform.OS === 'ios'){
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

	componentDidMount(){
		this.setState({IndicatorModalFlag:true});
		if(Platform.OS === 'ios'){
			Orientation.unlockAllOrientations();
		}
	}

	_onRefresh() {
		this.close();
	}

	close(){
		this.props.navigator.pop({
			animationType:'fade',
			animated:true
		});
	}

	render() {
		return (
			<View style={cs.container}>
				<View style={{height:StyleMethods.getFontSize(40), backgroundColor:'transparent', padding:StyleMethods.getFontSize(10), justifyContent:'center'}}>
					<TouchableOpacity style={{position:'absolute', right:10, top:20}} onPress={this.close.bind(this)}>
						<Image source={require('../../common/assets/img/closestory-icon.png')} style={{height:StyleMethods.getFontSize(20), width:StyleMethods.getFontSize(20), resizeMode:'contain'}}/>
					</TouchableOpacity>
				</View>
				<ScrollView
					contentContainerStyle={(Platform.OS === 'android')?{backgroundColor:'transparent'}:{flex:1, backgroundColor:'transparent'}}
					refreshControl={
						<RefreshControl
						refreshing={this.state.refreshing}
						onRefresh={this._onRefresh.bind(this)}
						/>
					}>
					<NewWebView
						source={{uri:this.props.videoUrl}}
						startInLoadingState={false}
						scrollEnabled={true}
						onLoad={()=> {this.setState({IndicatorModalFlag:false})}}
					/>
				</ScrollView>
				{this.state.IndicatorModalFlag?
	      <View style={{position:'absolute',justifyContent:'center',alignItems:'center',left:0,right:0,top:0,bottom:0, zIndex:100, backgroundColor:'rgba(255,255,255,.5)'}}>
	          <ActivityIndicator size="large" color={COLORS.BUTTONBG} />
	      </View>:null
	      }
				</View>
		);
	}
}

WebPages.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(WebPages);
