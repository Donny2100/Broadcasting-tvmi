'use strict';
import React, { Component } from "react";
import {
  Navigator,
  TouchableOpacity,
  Image,
  Text,
  View,
  ImageBackground,
} from "react-native";
import PropTypes from 'prop-types';
import IMAGES from '../../common/images';
import { commonStyle as cs,  loginPageStyle as lg, ForgotPasswordStyle as fps } from '../../common/style';
import StyleMethods from '../../common/Style_Methods';
import TextField from '../../common/libs/FloatingLabel/TextField';
import network from '../../common/network';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Indicator from '../../common/libs/indicator';
var indicatorOBJ = null;
var email = null,ErrorMessageContainer=null;
import Toast, {DURATION} from 'react-native-easy-toast'
class ForgotPassword extends Component {
  constructor(props: Object) {
    super(props);
    this.state = {
      email: '',
      error: false,
			errormessage:'',
    };
  }

  _handleLoginPress = () =>{
    this.props.navigator.resetTo({
      screen: 'TVM.LoginScreen',
      navigatorStyle:{navBarHidden:true}
    });
  }
  _onForgotPassword = () =>{
    this.setState({errormessage:'', error:false});
    if(this.state.email === '' || this.state.email === null){
      email.MarkField();
      return;
    }
    if(!StyleMethods.validateEmail(this.state.email)){
      this.setState({errormessage:'Enter a valid email', error:true});
      email.MarkField();
      return;
    }
    if(indicatorOBJ !== null){
        indicatorOBJ.setModalVisible(true);
    }
    var details = {
        'email': this.state.email
    };
    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    network.TimeMethod("POST", "recoverPassword", (flag, response)=>{
      if(indicatorOBJ !== null){
          indicatorOBJ.setModalVisible(false);
      }
      if(flag){
        if (response.hasOwnProperty('error')){
          this.setState({errormessage:'Invalid email address!', error:true});
        }else{
          this.refs.greentoast.show('Email Sent Successful', 3000)
          this.props.navigator.resetTo({
            screen: 'TVM.LoginScreen',
            navigatorStyle:{navBarHidden:true}
          });
        }
      }else{
        this.setState({errormessage:response, error:true});
      }
    }, null, formBody);

  }

  render() {
    return (
      <ImageBackground source={IMAGES.LOGINBG} style={lg.loginContainer}>
      <KeyboardAwareScrollView contentContainerStyle={{backgroundColor:"transparent", flex:1}} enableOnAndroid={true}>

        <View style={lg.logoContainer}>
          <Image style={lg.logo} source={IMAGES.LOGINLOGO} />
        </View>
        <View style={{width:'100%', paddingBottom:20}}>
          <TextField label={'Email Address*'} secureTextEntry={false} highlightColor={'white'}
            onChangeText={(text) => { this.state.email = text;}}
            ref={(ref) => this.emailInput = email = ref}
            onSubmitEditing={() => {this._onForgotPassword()}}
            returnKeyType={'next'}
            placeholder={'Email'}
            value={this.state.email}
            fieldColor={'white'}
            dense={true}
            autoCorrect={false}
            autoCapitalize={'none'}
            keyboardType={'email-address'}
            inputStyle={cs.contact_textInput}
          />


          <View ref={(ref) => this.ErrorMessageContainer =  ErrorMessageContainer = ref}>
            {this.state.error?
              <Text allowFontScaling={false} style={cs.errorTextStyle}>
                {this.state.errormessage}
              </Text>:null
            }
          </View>
        </View>

        <TouchableOpacity onPress={this._onForgotPassword.bind(this)} style={cs.buttonStyle}>
          <Text style={cs.buttonTextStyle}>RESET MY PASSWORD</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={this._handleLoginPress.bind(this)} style={fps.BackToLogin}>
          <Text style={fps.BackToLoginText}>BACK TO LOGIN</Text>
        </TouchableOpacity>
        <Toast style={cs.greentoast} ref="greentoast" position={'bottom'}/>
      </KeyboardAwareScrollView>
      <Indicator ref={(ref) => this.indicatorOBJ = indicatorOBJ = ref}/>
      </ImageBackground>
    );
  }
}


module.exports = (ForgotPassword);
