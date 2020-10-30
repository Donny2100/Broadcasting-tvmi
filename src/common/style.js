import React from 'react-native';
import COLORS from './colors';
import FONTS from './fonts';
import { StyleSheet, Platform, Dimensions } from 'react-native';
import StyleMethods from './Style_Methods';
const { HEIGHT, WIDTH } = Dimensions.get('window');
const SHADOW_SIZE = Platform.select({ ios: 2, android: 11 });
/*
const FONTS = {
  'Exo2ExtraBold': 'Exo2-ExtraBold',
  'Exo2Medium': 'Exo2-Medium',
  'Exo2Bold': 'Exo2-Bold',
  'Exo2SemiBold': 'Exo2-SemiBold',
  'Exo2Regular': 'Exo2-Regular'
};

module.exports = {
  "container":{
    flexDirection:'column',
    flex:1,
    width:StyleMethods.getWidth(),
    height:StyleMethods.getHeight(),
    alignItems:'center',
    justifyContent: 'center',
    backgroundColor:COLORS.WHITE
  },
}
*/

export const newsFeed = StyleSheet.create({
  topView: {
    flex: 1.5,
    backgroundColor: 'white',
    width: StyleMethods.getWidth(),
    flexDirection: 'row',
  },
  topViewLeft: { flex: 1, paddingLeft: StyleMethods.getFontSize(30) },
  topViewRight: { flex: 1, flexDirection: 'row' },
  topViewparallex: {
    flex: 1.5,
    height: StyleMethods.getFontSize(100),
    backgroundColor: 'transparent',
    width: StyleMethods.getWidth(),
    flexDirection: 'row',
  },
  topViewRightparallex: {
    height: StyleMethods.getFontSize(100),
    position: 'absolute',
    right: StyleMethods.getFontSize(10),
    top: StyleMethods.getFontSize(10),
  },
  topViewLeftparallex: {
    paddingLeft: StyleMethods.getFontSize(30),
    height: StyleMethods.getFontSize(100),
  },
  noListItem: {
    alignSelf: 'center',
    margin: StyleMethods.getFontSize(20),
    textAlign: 'center',
    fontSize: StyleMethods.getFontSize(StyleMethods.getHeight() * 0.02),
    fontFamily: FONTS.MONTSERRATREGULAR,
  },  
  usernameView: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginRight: StyleMethods.getWidth() * 0.1,
  },
  initialnameView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginRight: StyleMethods.getFontSize(5),
  },
  welcomeText: {
    flexWrap: 'wrap',
    fontSize: StyleMethods.getFontSize(StyleMethods.getHeight() * 0.017),
    fontFamily: FONTS.MONTSERRATREGULAR,
    color: COLORS.BLUETHEMECOLOR,
  },
  piView: {
    height: StyleMethods.getWidth() * 0.18,
    width: StyleMethods.getWidth() * 0.18,
    borderRadius: StyleMethods.getWidth() * 0.18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C51A25',
  },
  piText: {
    fontSize: StyleMethods.getFontSize(StyleMethods.getHeight() * 0.05),
    color: '#8C0000',
    fontFamily: FONTS.MONTSERRATBOLD,
  },
  menuButton: {
    height: StyleMethods.getHeight() * 0.11,
    alignItems: 'center',
    justifyContent: 'center',
    width: StyleMethods.getHeight() * 0.11,
    borderBottomLeftRadius: StyleMethods.getFontSize(3),
    borderBottomRightRadius: StyleMethods.getFontSize(3),
    backgroundColor: '#C51A25',
  },
  newsfeedmenuButton: {
    height: StyleMethods.getHeight() * 0.11,
    alignItems: 'center',
    justifyContent: 'center',
    width: StyleMethods.getHeight() * 0.11,
    borderBottomLeftRadius: StyleMethods.getFontSize(3),
    borderBottomRightRadius: StyleMethods.getFontSize(3),
    backgroundColor: '#C51A25',
  },
  menubarMenuButton: {
    height: StyleMethods.getHeight() * 0.11,
    alignItems: 'center',
    justifyContent: 'center',
    width: StyleMethods.getHeight() * 0.11,
    borderBottomLeftRadius: StyleMethods.getFontSize(3),
    borderBottomRightRadius: StyleMethods.getFontSize(3),
    backgroundColor: '#C51A25',
  },
  walkthrough_menubarMenuButton: {
    height: StyleMethods.getHeight() * 0.11,
    alignItems: 'center',
    justifyContent: 'center',
    width: '95%',
    borderBottomLeftRadius: StyleMethods.getFontSize(3),
    borderBottomRightRadius: StyleMethods.getFontSize(3),
    backgroundColor: '#C51A25',
  },
  menuImage: {
    resizeMode: 'contain',
    height: StyleMethods.getFontSize(60),
    width: StyleMethods.getFontSize(50),
  },
  bottomView: {
    flex: 8.5,
    backgroundColor: 'white',
    width: StyleMethods.getWidth(),
  },
  tabStyle: {
    height: StyleMethods.getFontSize(30),
    paddingBottom: StyleMethods.getFontSize(10),
  },
  tabText: {
    fontSize: StyleMethods.getFontSize(StyleMethods.getHeight() * 0.025),
    fontFamily: FONTS.MONTSERRATBOLD,
    fontWeight: 'normal',
  },
  selectedTab: { height: StyleMethods.getFontSize(30) },
  tabsMainView: { flex: 1, backgroundColor: 'white' },
  belowTabsView: { flex: 9, paddingHorizontal: StyleMethods.getFontSize(10) },
  feedssingleView: { flex: 1 },
  feedssingleMainView: {
    height: StyleMethods.getWidth(),
    borderRadius: StyleMethods.getFontSize(20),
    backgroundColor: 'white',
    marginVertical: StyleMethods.getFontSize(20),
    marginHorizontal: StyleMethods.getFontSize(10),
    marginRight: StyleMethods.getFontSize(10),
  },
  feedsimageView: { flex: 1 },
  feedsTextmainView: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  feedsimageBottom: {
    flex: 0,
    justifyContent: 'center',
    backgroundColor: '#062244',
    opacity: 0.7,
    paddingVertical: StyleMethods.getFontSize(10),
    paddingHorizontal: StyleMethods.getFontSize(10),
    borderBottomLeftRadius: StyleMethods.getFontSize(20),
    borderBottomRightRadius: StyleMethods.getFontSize(20),
  },
  feedsimageBottom2: {
    flex: 0,
    backgroundColor: '#062244',
    justifyContent: 'center',
    opacity: 0.5,
    paddingVertical: StyleMethods.getFontSize(5),
    paddingHorizontal: StyleMethods.getFontSize(10),
  },

  categoryText: {
    fontSize: StyleMethods.getFontSize(StyleMethods.getHeight() * 0.02),
    color: 'white',
    fontFamily: FONTS.MONTSERRATREGULAR,
  },
  categorytitleText: {
    fontSize: StyleMethods.getFontSize(StyleMethods.getHeight() * 0.025),
    fontFamily: FONTS.MONTSERRATBOLD,
    color: 'white',
  },
  relatedStoryText: {
    fontSize: StyleMethods.getFontSize(StyleMethods.getHeight() * 0.023),
    color: 'white',
    opacity: 0.8,
    paddingRight: StyleMethods.getFontSize(10),
    fontFamily: FONTS.MONTSERRATBOLD,
  },
  relatedStoryCategory: {
    fontSize: StyleMethods.getFontSize(StyleMethods.getHeight() * 0.02),
    color: 'white',
    opacity: 0.8,
    paddingBottom: StyleMethods.getFontSize(10),
    fontFamily: FONTS.MONTSERRATREGULAR,
  },
  relatedStoryheadingtext: {
    fontSize: StyleMethods.getFontSize(StyleMethods.getHeight() * 0.024),
    color: 'white',
    fontFamily: FONTS.MONTSERRATREGULAR,
  },
  sharetext: {
    fontSize: StyleMethods.getFontSize(StyleMethods.getHeight() * 0.02),
    color: '#74070D',
    fontFamily: FONTS.MONTSERRATREGULAR,
  },
  shareIcon: {
    resizeMode: 'contain',
    height: StyleMethods.getHeight() * 0.04,
    width: StyleMethods.getHeight() * 0.04,
  },
  relatedStoryrowView: {
    height: StyleMethods.getHeight() * 0.2,
    flexDirection: 'row',
    backgroundColor: '#082F5E',
    paddingVertical: StyleMethods.getFontSize(5),
  },
  savedStoryrowView: {
    height: StyleMethods.getHeight() * 0.2,
    flexDirection: 'row',
    paddingVertical: StyleMethods.getFontSize(10),
    paddingHorizontal: StyleMethods.getFontSize(10)
  },
  savedStoryText: {
    fontSize: StyleMethods.getFontSize(StyleMethods.getHeight() * 0.023),
    color: '#646464',
    opacity: 0.8,
    paddingRight: StyleMethods.getFontSize(10),
    fontFamily: FONTS.MONTSERRATLIGHT,
  },
  savedStoryCategory: {
    fontSize: StyleMethods.getFontSize(StyleMethods.getHeight() * 0.02),
    color: '#C51A25',
    opacity: 0.8,
    paddingBottom: StyleMethods.getFontSize(9),
    fontFamily: FONTS.MONTSERRATREGULAR,
  },
  savedStoryDate: {
    fontSize: StyleMethods.getFontSize(StyleMethods.getHeight() * 0.02),
    color: '#646464',
    opacity: 0.8,
    paddingBottom: StyleMethods.getFontSize(7),
    fontFamily: FONTS.MONTSERRATREGULAR,
  },
});

