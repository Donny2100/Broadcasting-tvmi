//var moment = require('moment');
import React from "react-native";
import Dimensions from 'Dimensions';
import { PixelRatio,Platform,Alert} from 'react-native';
const {height:screenHeight, width:screenWidth} = Dimensions.get('window');
const scale = Dimensions.get('window').width / 375;
//import Realm from '../network/realm';
//var DeviceInfo = require('react-native-device-info');
import DeviceInfo from 'react-native-device-info';

exports.normalize=function(size: number): number {
  return Math.round(scale * size);
}

exports.getWidth=function(){
  /*if(Platform.OS === 'ios'){
    if(DeviceInfo.isTablet()){
      return (Orientation.getInitialOrientation() === 'PORTRAIT') ? screenWidth : screenHeight;
    }else{
      return screenWidth;
    }
  }else{
    return screenWidth;
  }*/
  return screenWidth;
}

exports.getHeight=function(){
  /*if(Platform.OS === 'ios'){
    if(DeviceInfo.isTablet()){
      return (Orientation.getInitialOrientation() === 'PORTRAIT') ? screenHeight : screenWidth;
    }else{
      return screenHeight;
    }
  }else{
    return screenHeight;
  }*/
  return screenHeight;
}

var pixelRatio = PixelRatio.get();
exports.getFontSize= function(currentFont){
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

exports.getLineHeightSize= function(currentFont){
  if(DeviceInfo.isTablet()){
    return currentFont*2;
  }else{
    return currentFont;
  }
}

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

exports.getCorrectFontSize= function(currentFont){
  if(DeviceInfo.isTablet()){
    return currentFont*1.5;
  }else{
    return currentFont;
  }
}

exports.getCurrentDate = function(){
  //return moment().format("YYYY-MM-DD HH:mm:ss");
}

exports.getAgendaDate = function(dateStr){
  console.log("dateStr: " + dateStr);
  var date = new Date(dateStr);
  console.log("FormattedStr: " + date.getDate() +" "+ getMonth(date.getMonth()));
  if(date.getDate() === NaN || getMonth(date.getMonth()) === undefined){
    var date = dateStr.split(" ")[0].split("-");
    var time = dateStr.split(" ")[1].split(":");
    var datetime = new Date();
    datetime.setFullYear(date[2].toString());
  	datetime.setMonth((date[1] - 1).toString() , date[0].toString());
  	datetime.setHours(time[0].toString());
  	datetime.setMinutes(time[1].toString());
  	datetime.setSeconds("0");
  	return datetime.getDate() +" "+ getMonth(datetime.getMonth());// +" "+ datetime.getFullYear();

  }
  return date.getDate() +" "+ getMonth(date.getMonth());
}

exports.getConditionalDate = function(dateStr){
  console.log("dateStr: " + dateStr);
  var date = new Date(dateStr);
  if(date.getDate() === NaN || getMonth(date.getMonth()) === undefined){
    var date = dateStr.split(" ")[0].split("-");
    var time = dateStr.split(" ")[1].split(":");
    var datetime = new Date();
    datetime.setFullYear(date[2].toString());
  	datetime.setMonth((date[1] - 1).toString() , date[0].toString());
  	datetime.setHours(time[0].toString());
  	datetime.setMinutes(time[1].toString());
  	datetime.setSeconds("0");
  	return datetime;

  }
  return date;
}


function float2int (value) {
  return value | 0;
}

function getMonth(month){
  var Months = ["Jan","Feb","Mrt","Apr","Mei","Jun","Jul","Aug","Sep","Okt","Nov","Dec"];
  return Months[month];
}
/*
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
*/
exports.shuffle=function(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

exports.FilterByDate = function(data){
  var filteredData = [];
  var CurrentDate = new Date();
  CurrentDate.setHours("0");
  CurrentDate.setMinutes("0");
  CurrentDate.setSeconds("0");
  for(var index in data) {
    var obj = data[index];
    var date = parseDate(obj.date);
    if(date >= CurrentDate){
        filteredData.push(obj);
    }else{
      console.log(date);
    }
  }
  return filteredData;
}

function parseDate(dateStr) {
  var date = dateStr.split(" ")[0].split("-");
  var time = dateStr.split(" ")[1].split(":");
  var datetime = new Date();
  datetime.setFullYear(date[2].toString());
  datetime.setMonth((date[1] - 1).toString() , date[0].toString());
  datetime.setHours(time[0].toString());
  datetime.setMinutes(time[1].toString());
  datetime.setSeconds( (time.length === 3)? time[2].toString() : "0");
  return datetime;
}

exports.parseDate = function(dateStr) {
  if(dateStr === undefined){
    return "";
  }
  var date = dateStr.split(" ")[0].split("-");
  var time = dateStr.split(" ")[1].split(":");
  var datetime = new Date();
  datetime.setFullYear(date[2].toString());
  datetime.setMonth((date[1] - 1).toString() , date[0].toString());
  datetime.setHours(time[0].toString());
  datetime.setMinutes(time[1].toString());
  datetime.setSeconds( (time.length === 3)? time[2].toString() : "0");
  return datetime;
}
/*
exports.getDateStr = function(date){
  return moment(date).format("YYYY-MM-DD HH:mm:ss");
  //var year = date("YYYY-MM-DD HH:mm:ss");
}

exports.getLastModifiedDate = function(date){
  return moment(date).format("DD-MM-YYYY HH:mm");
  //var year = date("YYYY-MM-DD HH:mm:ss");
}
*/
exports.getInfoContent = function(){
  return "De lunteren app is tot stand gekomen door een groep actieve ondernemers uit Lunteren. Het doel van de app is om informatie te verschaffen aan Lunteranen en bezoekers aan Lunteren en de uitwisseling van informatie te bevorderen. Ook deelnemen in de Lunteren App?  Kijk op www.lunteren-app.nl<\/a> voor meer informatie. Heeft u opmerkingen \/ suggesties voor de app? We vernemen ze graag, u kunt ze sturen aan contact@lunteren-app.nl<\/a><\/p><\/p>";
}

exports.getSpottzContent = function(){
  return "Beleef typisch lunteren via de compasroute van Spottz. download hem nu via www.spottz.nl<\/a>!<\/p>";
}

exports.getHTMLTAGS = function(){
  var fontSize = null;
  if(DeviceInfo.isTablet()){
    fontSize = '28px;';
  }else{
    fontSize = '14px;';
  }

  return '<!DOCTYPE html><html lang="en" xmlns="http://www.w3.org/1999/html"><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="description" content=""><meta name="author" content=""><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><meta name="HandheldFriendly" content="true" /><meta name="MobileOptimized" content="320" /><link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Exo2" /><style> body{ font-family: Exo2-Medium; font-size: '+fontSize+' font-style: normal; font-variant: normal; font-weight: 500; color:#757575;}</style></head><body>';
}

exports.Vertify = function (str){
  if( typeof str === 'undefined' || str === null ){
      return true;
  }
  return false;
}


const navigatorStyle = {
  disabledBackGesture:true,
  navBarHidden:false,
  statusBarColor: '#18a1dd',
  navBarTextFontFamily: 'Exo2-ExtraBold',
  //statusBarTextColorScheme: 'light',
  navigationBarColor: '#18a1dd',
  navBarBackgroundColor: '#18a1dd',
  navBarTextColor: '#FFFFFF',
  navBarButtonColor: '#FFFFFF',
  navBarHideOnScroll: false,
  navBarTitleTextCentered: true
};

const lunterennavstyle = {
  disabledBackGesture:true,
  navBarHidden:false,
  statusBarColor: '#18a1dd',
  navBarTextFontFamily: 'Exo2-ExtraBold',
  //statusBarTextColorScheme: 'light',
  navigationBarColor: '#18a1dd',
  navBarBackgroundColor: '#18a1dd',
  navBarTextColor: '#FFFFFF',
  navBarButtonColor: '#FFFFFF',
  navBarHideOnScroll: false,
  navBarTitleTextCentered: true
};
const lunterennavstylewithoutheader = {
  disabledBackGesture:true,
  navBarHidden:true,
};


var CurrentPage = null;
exports.onNavigatorEvent = function(event , navigator, DetailsRowData){
  console.log(event);
  console.log(DetailsRowData);
  if(event.type === 'DeepLink'){
    console.log('deeplinking');
    /*if(event.link === CurrentPage){
      return;
    }else{
      CurrentPage = event.link;
    }*/

    if(event.link === 'Logout'){
      navigator.setDrawerEnabled({side: 'left',enabled: false});
      navigator.resetTo({
        screen: 'Courier.LoginScreen',
        navigatorStyle:{navBarHidden:true},
      });
    }else if(event.link === 'Load Agenda'){
      navigator.resetTo({
        passProps: {user:loggedinuserdata},
  			screen:'Courier.AgendaLandingPage',
  			title: 'Agenda',
  			navigatorStyle:lunterennavstyle
  		});
    }else if(event.link === 'Load AdressBook'){
      navigator.resetTo({
        passProps: {user:loggedinuserdata},
  			screen:'Courier.CompanyLandingPage',
  			title:'Adresboek',
  			navigatorStyle:lunterennavstyle
  		});
    }else if(event.link === 'Load Updates'){
      navigator.resetTo({
        passProps: {user:loggedinuserdata},
  			screen:'Courier.HomeLandingPage',
  			title:'Updates',
  			navigatorStyle:lunterennavstyle
  		});
    }else if(event.link === 'Load Profile'){
      if(loggedinuserdata !== null){
        navigator.resetTo({
          passProps: {user:loggedinuserdata},
    			screen:'Courier.UpdateProfilePage',
    			title:'Profiel aanpassen',
    			navigatorStyle:lunterennavstyle
    		});
      }else{
        navigator.resetTo({
          screen:'Courier.RegisterPage',
    			navigatorStyle:lunterennavstylewithoutheader
    		});
      }

    }else if(event.link === 'Load Info'){
      navigator.resetTo({
  			screen: 'Courier.InfoLandingPage',
  			navigatorStyle:lunterennavstyle,
  			title:'Over de app'
  		});
    }else if(event.link === 'Load spotz'){
      navigator.resetTo({
        screen: 'Courier.SpotsLandingPage',
  			navigatorStyle:lunterennavstyle,
  			title:'Kompas spel'
  		});
    }else if(event.link === 'Load Actions'){
      navigator.resetTo({
        passProps: {user:loggedinuserdata},
  			screen: 'Courier.ActionsLandingsPage',
  			navigatorStyle:lunterennavstyle,
  			title:'Acties'
  		});
    }else if(event.link === 'Logout User'){
      navigator.resetTo({
        screen:'Courier.LoginScreen',
  			navigatorStyle:lunterennavstylewithoutheader,
  			title:'Login'
  		});
    }else if(event.link === 'Settings'){
      navigator.resetTo({
        screen: 'Courier.Settings',
        navigatorStyle:NavBarHeaderStyle,
        title:'Settings'
      });
    }else if(event.link === 'PrivacyPolicy'){
      //alert('privacy');
      navigator.resetTo({
        screen: 'Courier.Privacy',
        navigatorStyle:NavBarHeaderStyle,
        title:'Privacy Policy'
      });
    }else if (event.link === 'MenuPage') {
      navigator.toggleDrawer({ side: 'left', animated: true });
    }else if (event.link === 'close') {
      navigator.setDrawerEnabled({side: 'left',enabled: true});
      navigator.pop({ animated: true });
    }
  }else{
    if (event.id === 'bars') {
      //navigator.setDrawerEnabled({side: 'left',enabled: true});
      navigator.toggleDrawer({ side: 'left', animated: true });
    }if (event.id === 'user') {

    }else if (event.id === 'back') {
    //  navigator.setDrawerEnabled({side: 'left',enabled: true});
      navigator.pop({ animated: true });
    //  CurrentPage = null;
    }else if (event.id === 'candidates_filter') {
      navigator.setDrawerEnabled({side: 'left',enabled: true});
      navigator.pop({ animated: true });
    }else if (event.id === 'sliders') {
      navigator.push({
				screen: 'YAHBG.RatingPage',
        title:"Filters",
        navigatorStyle: navigatorStyleLIGHT,
				animated: true
			});
    }
  }
}
