'use strict';
import React, { Component } from "react";
import {
   Navigator,
   StatusBar,
   StyleSheet,
   ScrollView,
   ImageBackground,
   Text,
   View,
   TouchableOpacity,
   Animated,
   Dimensions,
   Image,
   Platform,
   Alert
} from "react-native";
import PropTypes from 'prop-types';
import IMAGES from '../../common/images';
import COLORS from '../../common/colors';
import FONTS from '../../common/fonts';
import network from '../../common/network';
import { commonStyle as cs, loginPageStyle as lg, IntroStyle } from '../../common/style';
import StyleMethods from '../../common/Style_Methods';
import renderIf from '../../common/renderIf';
import Realm from '../../common/realm';
//import AppIntro from 'react-native-app-intro';
//import Swiper from 'react-native-swiper';
import Swiper from '../../common/libs/react-native-swiper';
import CheckBox from '../../common/libs/react-native-check-box';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as loginActions from '../../common/reducers/app.actions';
import Toast, {DURATION} from 'react-native-easy-toast'
import Indicator from '../../common/libs/indicator';
var indicatorOBJ = null;
var email = null,password=null,ErrorMessageContainer=null;
var userdata = null;
var userprofiledata = null;
var lang = null;
var USER = null;
const styles = StyleSheet.create({
  wrapper: {
    backgroundColor:'transparent', flex:1, alignItems:'flex-end'
  },
  nextbuttonText:{
    fontSize:StyleMethods.getFontSize((StyleMethods.getHeight() * 0.02)), color:COLORS.WHITE, fontFamily:FONTS.MONTSERRATREGULAR, backgroundColor:COLORS.BLUETHEMECOLOR, width:StyleMethods.getWidth() * 0.5, textAlign:'center',
    height:(StyleMethods.getHeight() * 0.06), paddingTop:StyleMethods.getFontSize(12), borderLeftWidth:StyleMethods.getFontSize(1), borderLeftColor:COLORS.BUTTONBG
  },
  prebuttonText:{
    fontSize:StyleMethods.getFontSize((StyleMethods.getHeight() * 0.02)), color:COLORS.WHITE, fontFamily:FONTS.MONTSERRATREGULAR, backgroundColor:COLORS.BLUETHEMECOLOR, width:StyleMethods.getWidth() * 0.5, textAlign:'center',
    height:(StyleMethods.getHeight() * 0.06), paddingTop:StyleMethods.getFontSize(12), borderRightWidth:StyleMethods.getFontSize(1), borderRightColor:COLORS.BUTTONBG
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  }
})

class IntroScreen extends Component {
  constructor(props: Object) {
    super(props);
    //console.log(this.props.profiledata.preferences);
    userdata = Realm.ReadData('User');
    userprofiledata = Realm.ReadData('UserProfile');
    USER = JSON.parse(userprofiledata[0].profiledata);
    console.log(USER);
    console.disableYellowBox = true;
    let notificationsArray = [];
    let preferredTopicsArray = [];
    if(USER.preferences.language.data === 'EN'){
      for(var key in USER.preferences.notifications_en) {
          let obj = USER.preferences.notifications_en[key];
          if(obj.hasOwnProperty('data')){
            obj.key = key;
            notificationsArray.push(obj);
          }
      };
      for(var key in USER.preferences.preferred_topics_en) {
          let obj = USER.preferences.preferred_topics_en[key];
          if(obj.hasOwnProperty('data')){
            obj.key = key;
            preferredTopicsArray.push(obj);
          }
      };
    }else{
      for(var key in USER.preferences.notifications_mt) {
          let obj = USER.preferences.notifications_mt[key];
          if(obj.hasOwnProperty('data')){
            obj.key = key;
            notificationsArray.push(obj);
          }
      };
      for(var key in USER.preferences.preferred_topics_mt) {
          let obj = USER.preferences.preferred_topics_mt[key];
          if(obj.hasOwnProperty('data')){
            obj.key = key;
            preferredTopicsArray.push(obj);
          }
      };
    }

    console.log(notificationsArray);
    console.log(preferredTopicsArray);
    this.state ={
      status:false, email: '', password: '',
//      nextButton:(this.props.profiledata.preferences.language.data === 'EN')?'Next':'Quddieum',
//      previousButton:(this.props.profiledata.preferences.language.data === 'EN')?'Previous':'Lura',
//      doneButton:(this.props.profiledata.preferences.language.data === 'EN')?'Done':'Agħlaq',
      nextButton:USER.walkthrough.step.menu.next,
      previousButton:USER.walkthrough.step.menu.prev,
      doneButton:USER.walkthrough.step.menu.finish,
      language:(this.props.profiledata.preferences.language.data === 'EN')?true:false,
      notify_label:USER.on_boarding.label_step_2,
      language_label:USER.on_boarding.label_step_1,
      prefered_label:USER.on_boarding.label_step_3,
      malteseLabel:USER.preferences.language.label_maltese,
      englishLabel:USER.preferences.language.label_english,
      notifications:notificationsArray,
      preferred_topics:preferredTopicsArray,
      currentIndex:0,
      notificationcheck:[{data:false,lable:'Sports'},{data:true, lable:'Current Affairs'},{data:false, lable:'News'}]
    };

    this.inputs = {
      email: '',
      password: '',
      error:''
    };
  }

