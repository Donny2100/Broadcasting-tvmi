var moment = require('moment');
import React from "react-native";
import Dimensions from 'Dimensions';
import firebase from 'react-native-firebase';
import { PixelRatio, Platform, Alert, Navigator } from 'react-native';
const {height:screenHeight, width:screenWidth} = Dimensions.get('window');
const scale = Dimensions.get('window').width / 375;
var DeviceInfo = require('react-native-device-info');

import Realm from './realm';
var loggedinuserdata = null;
var user = Realm.ReadData('User');
//console.log(user);
/*
var token = '';
if(user.length>0){
  token = user[0].token;
}

if(user.length>0){
  loggedinuserdata = JSON.parse(user[0].profile);
  token = user[0].token;
  //alert(JSON.stringify(loggedinuserdata));
}else{
  loggedinuserdata = null;
}

exports.updateUserProfile=function(userdata) {
  //alert(JSON.stringify(userdata));
  console.log(userdata);
  if(loggedinuserdata === null){
    token = userdata.token;
    loggedinuserdata = userdata.data[0];
    console.log(loggedinuserdata);
    //alert(JSON.stringify(loggedinuserdata));
  }
}
exports.deleteUserProfile=function() {
  console.log('user data deleted')
  loggedinuserdata = null;
}
*/
//console.log(token);

exports.validateEmail = function(email){
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(email);
};
exports.validatePassword = function(password){
		var re = /^(?=.*\d)(?=.*[A-Z])(.{8,15})$/;  /*(?!.*[^a-zA-Z0-9@#$^+=])*/
			return re.test(password);
}
exports.iosMarginTop = function(){
  return (Platform.OS === 'ios') ? {marginTop: getFontSize(64)} : (Platform.Version > 19)? {marginTop: getFontSize(50)} : {marginTop: getFontSize(44)};
}

exports.normalize=function(size: number): number {
  return Math.round(scale * size);
}

exports.getWidth=function(){
  return screenWidth;
}

exports.getHeight=function(){
  return screenHeight;
}

exports.LogException=function(error){
		if(Platform.OS === 'android'){
      //Crashlytics.logException(JSON.stringify(error + " app_version" + APP_VERSION + " ota_version: " + OTA_VERSION));
			firebase.crashlytics().log(error);
    }else{
      //Crashlytics.recordError(error  + " app_version" + APP_VERSION + " ota_version: " + OTA_VERSION);
			firebase.crashlytics().recordError(error);
    }
	}

exports.newNavigationStyle = function(){
  return {
    disabledBackGesture:true,
  	navBarHidden:true,
  	statusBarColor: 'black',
  	statusBarTextColorScheme: 'light',
  	navBarBackgroundColor: '#2463cc',
  	navBarTextColor: 'white',
  	navBarButtonColor: 'white',
    navigationBarColor: 'black',
    navBarTitleTextCentered: true,
  	navBarHideOnScroll: false
  };
}

var pixelRatio = PixelRatio.get();
exports.getCorrectFontSizeForScreen= function(currentFont){
  if(DeviceInfo.isTablet()){
    if(Platform.OS === 'ios'){
      return currentFont*2;
    }else{
      return currentFont*1.5;
    }
  }else{
    return currentFont;
  }
}

exports.getSizeInDp=function(pixels){
	if (PixelRatio.get() === 1){
    return (pixels*2);//'low';
	}else if (PixelRatio.get() === 1.5){
	  return (pixels*2);//'medium';
	}else if (PixelRatio.get() === 2){
	  return (pixels*1.5);//'high';
	}else if (PixelRatio.get() === 3){
	  return (pixels*1.5);//'xhigh';
	}else if (PixelRatio.get() === 3.5){
	  return (pixels*1.25);//'xxhigh';
	}else{
	  return (pixels*1.25);//'xxxhigh';
	}
}

