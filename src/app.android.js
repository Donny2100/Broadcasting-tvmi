import {Platform} from 'react-native';
import {Navigation, NativeEventsReceiver} from 'react-native-navigation';
import {registerScreens} from './screens';
import Realm from './common/realm';
import createEventHandler from './common/event-handler';
import configureStore from './common/configureStore';
import {Provider} from 'react-redux';
import TrackPlayer from 'react-native-track-player';
import codePush from "react-native-code-push";

Navigation.isAppLaunched()
  .then(appLaunched => {
    if (appLaunched) {
      startApp(); // App is launched -> show UI
    }
    new NativeEventsReceiver().appLaunched(startApp); // App hasn't been launched yet -> show the UI only when needed.
  });

function startApp(){
	const store = configureStore();
	TrackPlayer.registerEventHandler(createEventHandler(store));
//  console.log("Storeeeeeee", store.getState());
	registerScreens(store, Provider);
	console.disableYellowBox = true;
	var InitialScreen = "TVM.LoginScreen";
	var screenTitle = "Login";
	var PROPS = {};
	var navigatorStyle = {
		disabledBackGesture:true,
		navBarHidden:true,
		navBarHideOnScroll: false
	};
	var UserData = Realm.ReadData('UserProfile');
  Realm.DeleteData('NotificationCheck');
  Realm.WriteData('NotificationCheck',{
    data:true
  });

/*
  var MediaData = Realm.ReadData('MediaPlayer');
  var playerState = TrackPlayer.getState();
  console.log("Player State",playerState);
  var promise1 = Promise.resolve(playerState);
  console.log("Resolved Promise", promise1);
  promise1.then(function(value) {
    console.log("Promise array", value);
  });
*/
//  console.log("MEDIA Check", mediaCheck);

	if(UserData.length > 0){
		var USER = JSON.parse(UserData[0].profiledata);
		if(USER.preferences.privacy_policy.data === false){
			InitialScreen = "TVM.LoginScreen";
			screenTitle = "Login";
		}else{
			PROPS = {profiledata:USER};
			if(USER.on_boarding.data === false){
				InitialScreen = "TVM.IntroScreen";
				screenTitle = "Home";
			}else{
/*
        if(MediaData.length !== 0){
          PROPS={temp:''};
          InitialScreen = "TVM.LiveTv";
          screenTitle = "TV";
        }else{
*/
  				InitialScreen = "TVM.Landing";
  				screenTitle = "Home";
//        }
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
			],
			passProps: PROPS
		},
		appStyle:{
			orientation: 'portrait',
		},
		passProps: PROPS
	});
}

codePush.sync({ installMode: codePush.InstallMode.ON_NEXT_RESUME });