  DoneButton = () =>{
      //alert(JSON.stringify(userdata[0].wp));
      console.log(JSON.parse(userdata[0].firebase).localId);
      var notif_params = (this.state.language === true)?"notifications_en":"notifications_mt";
        var details = {
            'id':JSON.parse(userdata[0].firebase).localId,
            'token':JSON.parse(userdata[0].wp).token,
            'language':(this.state.language === true)?"EN":"MT",
            'on_boarding':true,
        };

        var notifStr = '';

        for(var i=0; i< this.state.notifications.length; i++){
          var obj = this.state.notifications[i];
          console.log(obj);
          if(obj.data == true){
            notifStr =  notifStr+((notifStr == '') ? '' : ',') + obj.key;
          }
        }
        var prefTopicStr = '';
        for(var i=0; i< this.state.preferred_topics.length; i++){
          var obj = this.state.preferred_topics[i];
          console.log('preferred_topics loop');
          console.log(obj);
          if(obj.data == true){
            prefTopicStr =  prefTopicStr+((prefTopicStr == '') ? '' : ',') + obj.key;
          }
        }
        if(this.state.language === true){
            details.preferred_topics_en = prefTopicStr;
        }else {
            details.preferred_topics_mt = prefTopicStr
        }
        if(this.state.language === true){
          details.notifications_en = notifStr
        }else{
          details.notifications_mt = notifStr
        }
        console.log(prefTopicStr.length);
        console.log(notifStr.length);
        console.log(details);
        indicatorOBJ.setModalVisible(true);
        //indicatorOBJ.setModalVisible(true);
        var formBody = [];
        for (var property in details) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        network.TimeMethod("POST", "editProfile", (flag, response)=>{
            //alert(JSON.stringify(response));
            indicatorOBJ.setModalVisible(false);
            console.log(flag);
            console.log(response);
            if(flag){
              if (response.hasOwnProperty('error')){
                this.refs.redtoast.show('Something went wrong, please try again!', 3000);
              }else{
                this.refs.greentoast.show('Updates Successful!', 3000)
                console.log(response);
                this.props.actions.UserProfile(response);
                Realm.DeleteData('UserProfile')
                Realm.WriteData('UserProfile',{
                  profiledata:  JSON.stringify(response)
                });
                if(USER.walkthrough.hasOwnProperty('data')){
                  if(USER.walkthrough.data === true){
                    this.props.navigator.push({
                      screen: 'TVM.Landing',
                      navigatorStyle:{navBarHidden:true}
                    });
                  }else{
                    this.props.navigator.push({
                      screen: 'TVM.WalkThrough',
                      navigatorStyle:{navBarHidden:true}
                    });
                  }
                }else{
                  this.props.navigator.push({
                    screen: 'TVM.Landing',
                    navigatorStyle:{navBarHidden:true}
                  });
                }

              }
            }else{
              this.refs.redtoast.show(response, 3000);
              //Alert.alert('Something went wrong, please try again!');
              //this.setState({errormessage:'Something went wrong, please try again!', error:true});
            }

        }, null, formBody);
  }