export const storyPage = StyleSheet.create({
  mainView: { flex: 1, justifyContent: 'flex-end' },
  storyImageView: {
    width: StyleMethods.getWidth(),
    height: StyleMethods.getWidth(),
    marginBottom: StyleMethods.getFontSize(10),
  },
  storyimageBottom: {
    flex: 0,
    paddingVertical: StyleMethods.getFontSize(10),
    backgroundColor: '#062244',
    opacity: 0.7,
    paddingHorizontal: StyleMethods.getFontSize(10),
  },
});

export const searchPage = StyleSheet.create({
  searchInputView: {
    flex: 1.5,
    justifyContent: 'center',
    paddingVertical: StyleMethods.getFontSize(10),
    backgroundColor: '#C51A25',
  },
  searchWholeView: { flex: 8.5, justifyContent: 'center' },
  backgroundImage: { flex: 1, resizeMode: 'contain' },
  textInputView: {
    flexDirection: 'row',
    height: StyleMethods.getFontSize(45),
    alignItems: 'center',
    backgroundColor: 'silver',
    opacity: 0.4,
    marginHorizontal: StyleMethods.getFontSize(20),
  },
  search_textInput: {
    flex: 1,
    backgroundColor: 'transparent',
    marginLeft: StyleMethods.getFontSize(10),
    height: StyleMethods.getFontSize(40),
    fontSize: StyleMethods.getFontSize(16),
    justifyContent: 'center',
    paddingLeft: StyleMethods.getFontSize(20),
    fontFamily: FONTS.MONTSERRATITALIC,
  },
  searchsingleMainView: {
    height: StyleMethods.getWidth(),
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    borderRadius: StyleMethods.getFontSize(20),
    backgroundColor: 'rgba(128,128,128,0.4)',
    marginVertical: StyleMethods.getFontSize(10),
    marginHorizontal: StyleMethods.getFontSize(10),
  },
  searchsingleView: { flex: 1 },
  searchImage: {
    height: StyleMethods.getFontSize(25),
    width: StyleMethods.getFontSize(25),
    resizeMode: 'contain',
    marginRight: StyleMethods.getFontSize(20),
  },
});

