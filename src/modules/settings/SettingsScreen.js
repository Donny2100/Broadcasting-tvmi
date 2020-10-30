'use strict';
import React, { Component } from "react";
import {
  ScrollView,
  ImageBackground,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  BackHandler,
  AppState,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import PropTypes from 'prop-types';
import IMAGES from '../../common/images';
import COLORS from '../../common/colors';
import { commonStyle as cs, bulletins as bi, newsFeed as nf, IntroStyle, ModalStyle as ms } from '../../common/style';
import StyleMethods from '../../common/Style_Methods';
import Realm from '../../common/realm';
import CheckBox from '../../common/libs/react-native-check-box';
import firebase from 'react-native-firebase';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as loginActions from '../../common/reducers/app.actions';
import MenuModal from '../menu/MenuModal';
import Modal from "react-native-modal";

import PrivacySettingsModal from '../privacymodal/PrivacySettingsModal'
import Toast from 'react-native-easy-toast'
import network from '../../common/network';
import SharedData from "../../common/SharedData";


var userprofiledata = null;
var userdata = null;
var USER = null;

class SettingsScreen extends Component {

  preferences = null;
  changed = false;

  constructor(props) {
    super(props);
    
    userdata = Realm.ReadData('User');
    userprofiledata = Realm.ReadData('UserProfile');
    
    USER = JSON.parse(userprofiledata[0].profiledata);
    this.preferences = USER.preferences

    this.updatePrivacyPolicy = this.updatePrivacyPolicy.bind(this);
    this._handleAppStateChange = this._handleAppStateChange.bind(this);

    this.state = {
      language: (this.preferences.language.data === 'EN') ? true : false,
      languageLabel: (this.preferences.language.data === 'EN') ? USER.labels.language.en : USER.labels.language.mt,
      malteseLabel: this.preferences.language.label_maltese,
      englishLabel: this.preferences.language.label_english,
      languageFont: this.preferences.fontSize ? this.preferences.fontSize : USER.big_font_size,
      font_sizeLabel: (this.preferences.language.data === 'EN') ? USER.labels.font_size.en : USER.labels.font_size.mt,
      normal_fontLabel: (this.preferences.language.data === 'EN') ? USER.labels.font_size.normal.en : USER.labels.font_size.normal.mt,
      large_fontLabel: (this.preferences.language.data === 'EN') ? USER.labels.font_size.large.en : USER.labels.font_size.large.mt,
      setting_label: (this.preferences.language.data === 'EN') ? 'Preferences' : 'Preferenzi',
      notification_Label: (this.preferences.language.data === 'EN') ? USER.labels.notifications.en : USER.labels.notifications.mt,
      prefferedTopic_Label: (this.preferences.language.data === 'EN') ? USER.labels.preferred.en : USER.labels.preferred.mt,
      subscription_Label: (this.preferences.language.data === 'EN') ? USER.labels.subscription.en : USER.labels.subscription.mt,

      update_Button: (this.preferences.language.data === 'EN') ? USER.buttons.update.en : USER.buttons.update.mt,
      logout_Button: (this.preferences.language.data === 'EN') ? USER.buttons.logout.en : USER.buttons.logout.mt,
      privacy_policy: (this.preferences.language.data === 'EN') ? USER.buttons.privacy_policy.en : USER.buttons.privacy_policy.mt,

      newsLetterSubsription: this.preferences.newsletter.data,
      newsLetterlabel: this.preferences.newsletter.label,
      promotionalPBS: this.preferences.promotional_pbs.data,
      promotionalMaterial: this.preferences.promotional_pbs.label,
      notifications: [],
      preferred_topics: [],
      isModalVisible: false,
      isPrivacyModalVisible: false,
      IndicatorModalFlag: false,
      appState: ''
    };
  }

  configPreferences() {

    let notificationsArray = [];
    let preferredTopicsArray = [];
    if (this.preferences.language.data === 'EN') {
      for (var key in this.preferences.notifications_en) {
        let obj = this.preferences.notifications_en[key];
        if (obj.hasOwnProperty('data')) {
          obj.key = key;
          notificationsArray.push(obj);
        }
      };
      for (var key in this.preferences.preferred_topics_en) {
        let obj = this.preferences.preferred_topics_en[key];
        if (obj.hasOwnProperty('data')) {
          obj.key = key;
          preferredTopicsArray.push(obj);
        }
      };
    } else {
      for (var key in this.preferences.notifications_mt) {
        let obj = this.preferences.notifications_mt[key];
        if (obj.hasOwnProperty('data')) {
          obj.key = key;
          notificationsArray.push(obj);
        }
      };
      for (var key in this.preferences.preferred_topics_mt) {
        let obj = this.preferences.preferred_topics_mt[key];
        if (obj.hasOwnProperty('data')) {
          obj.key = key;
          preferredTopicsArray.push(obj);
        }
      };
    }

    let state = {
      language: (this.preferences.language.data === 'EN') ? true : false,
      languageLabel: (this.preferences.language.data === 'EN') ? USER.labels.language.en : USER.labels.language.mt,
      malteseLabel: this.preferences.language.label_maltese,
      englishLabel: this.preferences.language.label_english,
      languageFont: this.preferences.fontSize ? this.preferences.fontSize : USER.big_font_size,
      font_sizeLabel: (this.preferences.language.data === 'EN') ? USER.labels.font_size.en : USER.labels.font_size.mt,
      normal_fontLabel: (this.preferences.language.data === 'EN') ? USER.labels.font_size.normal.en : USER.labels.font_size.normal.mt,
      large_fontLabel: (this.preferences.language.data === 'EN') ? USER.labels.font_size.large.en : USER.labels.font_size.large.mt,
      setting_label: (this.preferences.language.data === 'EN') ? 'Preferences' : 'Preferenzi',
      notification_Label: (this.preferences.language.data === 'EN') ? USER.labels.notifications.en : USER.labels.notifications.mt,
      prefferedTopic_Label: (this.preferences.language.data === 'EN') ? USER.labels.preferred.en : USER.labels.preferred.mt,
      subscription_Label: (this.preferences.language.data === 'EN') ? USER.labels.subscription.en : USER.labels.subscription.mt,

      update_Button: (this.preferences.language.data === 'EN') ? USER.buttons.update.en : USER.buttons.update.mt,
      logout_Button: (this.preferences.language.data === 'EN') ? USER.buttons.logout.en : USER.buttons.logout.mt,
      privacy_policy: (this.preferences.language.data === 'EN') ? USER.buttons.privacy_policy.en : USER.buttons.privacy_policy.mt,

      newsLetterSubsription: this.preferences.newsletter.data,
      newsLetterlabel: this.preferences.newsletter.label,
      promotionalPBS: this.preferences.promotional_pbs.data,
      promotionalMaterial: this.preferences.promotional_pbs.label,
      notifications: notificationsArray,
      preferred_topics: preferredTopicsArray,
      isModalVisible: false,
      isPrivacyModalVisible: false,
      IndicatorModalFlag: false,
      appState: ''
    };

    this.setState(state)
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log("appState", this.state.appState);
      if (this.props.appdata.currentTrack !== 0 && this.props.appdata.currentTrack !== undefined) {
        var temp = '';
        this.props.navigator.resetTo({
          passProps: { temp },
          screen: 'TVM.LiveTv',
          navigatorStyle: StyleMethods.newNavigationStyle(),
          animated: false
        });
      }
    }

    this.setState({ appState: nextAppState });
  }

  componentDidCatch(error, info) {
    if (Platform.OS === 'android') {
      firebase.crashlytics().log(error);
    } else {
      firebase.crashlytics().recordError(error, info);
    }
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.onBackHandler);
    }
    AppState.addEventListener('change', this._handleAppStateChange);

    this.logout = false

    console.log("Get Preferences")
    AsyncStorage.getItem("preferences")
    .then(result => {
      let preferences = JSON.parse(result)
      console.log("Preferences", preferences)
      if(result) {
        this.preferences = preferences
        this.configPreferences()
      } else {
        console.log("Set Preferences")
        AsyncStorage.setItem("preferences", JSON.stringify(this.preferences))
      }
    })
    .catch(error => console.log("Preferences get error : ", error))
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.onBackHandler);
    }
    AppState.removeEventListener('change', this._handleAppStateChange);

    if(!this.logout) {
      this.saveToServer()
    }
  }

  onBackHandler = () => {
    if(!this.logout) {
      this.saveToServer()
    }
    
    this.close();
    return true;
  }

  close() {
    this.props.navigator.resetTo({
      screen: 'TVM.Landing',
      navigatorStyle: StyleMethods.newNavigationStyle(),
      animationType: 'fade',
      animated: true,
    });
  }

  _showMenu = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible })
  }

  _showPrivacyModal = () => {
    this.setState({ isPrivacyModalVisible: !this.state.isPrivacyModalVisible })
  }

  updatePrivacyPolicy = (privacy_policyvalue) => {
    this.setState({ isPrivacyModalVisible: !this.state.isPrivacyModalVisible })
  }

  updateScreen = (ScreenValue) => {
    if (this.state.isModalVisible) {
      this.setState({ isModalVisible: !this.state.isModalVisible });
      if (ScreenValue !== '') {
        this.props.navigator.resetTo({
          screen: ScreenValue,
          navigatorStyle: { navBarHidden: true },
          animated: true,
        });
      }
    } else {
      return;
    }
  }

  updateNotificationsCheck = (item) => {
    let notificationscheck = this.state.notifications;
    for (var i = 0; i < notificationscheck.length; i++) {
      if (item.label === notificationscheck[i].label) {
        notificationscheck[i].data = !notificationscheck[i].data;
        this.setState({ notifications: notificationscheck }, () => this.savePreferences());
        console.log(this.state.notifications);
      }
    }
  }
  
  renderNotificationsCheckViews = (item, index) => {
    return (
      <View key={index} style={IntroStyle.notifyCheck}>
        <Text style={IntroStyle.introText}>{item.label}</Text>
        <CheckBox
          style={IntroStyle.notifyCheckbox}
          onClick={() => this.updateNotificationsCheck(item)}
          isChecked={item.data}
          checkedImage={<Image source={IMAGES.TOGGLEON} style={IntroStyle.checkBoxIcon} />}
          unCheckedImage={<Image source={IMAGES.TOGGLEOFF} style={IntroStyle.checkBoxIcon} />}
        />
      </View>
    );
  };

  updateTopicsCheck = (item) => {
    let topicsscheck = this.state.preferred_topics;
    for (var i = 0; i < topicsscheck.length; i++) {
      if (item.label === topicsscheck[i].label) {
        topicsscheck[i].data = !topicsscheck[i].data;
        this.setState({ preferred_topics: topicsscheck }, () => this.savePreferences());
        console.log('PREFERRED TOPICS CHECK');
        console.log(this.state.preferred_topics);
      }
    }
  }
  renderTopicsCheckViews = (item, index) => {
    return (
      <View key={index} style={IntroStyle.notifyCheck}>
        <Text style={IntroStyle.introText}>{item.label}</Text>
        <CheckBox
          style={IntroStyle.notifyCheckbox}
          onClick={() => this.updateTopicsCheck(item)}
          isChecked={item.data}
          checkedImage={<Image source={IMAGES.TOGGLEON} style={IntroStyle.checkBoxIcon} />}
          unCheckedImage={<Image source={IMAGES.TOGGLEOFF} style={IntroStyle.checkBoxIcon} />}
        />
      </View>
    );
  };

  updateCheckboxLanguage = (language) => {
    let notificationsArray = [];
    let preferredTopicsArray = [];

    if (language === false) {
      for (var key in this.preferences.notifications_en) {
        let obj = this.preferences.notifications_en[key];
        if (obj.hasOwnProperty('data')) {
          obj.key = key;
          notificationsArray.push(obj);
        }
      }

      for (var key in this.preferences.preferred_topics_en) {
        let obj = this.preferences.preferred_topics_en[key];
        if (obj.hasOwnProperty('data')) {
          obj.key = key;
          preferredTopicsArray.push(obj);
        }
      }

      this.setState({ notifications: notificationsArray, preferred_topics: preferredTopicsArray });

    } else if (language === true) {

      for (var key in this.preferences.notifications_mt) {
        let obj = this.preferences.notifications_mt[key];
        if (obj.hasOwnProperty('data')) {
          obj.key = key;
          notificationsArray.push(obj);
        }
      }
      
      for (var key in this.preferences.preferred_topics_mt) {
        let obj = this.preferences.preferred_topics_mt[key];
        if (obj.hasOwnProperty('data')) {
          obj.key = key;
          preferredTopicsArray.push(obj);
        }
      }
      this.setState({ notifications: notificationsArray, preferred_topics: preferredTopicsArray });
    }
  }

  changeLanguage = () => {
    console.log('language state is: ' + this.state.language);
    this.updateCheckboxLanguage(this.state.language);

    let langState = !this.state.language

    let notificationsArray = [];
    let preferredTopicsArray = [];
    if (this.preferences.language.data === 'EN') {
      for (var key in this.preferences.notifications_en) {
        let obj = this.preferences.notifications_en[key];
        if (obj.hasOwnProperty('data')) {
          obj.key = key;
          notificationsArray.push(obj);
        }
      };
      for (var key in this.preferences.preferred_topics_en) {
        let obj = this.preferences.preferred_topics_en[key];
        if (obj.hasOwnProperty('data')) {
          obj.key = key;
          preferredTopicsArray.push(obj);
        }
      };
    } else {
      for (var key in this.preferences.notifications_mt) {
        let obj = this.preferences.notifications_mt[key];
        if (obj.hasOwnProperty('data')) {
          obj.key = key;
          notificationsArray.push(obj);
        }
      };
      for (var key in this.preferences.preferred_topics_mt) {
        let obj = this.preferences.preferred_topics_mt[key];
        if (obj.hasOwnProperty('data')) {
          obj.key = key;
          preferredTopicsArray.push(obj);
        }
      };
    }

    let state = {
      language: langState,
      languageLabel: langState ? USER.labels.language.en : USER.labels.language.mt,
      font_sizeLabel: langState ? USER.labels.font_size.en : USER.labels.font_size.mt,
      normal_fontLabel: langState ? USER.labels.font_size.normal.en : USER.labels.font_size.normal.mt,
      large_fontLabel: langState ? USER.labels.font_size.large.en : USER.labels.font_size.large.mt,
      notification_Label: langState ? USER.labels.notifications.en : USER.labels.notifications.mt,
      prefferedTopic_Label: langState ? USER.labels.preferred.en : USER.labels.preferred.mt,
      subscription_Label: langState ? USER.labels.subscription.en : USER.labels.subscription.mt,
      setting_label: langState ? 'Preferences' : 'Preferenzi',

      update_Button: langState ? USER.buttons.update.en : USER.buttons.update.mt,
      logout_Button: langState ? USER.buttons.logout.en : USER.buttons.logout.mt,
      privacy_policy: langState ? USER.buttons.privacy_policy.en : USER.buttons.privacy_policy.mt,

      notifications: notificationsArray,
      preferred_topics: preferredTopicsArray,

      newsLetterlabel: langState ? USER.labels.newsletter.en : USER.labels.newsletter.mt,
    }

    this.setState(state, () => this.savePreferences());
  }

  savePreferences() {
    this.changed = true;

    this.preferences.language['data'] = this.state.language ? 'EN' : 'MT'
    this.preferences.promotional_pbs['data'] = this.state.promotionalPBS
    this.preferences.newsletter['data'] = this.state.newsLetterSubsription
    this.preferences.newsletter['label'] = this.state.newsLetterlabel
    this.preferences['fontSize'] = this.state.languageFont

    let notificationsDict = {}
    this.state.notifications.map(item => {
      notificationsDict[item.key] = item
    })

    let preferredDict = {}
    this.state.preferred_topics.map(item => {
      preferredDict[item.key] = item
    })

    if(this.state.language === 'EN') {
      this.preferences['notifications_en'] = notificationsDict
      this.preferences['preferred_topics_en'] = preferredDict
    } else {
      this.preferences['notifications_mt'] = notificationsDict
      this.preferences['preferred_topics_mt'] = preferredDict
    }

    console.log("Set Preferences", JSON.stringify(this.preferences))
    AsyncStorage.setItem("preferences", JSON.stringify(this.preferences))
    .then(result => {
      console.log("Set Preferences success", result)
    })
    .catch(error => {
      console.log("Set Preferences failed", error)
    })
  }

  DoneButton = () => {
    this.props.navigator.resetTo({
      screen: 'TVM.Landing',
      navigatorStyle: { navBarHidden: true }
    });
  }

  saveToServer() {

    if(!this.changed) return;

    this.changed = false;
    console.log("Settings Save to Server..")

    SharedData.setObject("SAVE_PERF", 1);

    var details = {
      'id': JSON.parse(userdata[0].firebase).localId,
      'token': JSON.parse(userdata[0].wp).token,
      'language': (this.state.language === true) ? "EN" : "MT",
      'big_font_size': this.state.languageFont,
      'newsletter': this.state.newsLetterSubsription,
      'promotional_pbs': this.state.promotionalPBS
    };

    var notifStr = '';

    for (var i = 0; i < this.state.notifications.length; i++) {
      var obj = this.state.notifications[i];
      if (obj.data == true) {
        notifStr = notifStr + ((notifStr == '') ? '' : ',') + obj.key;
      }
    }
    var prefTopicStr = '';
    for (var i = 0; i < this.state.preferred_topics.length; i++) {
      var obj = this.state.preferred_topics[i];
      if (obj.data == true) {
        prefTopicStr = prefTopicStr + ((prefTopicStr == '') ? '' : ',') + obj.key;
      }
    }
    if (this.state.language === true) {
      details.preferred_topics_en = prefTopicStr;
    } else {
      details.preferred_topics_mt = prefTopicStr
    }
    if (this.state.language === true) {
      details.notifications_en = notifStr
    } else {
      details.notifications_mt = notifStr
    }

    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    network.TimeMethod("POST", "editProfile", (flag, response) => {
      this.setState({ IndicatorModalFlag: false });

      if (flag) {
        if (response.hasOwnProperty('error')) {
          if (response.error.statusCode == 403 || response.error.statusCode == 401) {
            Realm.DeleteData('UserProfile');
            Realm.DeleteData('User');
            return;
          }
        } else {
          if(!this.logout) {
            this.props.actions.UserProfile(response);
            Realm.DeleteData('UserProfile')
            Realm.WriteData('UserProfile', {
              profiledata: JSON.stringify(response)
            });

            // Send emit..
            console.log("Settings Saved to Server - Emit To Landing")
            SharedData.emitEvent('SAVE_PREF');
          }
        }
      }
    }, null, formBody);
  }

  Logout = () => {
    this.saveToServer()

    Realm.DeleteData('UserProfile')
    Realm.DeleteData('User')
    this.logout = true
    
    this.props.navigator.resetTo({
      screen: 'TVM.LoginScreen',
      navigatorStyle: { navBarHidden: true }
    });
  }

  render() {
    return (
      <View style={[cs.container, { position: 'relative' }]}>
        {this.state.IndicatorModalFlag ?
          <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center', left: 0, right: 0, top: 0, bottom: 0, zIndex: 100, backgroundColor: 'rgba(255,255,255,.5)' }}>
            <ActivityIndicator size="large" color={COLORS.BUTTONBG} />
          </View> : null
        }
        <Toast style={cs.greentoast} ref="greentoast" position={'bottom'} />
        <Toast style={cs.redtoast} ref="redtoast" position={'bottom'} />
        {this.state.isModalVisible ?
          <View style={ms.modalTransparentBG}></View>
          : null}
        <Modal backdropOpacity={0} animationOut="slideOutUp" animationIn="slideInDown" animationInTiming={1000} animationOutTiming={1000} backdropTransitionInTiming={3000} backdropTransitionOutTiming={3000} style={ms.menuModal} isVisible={this.state.isModalVisible}>
          <MenuModal onSelect={this.updateScreen.bind(this)} ref={(ref) => this.privacyModalOBJ = ref} />
        </Modal>
        <Modal style={ms.modalContainer} isVisible={this.state.isPrivacyModalVisible}>
          <PrivacySettingsModal onSelect={this.updatePrivacyPolicy.bind(this)} />
        </Modal>
        <View style={IntroStyle.topView}>
          <ImageBackground style={nf.topViewLeft} source={require('../../common/assets/img/bg-storyfeed.png')}>
            {(!this.state.isModalVisible) ?
              <TouchableOpacity style={nf.menuButton} onPress={this._showMenu.bind(this)}>
                <Image style={nf.menuImage} source={require('../../common/assets/img/menu-icon.png')} />
              </TouchableOpacity> : null}
          </ImageBackground>
          <View style={nf.topViewRight}>
            <View style={bi.toptextView}>
              <Text style={bi.toptext}>{this.state.setting_label}</Text>
            </View>
          </View>
        </View>

        <View style={IntroStyle.settingsLogoContainer}>
          <View style={IntroStyle.settingsLogoContainerinner}>
          </View>
          <View style={IntroStyle.settingsLogoMain}>
            <View style={IntroStyle.settingsLogo}>
              <Text style={IntroStyle.logoText}>{USER.initials}</Text>
            </View>
          </View>
        </View>

        <View style={[IntroStyle.introContainer, IntroStyle.bottomView, { paddingHorizontal: 0, backgroundColor: COLORS.INTROBG }]}>
          <ScrollView contentContainerStyle={[IntroStyle.introScrollView, { paddingHorizontal: StyleMethods.getFontSize(40) }]}>
            <TouchableOpacity onPress={this._showPrivacyModal.bind(this)} style={IntroStyle.privacyButton}>
              <Text style={IntroStyle.privacyButtonText}>{this.state.privacy_policy}</Text>
            </TouchableOpacity>
            <Text style={IntroStyle.settingsTitle}>{this.state.languageLabel}</Text>
            <View style={[IntroStyle.languageCheck, { alignItems: 'flex-start', justifyContent: 'flex-start' }]}>
              <Text style={IntroStyle.introText}>{this.state.malteseLabel}</Text>
              <CheckBox
                style={IntroStyle.checkboxStyle}
                onClick={() => this.changeLanguage()}
                isChecked={this.state.language}
                checkedImage={<Image source={IMAGES.TOGGLEON} style={IntroStyle.checkBoxIcon} />}
                unCheckedImage={<Image source={IMAGES.TOGGLEOFF} style={IntroStyle.checkBoxIcon} />}
              />
              <Text style={IntroStyle.introText}>{this.state.englishLabel}</Text>
            </View>
            <Text style={IntroStyle.settingsTitle}>{this.state.font_sizeLabel}</Text>
            <View style={[IntroStyle.languageCheck, { alignItems: 'flex-start', justifyContent: 'flex-start' }]}>
              <Text style={IntroStyle.introText}>{this.state.normal_fontLabel}</Text>
              <CheckBox
                style={IntroStyle.checkboxStyle}
                onClick={() => this.setState({ languageFont: !this.state.languageFont }, () => this.savePreferences())}
                isChecked={this.state.languageFont}
                checkedImage={<Image source={IMAGES.TOGGLEON} style={IntroStyle.checkBoxIcon} />}
                unCheckedImage={<Image source={IMAGES.TOGGLEOFF} style={IntroStyle.checkBoxIcon} />}
              />
              <Text style={IntroStyle.introText}>{this.state.large_fontLabel}</Text>
            </View>
            <View style={IntroStyle.notificationsChecksContainer}>
              <Text style={IntroStyle.settingsTitle}>{this.state.notification_Label}</Text>
              {this.state.notifications.map(this.renderNotificationsCheckViews)}
            </View>
            <View style={IntroStyle.notificationsChecksContainer}>
              <Text style={IntroStyle.settingsTitle}>{this.state.prefferedTopic_Label}</Text>
              {this.state.preferred_topics.map(this.renderTopicsCheckViews)}
            </View>
            <View style={IntroStyle.notificationsChecksContainer}>
              <Text style={IntroStyle.settingsTitle}>{this.state.subscription_Label}</Text>
              <View style={IntroStyle.notifyCheck}>
                <Text style={IntroStyle.introText}>{this.state.newsLetterlabel}</Text>
                <CheckBox
                  style={IntroStyle.notifyCheckbox}
                  onClick={() => this.setState({ newsLetterSubsription: !this.state.newsLetterSubsription }, () => this.savePreferences())}
                  isChecked={this.state.newsLetterSubsription}
                  checkedImage={<Image source={IMAGES.TOGGLEON} style={IntroStyle.checkBoxIcon} />}
                  unCheckedImage={<Image source={IMAGES.TOGGLEOFF} style={IntroStyle.checkBoxIcon} />}
                />
              </View>
              <View style={IntroStyle.notifyCheck}>
                <Text style={IntroStyle.introText}>{this.state.promotionalMaterial}</Text>
                <CheckBox
                  style={IntroStyle.notifyCheckbox}
                  onClick={() => this.setState({ promotionalPBS: !this.state.promotionalPBS }, () => this.savePreferences())}
                  isChecked={this.state.promotionalPBS}
                  checkedImage={<Image source={IMAGES.TOGGLEON} style={IntroStyle.checkBoxIcon} />}
                  unCheckedImage={<Image source={IMAGES.TOGGLEOFF} style={IntroStyle.checkBoxIcon} />}
                />
              </View>
              
              <TouchableOpacity onPress={this.Logout.bind(this)} style={[IntroStyle.privacyButton, { width: '100%', marginTop: StyleMethods.getFontSize(20) }]}>
                <Text style={IntroStyle.privacyButtonText}>{this.state.logout_Button}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

        </View>
      </View>
    );
  }
}

SettingsScreen.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