  updateNotificationsCheck = (item)=>{
    let notificationscheck = this.state.notifications;
    for(var i=0; i<notificationscheck.length; i++){
      if(item.label === notificationscheck[i].label){
          notificationscheck[i].data = !notificationscheck[i].data;
          this.setState({notifications : notificationscheck });
          console.log(this.state.notifications);
      }
    }
  }
  renderNotificationsCheckViews = ( item ) => {
    return (
      <View style={IntroStyle.notifyCheck}>
        <Text style={IntroStyle.introText}>{item.label}</Text>
        <CheckBox
         style={IntroStyle.notifyCheckbox}
         onClick={()=>this.updateNotificationsCheck(item)}
         isChecked={item.data}
         checkedImage={<Image source={IMAGES.TOGGLEON} style={IntroStyle.checkBoxIcon} />}
         unCheckedImage={<Image source={IMAGES.TOGGLEOFF} style={IntroStyle.checkBoxIcon} />}
         />
      </View>
    );
  };

  updateTopicsCheck = (item)=>{
    let topicsscheck = this.state.preferred_topics;
    for(var i=0; i<topicsscheck.length; i++){
      if(item.label === topicsscheck[i].label){
          topicsscheck[i].data = !topicsscheck[i].data;
          this.setState({preferred_topics : topicsscheck });
          console.log('PREFERRED TOPICS CHECK');
          console.log(this.state.preferred_topics);
      }
    }
  }
  renderTopicsCheckViews = ( item ) => {
    return (
      <View style={IntroStyle.notifyCheck}>
        <Text style={IntroStyle.introText}>{item.label}</Text>
        <CheckBox
         style={IntroStyle.notifyCheckbox}
         onClick={()=>this.updateTopicsCheck(item)}
         isChecked={item.data}
         checkedImage={<Image source={IMAGES.TOGGLEON} style={IntroStyle.checkBoxIcon} />}
         unCheckedImage={<Image source={IMAGES.TOGGLEOFF} style={IntroStyle.checkBoxIcon} />}
         />
      </View>
    );
  };