export const livetv = StyleSheet.create({
  livetabsView: { flex: 1, backgroundColor: '#C51A25' },
  singletvView: {
    height: StyleMethods.getFontSize(350),
    paddingHorizontal: StyleMethods.getFontSize(20),
    borderBottomWidth: StyleMethods.getFontSize(1),
    borderBottomColor: 'rgba(255,255,255,.1)',
    backgroundColor: '#062244',
  },
  liveselectedTab: {
    height: StyleMethods.getFontSize(30),
    borderBottomWidth: StyleMethods.getFontSize(2),
    borderBottomColor: 'white',
  },
  livetabText: {
    fontSize: StyleMethods.getFontSize(16),
    fontFamily: FONTS.MONTSERRATREGULAR,
    fontWeight: 'normal',
    paddingTop: StyleMethods.getFontSize(15),
  },
  nowtextView: {
    flexDirection: 'row',
    paddingVertical: StyleMethods.getFontSize(8),
  },
  nowtext1: {
    fontSize: StyleMethods.getFontSize(16),
    color: 'rgba(255,255,255,.5)',
    fontFamily: FONTS.MONTSERRATREGULAR,
  },
  nowtext2: {
    fontSize: StyleMethods.getFontSize(16),
    color: 'white',
    fontFamily: FONTS.MONTSERRATREGULAR,
  },
  livetvImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: StyleMethods.getFontSize(5),
  },
  livetvPlay: {
    flex: 1,
    marginTop: StyleMethods.getFontSize(10),
    marginBottom: StyleMethods.getFontSize(20),
    width: StyleMethods.getWidth() - 40,
    borderWidth: StyleMethods.getFontSize(1),
    borderRadius: StyleMethods.getFontSize(5),
    borderColor: COLORS.BUTTONBG,
    backgroundColor: 'rgba(255,255,255,.1)',
  },
  logoView: {
    paddingTop: StyleMethods.getFontSize(18),
    paddingBottom: StyleMethods.getFontSize(5),
    alignSelf: 'flex-start',
  },
  channelLogo: {
    width: StyleMethods.getFontSize(139),
    height: StyleMethods.getFontSize(35),
    resizeMode: 'cover',
  },
  radiochannelLogo: {
    width: StyleMethods.getFontSize(239),
    height: StyleMethods.getFontSize(35),
    resizeMode: 'cover',
  },
  radioRowView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: StyleMethods.getFontSize(10),
  },
  radiorowlogoView: { flex: 4, justifyContent: 'center', alignItems: 'center' },
  radiorowplayView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: StyleMethods.getFontSize(10),
  },
});

