import {Platform} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {registerScreens} from './screens';
import Realm from './common/realm';
import createEventHandler from './common/event-handler';
import TrackPlayer from 'react-native-track-player';
import configureStore from './common/configureStore';
import {Provider} from 'react-redux';
import codePush from "react-native-code-push";

const store = configureStore();
registerScreens(store, Provider);
TrackPlayer.registerEventHandler(createEventHandler(store));

var InitialScreen = "TVM.LoginScreen";

var screenTitle = "Login";
var PROPS = {};
var navigatorStyle = {
	disabledBackGesture:true,
	statusBarTextColorScheme:'light',
	statusBarColor: 'light',
	navBarTextColor: 'white',
	navBarHidden:true,
	navBarHideOnScroll: false
};

//Realm.DeleteData('UserProfile');
var UserData = Realm.ReadData('UserProfile');

if(UserData.length > 0){

	console.log('USERDATA LENGTH IS GREATER THAN 0');
	console.log(UserData[0].profiledata);
	var USER = JSON.parse(UserData[0].profiledata);
	console.log(USER);
	if(USER.preferences.privacy_policy.data === false){
		console.log('PRIVACY POLICY FLAG IS FALSE');
		InitialScreen = "TVM.LoginScreen";
		screenTitle = "Login";
	}else{
		PROPS = {profiledata:USER};
		console.log('PRIVACY POLICY FLAG IS TRUE');
		if(USER.on_boarding.data === false){
			InitialScreen = "TVM.IntroScreen";
			screenTitle = "Home";
		}else{
			console.log('PRIVACY POLICY FLAG IS TRUE');
			InitialScreen = "TVM.Landing";
			screenTitle = "Home";
		}
	}
}

// this will start our app
Navigation.startSingleScreenApp({
  screen: {
    screen: InitialScreen,
		title: screenTitle,
		navigatorStyle:navigatorStyle,
		leftButtons: [
			{
				id: 'SideMenu'
			}
		]
	},
	passProps: PROPS
});

codePush.sync({ installMode: codePush.InstallMode.ON_NEXT_RESUME });
