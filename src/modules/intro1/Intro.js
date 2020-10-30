'use strict';
import React, { Component } from "react";
import {
  Navigator,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  View,
  ScrollView,
  ImageBackground,
  Alert
} from "react-native";
import PropTypes from 'prop-types';

import IMAGES from '../../common/images';
import COLORS from '../../common/colors';
import { commonStyle as cs, loginPageStyle as lg } from '../../common/style';
import StyleMethods from '../../common/Style_Methods';
import renderIf from '../../common/renderIf';
import TextField from '../../common/libs/FloatingLabel/TextField';
import { strings } from '../../common/locales/i18n';
import network from '../../common/network';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Realm from '../../common/realm';
import AppIntro from 'react-native-app-walkthrough';

var email = null,password=null,ErrorMessageContainer=null;
class Intro extends Component {
  constructor(props: Object) {
    super(props);

  }

  onSkipBtnHandle = (index) => {
     Alert.alert('Skip');
     console.log(index);
   }
   doneBtnHandle = () => {
     Alert.alert('Done');
   }
   nextBtnHandle = (index) => {
     Alert.alert('Next');
     console.log(index);
   }
   onSlideChangeHandle = (index, total) => {
     console.log(index, total);
   }

  _handleLoginPress = () =>{
    Realm.DeleteData('User');
    this.props.navigator.resetTo({
      screen: 'TVM.LoginScreen',
      navigatorStyle:{navBarHidden:true}
    });
  }

  render() {

    const pageArray = [{
      title: 'Page 1',
      description: 'Description 1',
      //img: 'https://goo.gl/Bnc3XP',
      img:IMAGES.LOGINLOGO,
      //<Image style={lg.logo} source={IMAGES.LOGINLOGO} />
      imgStyle: {
        height: 80 * 2.5,
        width: 109 * 2.5,
      },
      backgroundColor: '#fa931d',
      fontColor: '#fff',
      level: 10,
    }, {
      title: 'Page 2',
      description: 'Description 2',
      img: source(IMAGES.LOGINLOGO),
      imgStyle: {
        height: 93 * 2.5,
        width: 103 * 2.5,
      },
      backgroundColor: '#a4b602',
      fontColor: '#fff',
      level: 10,
    }];
    return (
      <AppIntro
        onNextBtnClick={this.nextBtnHandle}
        onDoneBtnClick={this.doneBtnHandle}
        onSkipBtnClick={this.onSkipBtnHandle}
        onSlideChange={this.onSlideChangeHandle}
        pageArray={pageArray}
      />
    );
  }
}


module.exports = (Intro);