export const bulletins = StyleSheet.create({
  toptextView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: StyleMethods.getFontSize(20),
  },
  bulletinstopView: {
    flex: 1.5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: 'white',
    width: StyleMethods.getWidth(),
  },
  toptext: {
    fontSize: StyleMethods.getFontSize(StyleMethods.getHeight() * 0.035),
    letterSpacing: StyleMethods.getFontSize(1),
    fontFamily: FONTS.MONTSERRATREGULAR,
    color: '#062244',
  },
  bulletsinstabsView: {
    flex: 1,
    backgroundColor: '#C51A25',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: StyleMethods.getFontSize(25),
    alignItems: 'center',
  },
  tabstext: {
    fontSize: StyleMethods.getFontSize(StyleMethods.getHeight() * 0.02),
    fontFamily: FONTS.MONTSERRATREGULAR,
    color: 'white',
  },
  bulletinslistSingleView: {
    height: StyleMethods.getHeight() * 0.2,
    alignItems: 'center',
    paddingHorizontal: StyleMethods.getFontSize(10),
  },
  bulletinsbelowTabsView: { flex: 9, backgroundColor: '#062244' },
  bulletinsbelowFormView: { flex: 9, backgroundColor: 'white' },
  formWrapper: { padding: StyleMethods.getFontSize(30) },
  //  "bulletinsView":{flex:}
  rowTouchView: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  rowTouchstartView: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowTouchcenterView: { flex: 2, justifyContent: 'center' },
  rowTouchendView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  videoImage: {
    width: StyleMethods.getHeight() * 0.17,
    justifyContent: 'center',
    alignItems: 'center',
    height: StyleMethods.getHeight() * 0.11,
  },
  videoname: {
    flexWrap: 'wrap',
    fontSize: StyleMethods.getFontSize(StyleMethods.getHeight() * 0.02),
    fontFamily: FONTS.MONTSERRATREGULAR,
    marginBottom: StyleMethods.getFontSize(10),
    color: 'white',
  },
  videodate: {
    fontSize: StyleMethods.getFontSize(StyleMethods.getHeight() * 0.015),
    fontFamily: FONTS.MONTSERRATITALIC,
    color: 'white',
  },
  featuredVideosheadingText: {
    fontSize: StyleMethods.getFontSize(13),
    color: 'white',
    fontFamily: FONTS.MONTSERRATREGULAR,
  },
  uploadFileWrapperView: {
    borderColor: '#858585',
    borderWidth: StyleMethods.getFontSize(1),
    borderRadius: StyleMethods.getFontSize(14),
    borderStyle: 'dotted',
    marginBottom: StyleMethods.getFontSize(20),
  },  
  uploadFileInnerWrapperView: {
    alignItems: 'center',
    padding: StyleMethods.getFontSize(12),
  },
  textInputView: {
    borderRadius: StyleMethods.getFontSize(4),
    marginVertical: StyleMethods.getFontSize(4.5),
    paddingHorizontal: StyleMethods.getFontSize(15),
    paddingVertical: StyleMethods.getFontSize(8),
    backgroundColor: '#F2F2F2',
    color: '#000000',
    fontFamily: FONTS.MONTSERRATLIGHT,
  },
  submitView: {
    marginVertical: StyleMethods.getFontSize(4.5),
    borderRadius: StyleMethods.getFontSize(2),
    paddingVertical: StyleMethods.getFontSize(11),
    backgroundColor: '#C51A25',
  },
  submitTextView: {
    color: 'white',
    alignSelf: 'center',
    fontSize: StyleMethods.getFontSize(16),
    fontFamily: FONTS.MONTSERRATREGULAR
  },
  uploadIcon: {
    resizeMode: 'contain',
    height: StyleMethods.getFontSize(50),
    width: StyleMethods.getFontSize(50),
    tintColor: '#707070'
  },
  previewImage: {
    resizeMode: 'contain',
    height: StyleMethods.getFontSize(120),
    width: StyleMethods.getFontSize(120),
  },
  uploadText: {
    marginVertical: StyleMethods.getFontSize(4.5),
    color: '#707070',
    fontSize: StyleMethods.getFontSize(28),
    fontFamily: FONTS.MONTSERRATLIGHT,
    alignSelf: 'center',
    textAlign: 'center'
  },
  dialog: {
    width: WIDTH - StyleMethods.getFontSize(20),
    borderRadius: StyleMethods.getFontSize(8),
    backgroundColor: 'white',
  },
  menuItem: {
    marginVertical: StyleMethods.getFontSize(4.5),
    paddingHorizontal: StyleMethods.getFontSize(15),
    paddingVertical: StyleMethods.getFontSize(8),
    textAlign: 'center',
    color: '#000000',
    fontFamily: FONTS.MONTSERRATLIGHT,
  }
});