exports.getCorrectFontSize= function(currentFont){
  if(DeviceInfo.isTablet()){
    return currentFont*1.5;
  }else{
    return currentFont;
  }
}

exports.getFontSize = function(currentFont){
  if(DeviceInfo.isTablet()){
    if(Platform.OS === 'ios'){
      return currentFont*2;
    }else{
      return currentFont*1.5;
    }
  }else{
    return currentFont;
  }
};

function getFontSize(currentFont){
  if(DeviceInfo.isTablet()){
    if(Platform.OS === 'ios'){
      return currentFont*2;
    }else{
      return currentFont*1.5;
    }
  }else{
    return currentFont;
  }
}

exports.getLineHeightSize = function(currentFont){
  if(DeviceInfo.isTablet()){
    return currentFont*2;
  }else{
    return currentFont;
  }
}

function float2int (value) {
  return value | 0;
}

function getMonth(month){
  var Months = ["Jan","Feb","Mrt","Apr","Mei","Jun","Jul","Aug","Sep","Okt","Nov","Dec"];
  return Months[month];
}

exports.getMonth = function(month){
  var Months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return Months[month];
}

exports.get24Hours = function(time){
  return HoursAMPM = moment(time, ["h:mm A"]).format("HH:mm");
  var hours = Number(time.match(/^(\d+)/)[1]);
  var minutes = Number(time.match(/:(\d+)/)[1]);
  var AMPM = time.match(/\s(.*)$/)[1];
  if(AMPM == "PM" && hours<12) hours = hours+12;
  if(AMPM == "AM" && hours==12) hours = hours-12;
  var sHours = hours.toString();
  var sMinutes = minutes.toString();
  if(hours<10) sHours = "0" + sHours;
  if(minutes<10) sMinutes = "0" + sMinutes;
  console.log(sHours + ":" + sMinutes);
  return sHours + ":" + sMinutes;
}

exports.getFullDateTime = (date) => {
  return moment(date).format('D MMM, YYYY H:mma');
}

exports.logoutOnBlackList = function(navigator){
    Realm.DeleteData('User');
    Alert.alert(
      'Token Blacklisted',
      'Please login and try again!',
      [
        /*{text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},*/
        {text: 'Ok', onPress: () => redirectToLogin(navigator)},
      ],
      { cancelable: false }
    )

}
var redirectToLogin = function(navigator){
  navigator.resetTo({
    screen: 'Driver.LoginScreen',
    navigatorStyle:{navBarHidden:true,navBarBackgroundColor:'#1291d4', navBarButtonColor:'#FFFFFF', navBarTextColor: '#FFFFFF',navBarTitleTextCentered:'center',navigationBarColor:'#1291d4'},
  });
}

const navigatorWithHeaderStyle = {
  navBarHidden:false,navBarBackgroundColor:'#1291d4', navBarButtonColor:'#FFFFFF', navBarTextColor: '#FFFFFF',navBarTitleTextCentered:'center',navigationBarColor:'#1291d4'
}

const navigatorWithoutHeaderStyle = {
  navBarHidden:true
}

exports.NavigateToPage = function(pagelink , navigator, availablepagestatus){
  //alert('hello again dude');
  navigator.resetTo({
    screen: pagelink,
    navigatorStyle:{navBarHidden:true}
  });
}

