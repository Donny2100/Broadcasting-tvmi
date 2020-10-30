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
	Dimensions,
	StatusBar,
	ActivityIndicator
} from 'react-native';
import COLORS from '../../common/colors';
import PropTypes from 'prop-types';
import { commonStyle as cs, newsFeed as nf, bulletins as bi, storyPage as sp } from '../../common/style';
import StyleMethods from '../../common/Style_Methods';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as loginActions from '../../common/reducers/app.actions';
import network from '../../common/network';
import Indicator from '../../common/libs/indicator';
import Orientation from 'react-native-orientation';
import NewWebView from 'react-native-android-fullscreen-webview-video';

var indicatorOBJ = null;

class Simpleweb extends Component {
	constructor(props) {
		super(props);
//		alert(JSON.stringify(this.props.videoUrl));
    this.state={
      url:this.props.videoUrl,
			IndicatorModalFlag:false,
			refreshing: false,
    };
	}

	_onRefresh() {
		this.close();
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
	}

	componentDidMount(){
		this.setState({IndicatorModalFlag:true});
		if(Platform.OS === 'ios'){
			Orientation.unlockAllOrientations();
		}
	}

	onBackHandler = () => {
		this.close();
		return true;
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
				<View style={{height:(Platform.OS === 'ios')?StyleMethods.getFontSize(40):StyleMethods.getFontSize(0), backgroundColor:'black', padding:(Platform.OS === 'ios')?StyleMethods.getFontSize(10):StyleMethods.getFontSize(0), justifyContent:'center'}}>
					<TouchableOpacity style={{position:'absolute', right:10, top:20}} onPress={this.close.bind(this)}>
						<Image source={require('../../common/assets/img/closestory-icon.png')} style={{height:StyleMethods.getFontSize(20), width:StyleMethods.getFontSize(20), resizeMode:'contain'}}/>
					</TouchableOpacity>
				</View>
					<NewWebView
						source={{uri:this.props.videoUrl}}
						startInLoadingState={false}
            scrollEnabled={false}
						onLoad={()=> {this.setState({IndicatorModalFlag:false})}}
					/>
					{this.state.IndicatorModalFlag?
		      <View style={{position:'absolute',justifyContent:'center',alignItems:'center',left:0,right:0,top:0,bottom:0, zIndex:100, backgroundColor:'rgba(255,255,255,.5)'}}>
		          <ActivityIndicator size="large" color={COLORS.BUTTONBG} />
		      </View>:null
		      }
				</View>
		);
	}
}

Simpleweb.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Simpleweb);