export const commonStyle = StyleSheet.create({
  elevatedShadow: {
    zIndex: 99,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: SHADOW_SIZE,
  },
  testfont: {
    fontFamily: FONTS.MERRIWEATHERBOLD,
    fontSize: 28,
  },
  greentoast: {
    backgroundColor: 'rgba(0,128,0,.8)',
    // color: FONTS.white,
    // fontSize: StyleMethods.getFontSize(16),
    paddingHorizontal: StyleMethods.getFontSize(30),
    // textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '90%',
  },
  redtoastBackground: {
    backgroundColor: 'rgba(255,0,0,.8)',
  },
  redtoast: {
    backgroundColor: 'rgba(255,0,0,.8)',
    // color: FONTS.white,
    // fontSize: StyleMethods.getFontSize(16),
    paddingHorizontal: StyleMethods.getFontSize(30),
    // textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '90%',
  },
  fullscreen: { flex: 1, backgroundColor: 'black', justifyContent: 'center' },
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop:
      Platform.OS === 'ios'
        ? StyleMethods.getFontSize(20)
        : StyleMethods.getFontSize(0),
    position: 'relative',
  },
  loginBody: { flex: 1, paddingTop: StyleMethods.getFontSize(40) },
  loginCenter: {
    flex: 6,
    justifyContent: 'center',
    marginHorizontal: StyleMethods.getFontSize(35),
    marginTop: StyleMethods.getFontSize(20),
  },

  contact_text_Input: {
    flex: 1,
    height: StyleMethods.getFontSize(40),
    textAlign: 'center',
    paddingBottom: StyleMethods.getFontSize(10),
    fontSize: StyleMethods.getFontSize(10),
    //fontFamily:FONTS.RobotoMediumItalic,
    paddingRight: StyleMethods.getFontSize(40),
  },
  inputContainer: {
    width: '100%',
    height: 60,
    backgroundColor: 'blue',
  },
  inputStyle: {
    backgroundColor: 'blue',
  },
  contact_textInput: {
    flex: 1,
    height: StyleMethods.getHeight() * 0.05,
    //    height:StyleMethods.getFontSize(40),
    fontSize: StyleMethods.getFontSize(StyleMethods.getHeight() * 0.02),
    fontFamily: FONTS.MONTSERRATREGULAR,
    color: COLORS.WHITE,
    //paddingRight:StyleMethods.getFontSize(40)
  },
  buttonStyle: {
    alignItems: 'center',
    padding: StyleMethods.getFontSize(10),
    backgroundColor: COLORS.BUTTONBG,
    marginTop: StyleMethods.getFontSize(20),
  },
  updatebuttonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.BUTTONBG,
    marginTop: StyleMethods.getFontSize(20),
    height: StyleMethods.getHeight() * 0.07,
  },

  donebuttonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    height: StyleMethods.getHeight() * 0.06,
    width: StyleMethods.getWidth() * 0.5,
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.BUTTONBG,
    borderLeftWidth: StyleMethods.getFontSize(1),
    borderLeftColor: COLORS.BUTTONBG,
  },
  previousbuttonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    height: StyleMethods.getHeight() * 0.06,
    width: StyleMethods.getWidth() * 0.5,
    position: 'absolute',
    bottom: 0,
    left: 0,
    borderRightWidth: StyleMethods.getFontSize(1),
    borderRightColor: COLORS.BUTTONBG,
  },
  backbuttonStyle: {
    alignItems: 'center',
    padding: StyleMethods.getFontSize(10),
    backgroundColor: COLORS.BACKGROUNDCOLOR,
    opacity: 0.9,
    marginTop: StyleMethods.getFontSize(20),
  },
  buttonTextStyle: {
    fontSize: StyleMethods.getFontSize(StyleMethods.getHeight() * 0.02),
    color: COLORS.WHITE,
    fontFamily: FONTS.MONTSERRATREGULAR,
  },
  errorTextStyle: {
    fontSize: StyleMethods.getFontSize(StyleMethods.getHeight() * 0.015),
    color: COLORS.RED,
    fontFamily: FONTS.MONTSERRATREGULAR,
    textAlign: 'center',
  },
});