var CurrentPage = null;
exports.onNavigatorEvent = function(event , navigator, availablepagestatus){
  //console.log(navigator);
//  console.log(event);

  if(event.type === 'DeepLink'){
    if (event.link === 'Logout') {
      navigator.setDrawerEnabled({side: 'left',enabled: false});
      navigator.resetTo({
        screen: 'YAHBG.LoginPage',
        navigatorStyle:navigatorStyle,
        animated: true
      });
    }else if (event.link === 'Logout User') {
      //navigator.setDrawerEnabled({side: 'left',enabled: false});
      navigator.resetTo({
        screen: 'Driver.LoginScreen',
        navigatorStyle:navigatorWithoutHeaderStyle,
        animated: true
      });
    }else if (event.link === 'Load Contact') {
      //navigator.setDrawerEnabled({side: 'left',enabled: false});
      navigator.resetTo({
        title:'Contact Us',
        screen: 'Driver.ContactUs',
        navigatorStyle:navigatorWithHeaderStyle,
        animated: true
      });
    }else if (event.link === 'Assigned') {
      //navigator.setDrawerEnabled({side: 'left',enabled: false});
      navigator.resetTo({
        title:'Available Bookings',
        screen: 'Driver.AssignedLanding',
        navigatorStyle:navigatorWithHeaderStyle,
        animated: true,
        passProps:{token:token}
      });
    }else if (event.link === 'Manage') {
      //navigator.setDrawerEnabled({side: 'left',enabled: false});
      navigator.resetTo({
        title:'Manage Bookings',
        screen: 'Driver.ManageLanding',
        navigatorStyle:navigatorWithHeaderStyle,
        animated: true
      });
    }else if (event.link === 'History') {
      //navigator.setDrawerEnabled({side: 'left',enabled: false});
      navigator.resetTo({
        title:'Bookings History',
        screen: 'Driver.HistoryLanding',
        navigatorStyle:navigatorWithHeaderStyle,
        animated: true
      });
    }else if (event.link === 'Settings') {
      //navigator.setDrawerEnabled({side: 'left',enabled: false});
      navigator.resetTo({
        title:'Settings',
        screen: 'Driver.Settings',
        navigatorStyle:navigatorWithHeaderStyle,
        animated: true
      });
    }else if (event.link === 'Privacy') {
      //navigator.setDrawerEnabled({side: 'left',enabled: false});
      navigator.resetTo({
        title:'Privacy',
        screen: 'Driver.Privacy',
        navigatorStyle:navigatorWithHeaderStyle,
        animated: true
      });
    }else if (event.link === 'Vehicle') {
      //navigator.setDrawerEnabled({side: 'left',enabled: false});
      navigator.resetTo({
        title:'Vehicle',
        screen: 'Driver.VehicleLanding',
        navigatorStyle:navigatorWithHeaderStyle,
        animated: true
      });
    }
  }else{
    if (event.id === 'bars') {
      navigator.toggleDrawer({ side: 'left', animated: true });
    }else if (event.id === 'back') {
      navigator.setDrawerEnabled({side: 'left',enabled: true});
      navigator.pop({ animated: true });
      CurrentPage = null;
    }else if (event.id === 'arrow-left') {
      //alert(JSON.stringify(event));
    //  console.log(event);
      if(availablepagestatus !== null || availablepagestatus !== undefined){
        console.log('availablebookings passed'+availablepagestatus);
        if(availablepagestatus === 1){
          navigator.resetTo({
            screen: 'Driver.AssignedLanding',
              //navigatorStyle:navigatorStyle,
              navigatorStyle:{navBarHidden:false,navBarBackgroundColor:'#1291d4', disabledBackGesture: true, navBarButtonColor:'#FFFFFF', navBarTextColor: '#FFFFFF',navBarTitleTextCentered:'center',navigationBarColor:'#1291d4'},
              animated: true,
              title:'Available Bookings',
              passProps:{token:token}
            });
        }else{
          navigator.resetTo({
            screen: 'Driver.ManageLanding',
              //navigatorStyle:navigatorStyle,
              navigatorStyle:{navBarHidden:false,navBarBackgroundColor:'#1291d4', disabledBackGesture: true, navBarButtonColor:'#FFFFFF', navBarTextColor: '#FFFFFF',navBarTitleTextCentered:'center',navigationBarColor:'#1291d4'},
              animated: true,
              title:'Manage Bookings',
            });
        }
      }

      //navigator.toggleDrawer({ side: 'left', animated: true });
    }
  }
}