  updateCheckboxLanguage = (language) =>{
    console.log('update checkbox');
    let notificationsArray = [];
    let preferredTopicsArray = [];
    if(language === false){
      for(var key in USER.preferences.notifications_en) {
          let obj = USER.preferences.notifications_en[key];
          if(obj.hasOwnProperty('data')){
            obj.key = key;
            notificationsArray.push(obj);
          }
      };
      for(var key in USER.preferences.preferred_topics_en) {
          let obj = USER.preferences.preferred_topics_en[key];
          if(obj.hasOwnProperty('data')){
            obj.key = key;
            preferredTopicsArray.push(obj);
          }
      };
      this.setState({notifications:notificationsArray, preferred_topics: preferredTopicsArray, notify_label:'Notify me about:' ,prefered_label:'My favourite topics:' ,
      language_label:'Pick your language:', nextButton:'Next',previousButton:'Previous', doneButton:'Finish', malteseLabel:USER.labels.language.maltese,englishLabel:USER.labels.language.english });
    }else if(language === true){
      for(var key in USER.preferences.notifications_mt) {
          let obj = USER.preferences.notifications_mt[key];
          if(obj.hasOwnProperty('data')){
            obj.key = key;
            notificationsArray.push(obj);
          }
      };
      for(var key in USER.preferences.preferred_topics_mt) {
          let obj = USER.preferences.preferred_topics_mt[key];
          if(obj.hasOwnProperty('data')){
            obj.key = key;
            preferredTopicsArray.push(obj);
          }
      };
      this.setState({notifications:notificationsArray, preferred_topics: preferredTopicsArray, notify_label:'Ibagħtli notifiki dwar:' ,prefered_label:'Is-suġġetti favoriti tiegħi:' ,
      language_label:'Lingwa preferita:', nextButton:'Quddiem',previousButton:'Lura', doneButton:'Agħlaq', malteseLabel:USER.preferences.language.label_maltese,englishLabel:USER.preferences.language.label_english});
    }
  }
  changeLanguage = () =>{
    console.log('language state is: '+ this.state.language);
    this.updateCheckboxLanguage(this.state.language);
    this.setState({language:!this.state.language});
  }
  render() {
    return (
      <View style={{flex:1}}>
      <Swiper buttonWrapperStyle={styles.wrapper}
      nextButton={<Text style={styles.nextbuttonText}>{this.state.nextButton}</Text>}
      prevButton={<Text style={styles.prebuttonText}>{this.state.previousButton}</Text>}
      showsButtons={true} loop={false} dotColor={'transparent'}
      activeDotColor={'transparent'} onIndexChanged={(index)=>{this.setState({currentIndex:index})}}>
       <View style={IntroStyle.introContainer}>
         <View style={lg.onBoardinglogoContainer}>
           <Image style={lg.logo} source={IMAGES.LOGINLOGO} />
         </View>
         <Text style={IntroStyle.introTitle}>{this.state.language_label}</Text>
         <ScrollView contentContainerStyle={IntroStyle.introScrollView} showsVerticalScrollIndicator={false}>
            <View style={IntroStyle.languageCheck}>
              <Text style={IntroStyle.introText}>{this.state.malteseLabel}</Text>
              <CheckBox
               style={IntroStyle.checkboxStyle}
               onClick={()=>this.changeLanguage()}
               isChecked={this.state.language}
               //rightText={'leftText'}
               checkedImage={<Image source={IMAGES.TOGGLEON} style={IntroStyle.checkBoxIcon} />}
               unCheckedImage={<Image source={IMAGES.TOGGLEOFF} style={IntroStyle.checkBoxIcon} />}
               />
              <Text style={IntroStyle.introText}>{this.state.englishLabel}</Text>
            </View>

         </ScrollView>
       </View>
       <View style={IntroStyle.introContainer}>
         <View style={lg.onBoardinglogoContainer}>
           <Image style={lg.logo} source={IMAGES.LOGINLOGO} />
         </View>
         <Text style={IntroStyle.introTitle}>{this.state.notify_label}</Text>
         <ScrollView contentContainerStyle={IntroStyle.introScrollView} showsVerticalScrollIndicator={false}>
            {this.state.notifications.map(this.renderNotificationsCheckViews)}
         </ScrollView>
       </View>
       <View style={IntroStyle.introContainer}>
         <Indicator ref={(ref) => this.indicatorOBJ = indicatorOBJ = ref}/>
         <Toast style={cs.greentoast} ref="greentoast" position={'bottom'}/>
         <Toast style={cs.redtoast} ref="redtoast" position={'bottom'}/>
         <View style={lg.onBoardinglogoContainer}>
           <Image style={lg.logo} source={IMAGES.LOGINLOGO} />
         </View>
         <Text style={IntroStyle.introTitle}>{this.state.prefered_label}</Text>
         <ScrollView contentContainerStyle={IntroStyle.introScrollView} showsVerticalScrollIndicator={false}>
            {this.state.preferred_topics.map(this.renderTopicsCheckViews)}
         </ScrollView>
       </View>
     </Swiper>
     {(this.state.currentIndex === 0)?
       <TouchableOpacity style={[cs.previousbuttonStyle,{backgroundColor:COLORS.BLUETHEMECOLOR, opacity:0.5}]}>
         <Text style={cs.buttonTextStyle}>{this.state.previousButton}</Text>
       </TouchableOpacity>
       :null
     }
     {(this.state.currentIndex === 2)?
       <TouchableOpacity onPress={this.DoneButton.bind(this)} style={[cs.donebuttonStyle,{backgroundColor:COLORS.BLUETHEMECOLOR}]}>
         <Text style={cs.buttonTextStyle}>{this.state.doneButton}</Text>
       </TouchableOpacity>
       :null
     }
     </View>
    );
  }
}

IntroScreen.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(IntroScreen);