export const loginPageStyle = StyleSheet.create({
  loginContainer: {
    flexDirection: 'column',
    flex: 1,
    width: '100%',
    height: '100%',
    //alignItems:'center',
    justifyContent: 'flex-start',
    paddingHorizontal: StyleMethods.getFontSize(40),
    //backgroundColor:COLORS.WHITE
  },
  walkThroughloginContainer: {
    flexDirection: 'column',
    flex: 1,
    width: '100%',
    height: '100%',
    marginBottom: StyleMethods.getFontSize(40),
    //alignItems:'center',
    justifyContent: 'flex-start',
    paddingHorizontal: StyleMethods.getFontSize(40),
    //backgroundColor:COLORS.WHITE
  },
  logoContainer: {
    height: '20%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    //backgroundColor:'red'
  },
  LoginlogoContainer: {
    height: '30%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor:'red'
  },
  onBoardinglogoContainer: {
    height: StyleMethods.getHeight() * 0.25,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor:'red'
  },
  logo: {
    width: StyleMethods.getWidth() * 0.8,
    height: StyleMethods.getHeight() * 0.25,
    marginTop: StyleMethods.getFontSize(20),
    //height:StyleMethods.getFontSize(70),
    //backgroundColor:'red'
    //  resizeMode:'contain'
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: StyleMethods.getFontSize(20),
  },
  forgotPasswordText: {
    fontSize: StyleMethods.getFontSize(12),
    color: COLORS.WHITE,
    fontFamily: FONTS.MONTSERRATREGULAR,
    opacity: 0.8,
  },
  createAccount: {
    marginTop: StyleMethods.getFontSize(20),
    alignItems: 'center',
  },
  createAccountText: {
    fontSize: StyleMethods.getFontSize(14),
    color: COLORS.INTROBG,
    fontFamily: FONTS.MONTSERRATREGULAR,
  },
  newtotvmText: {
    fontSize: StyleMethods.getFontSize(20),
    color: COLORS.WHITE,
    fontFamily: FONTS.MONTSERRATREGULAR,
  },
});

export const SignupStyle = StyleSheet.create({
  checkboxContainer: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: StyleMethods.getFontSize(10),
  },
  checkboxStyle: {
    flex: 1,
    paddingRight: StyleMethods.getFontSize(10),
  },
  checkboxTextContainer: {
    width: '85%',
    flexDirection: 'row',
  },
  checkboxTextStyle: {
    color: COLORS.WHITE,
    opacity: 0.5,
    fontSize: StyleMethods.getFontSize(StyleMethods.getHeight() * 0.017),
    fontFamily: FONTS.MONTSERRATLIGHT,
  },
  clickHereStyle: {
    textDecorationLine: 'underline',
  },
});

export const ForgotPasswordStyle = StyleSheet.create({
  BackToLogin: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: StyleMethods.getFontSize(80),
    alignItems: 'center',
    justifyContent: 'center',
  },
  BackToLoginText: {
    fontSize: StyleMethods.getFontSize(14),
    color: COLORS.WHITE,
    opacity: 0.5,
    fontFamily: FONTS.MONTSERRATREGULAR,
    textAlign: 'center',
  },
});

export const ModalStyle = StyleSheet.create({
  modalContainer: {
    paddingVertical: StyleMethods.getFontSize(30),
    //backgroundColor:'rgba(255,255,255,0.5)',
  },
  menuModal: {
    paddingVertical: 0,
    margin: 0,
    marginTop:
      Platform.OS === 'ios'
        ? StyleMethods.getFontSize(20)
        : StyleMethods.getFontSize(0),
    paddingLeft: StyleMethods.getFontSize(30),
    //backgroundColor:'purple'
    //backgroundColor:'rgba(255,255,255,0.5)',
  },
  menuModalInner: {
    //flex: 1,
    flexDirection: 'row',
    //backgroundColor:'red'
  },
  modalTransparentBG: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: -30,
    width: '100%',
    height: StyleMethods.getHeight(),
    //    backgroundColor:'grey',
    //    opacity:0.9,
    backgroundColor: 'rgba(255,255,255,.5)',
    zIndex: 100,
  },
  modalInnerView: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    borderRadius: StyleMethods.getFontSize(10),
  },
  modalTitleContainer: {
    paddingVertical: StyleMethods.getFontSize(20),
    width: '100%',
    borderBottomWidth: StyleMethods.getFontSize(1),
    borderBottomColor: COLORS.SEPARATORCOLOR,
  },
  modalTitle: {
    color: COLORS.PRIMARYTEXT,
    fontFamily: FONTS.MONTSERRATREGULAR,
    fontSize: StyleMethods.getFontSize(16),
    textAlign: 'center',
  },
  modalButtonsContainer: {
    width: '100%',
    backgroundColor: COLORS.WHITE,
    flexDirection: 'row',
  },
  modalButtonInnerView: {
    width: '50%',
    padding: 10,
  },
  declineButton: {
    width: '100%',
    borderColor: COLORS.PRIMARYTEXT,
    borderWidth: StyleMethods.getFontSize(1),
    borderRadius: StyleMethods.getFontSize(5),
    height: StyleMethods.getFontSize(50),
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButton: {
    width: '100%',
    backgroundColor: COLORS.PRIMARYTEXT,
    borderColor: COLORS.PRIMARYTEXT,
    borderWidth: StyleMethods.getFontSize(1),
    borderRadius: StyleMethods.getFontSize(3),
    height: StyleMethods.getFontSize(50),
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineText: {
    color: COLORS.PRIMARYTEXT,
    textAlign: 'center',
    fontFamily: FONTS.MONTSERRATREGULAR,
    fontSize: StyleMethods.getFontSize(16),
  },
  acceptText: {
    color: COLORS.WHITE,
    textAlign: 'center',
    fontFamily: FONTS.MONTSERRATREGULAR,
    fontSize: StyleMethods.getFontSize(16),
  },
  menuLeftSideWalkthrough: {
    marginTop: StyleMethods.getFontSize(20),
    marginLeft: StyleMethods.getFontSize(20),
    width: '80%',
    flexDirection: 'column',
  },
  menuLeftSide: {
    //width:'30%',
    width: '22%',
    //shadowColor: '#000',
    //shadowOffset: { width: 0, height: 2 },
    //shadowOpacity: 0.2,
    //elevation:5,
    //position:'relative'
    //backgroundColor:'green'
    //getWidth
  },
  menuLeftItemContainer: {
    width: StyleMethods.getHeight() * 0.11,
    height: StyleMethods.getHeight() * 0.13,
    backgroundColor: COLORS.PRIMARYTEXT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: StyleMethods.getFontSize(15),
    paddingHorizontal: StyleMethods.getFontSize(5),
    borderBottomColor: COLORS.SEPARATORCOLOR,
    borderBottomWidth: StyleMethods.getFontSize(1),
  },
  menuLeftWalkthroughContainer: {
    width: '95%',
    backgroundColor: COLORS.PRIMARYTEXT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: StyleMethods.getFontSize(12),
    paddingHorizontal: StyleMethods.getFontSize(5),
    borderBottomColor: COLORS.SEPARATORCOLOR,
    borderBottomWidth: StyleMethods.getFontSize(1),
  },
  menuLeftItemImage: {
    width: StyleMethods.getFontSize(35),
    height: StyleMethods.getFontSize(35),
  },
  menuLeftItemText: {
    color: COLORS.WHITE,
    opacity: 0.5,
    fontFamily: FONTS.MONTSERRATBOLD,
    fontSize: StyleMethods.getFontSize((2.5 * StyleMethods.getWidth()) / 100),
    textAlign: 'center',
    marginTop: StyleMethods.getFontSize(10),
    //wordWrap:'wrap'
  },
  menuleftItemTextContainer: {
    height: StyleMethods.getFontSize(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  walkthroughMenuMainContainer: {
    position: 'absolute',
    top: 0,
    left: -4,
    width: '30%',
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  menuLeftItemTextWalkthrough: {
    color: COLORS.WHITE,
    opacity: 0.5,
    fontFamily: FONTS.MONTSERRATBOLD,
    fontSize: StyleMethods.getFontSize((2.2 * StyleMethods.getWidth()) / 100),
    textAlign: 'center',
  },
  menuRightItemContainer: {
    //width:'70%',
    //backgroundColor:'yellow',
    width: StyleMethods.getWidth() - StyleMethods.getFontSize(65),
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const IntroStyle = StyleSheet.create({
  topView: {
    flex: 2.5,
    backgroundColor: 'white',
    width: StyleMethods.getWidth(),
    flexDirection: 'row',
  },
  bottomView: {
    flex: 7.5,
    backgroundColor: 'white',
    width: StyleMethods.getWidth(),
  },
  introContainer: {
    flexDirection: 'column',
    flex: 1,
    position: 'relative',
    width: StyleMethods.getWidth(),
    height: StyleMethods.getHeight(),
    //alignItems:'center',
    justifyContent: 'flex-start',
    paddingHorizontal: StyleMethods.getFontSize(40),
    backgroundColor: COLORS.INTROBG,
  },
  settingsContainer: {
    position: 'relative',
  },
  settingsLogoContainer: {
    width: StyleMethods.getWidth(),
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  settingsLogoContainerinner: {
    backgroundColor: COLORS.INTROBG,
    width: StyleMethods.getWidth(),
    height: StyleMethods.getFontSize(67),
    position: 'absolute',
    top: StyleMethods.getFontSize(65),
    left: 0,
  },
  settingsLogoMain: {
    width: StyleMethods.getFontSize(132),
    height: StyleMethods.getFontSize(132),
    borderRadius: StyleMethods.getFontSize(66),
    borderColor: '#ccc',
    borderWidth: StyleMethods.getFontSize(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsLogo: {
    width: StyleMethods.getFontSize(130),
    height: StyleMethods.getFontSize(130),
    borderRadius: StyleMethods.getFontSize(65),
    borderColor: COLORS.WHITE,
    borderWidth: StyleMethods.getFontSize(5),
    backgroundColor: COLORS.INTROBG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: COLORS.SEPARATORCOLOR,
    fontSize: StyleMethods.getFontSize(65),
    fontFamily: FONTS.MONTSERRATBOLD,
  },
  introTitle: {
    color: COLORS.WHITE,
    textAlign: 'center',
    fontFamily: FONTS.MONTSERRATREGULAR,
    fontSize: StyleMethods.getFontSize(StyleMethods.getHeight() * 0.025),
  },
  settingsTitle: {
    color: COLORS.WHITE,
    fontFamily: FONTS.MONTSERRATREGULAR,
    fontSize: StyleMethods.getFontSize(16),
    textAlign: 'left',
    paddingVertical: StyleMethods.getFontSize(15),
  },
  privacyButton: {
    width: StyleMethods.getFontSize(168),
    //    paddingVertical:StyleMethods.getFontSize(15),
    height: StyleMethods.getHeight() * 0.07,
    backgroundColor: COLORS.SEPARATORCOLOR,
    borderBottomColor: COLORS.CREATEACCOUNT,
    borderBottomWidth: StyleMethods.getFontSize(4),
    borderRadius: StyleMethods.getFontSize(2),
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: StyleMethods.getFontSize(30),
  },
  privacyButtonText: {
    color: COLORS.WHITE,
    fontFamily: FONTS.MONTSERRATREGULAR,
    fontSize: StyleMethods.getFontSize(16),
    textAlign: 'center',
  },
  introText: {
    color: COLORS.WHITE,
    //textAlign:'center',
    fontFamily: FONTS.MONTSERRATREGULAR,
    fontSize: StyleMethods.getFontSize(StyleMethods.getHeight() * 0.02),
  },
  introScrollView: {
    //backgroundColor:'yellow'
    paddingTop: StyleMethods.getFontSize(10),
    paddingBottom: StyleMethods.getFontSize(100),
  },
  languageCheck: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifyCheck: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    //backgroundColor:'green',
    position: 'relative',
    paddingVertical: StyleMethods.getFontSize(12),
    borderBottomColor: COLORS.SEPARATORCOLOR,
    borderBottomWidth: StyleMethods.getFontSize(2),
  },
  checkboxStyle: {
    marginHorizontal: StyleMethods.getFontSize(15),
  },
  notifyCheckbox: {
    position: 'absolute',
    right: 0,
  },
  checkBoxIcon: {
    width: StyleMethods.getHeight() * 0.05,
    height: StyleMethods.getHeight() * 0.03,
  },
  notificationsChecksContainer: {
    paddingVertical: StyleMethods.getFontSize(20),
    width: '100%',
    //backgroundColor:'yellow'
  },
});
