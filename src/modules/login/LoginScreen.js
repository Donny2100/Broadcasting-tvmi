'use strict';
import React, { Component } from "react";
import {
  Navigator,
  Image,
  ImageBackground,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator
} from "react-native";
import PropTypes from 'prop-types';
import IMAGES from '../../common/images';
import COLORS from '../../common/colors';
import { commonStyle as cs, loginPageStyle as lg, ModalStyle as ms  } from '../../common/style';
import TextField from '../../common/libs/FloatingLabel/TextField';
import network from '../../common/network';
import firebase, { Notification } from 'react-native-firebase';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Realm from '../../common/realm';
import PrivacyModal from '../privacymodal/PrivacyModal';
import StyleMethods from '../../common/Style_Methods';
import DeviceInfo from 'react-native-device-info';
import Modal from "react-native-modal";
import Toast, {DURATION} from 'react-native-easy-toast'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as loginActions from '../../common/reducers/app.actions';
import {Analytics, Hits as GAHits, Experiment as GAExperiment} from 'react-native-google-analytics';
var privacyModalOBJ = null;
var email = null, password=null, ErrorMessageContainer=null;
import SharedData from "../../common/SharedData";

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',//zainulabidin995@gmail.com
      password: '',//Secret@123
      error: false,
			errormessage:'',
      isModalVisible:false,
      privacy_policy:false,
      userwpprofile:null,
      userfbprofile:null,
      userprofile:null,
      device_token:'',
      IndicatorModalFlag:false,
      experiments: {},
    };
    this.updatePrivacyPolicy = this.updatePrivacyPolicy.bind(this);
    this._onLoginButton = this._onLoginButton.bind(this);
  }

  componentDidMount() {
    let status = SharedData.getObject('signup_status')
    let forgot = SharedData.getObject('forgot_password')

    if(status) {
      SharedData.setObject('signup_status', false)
      let { email, password } = SharedData.getObject('signup_info')
      this.setState({email, password}, () => this._onLoginButton())
    }

    if(forgot) {
      SharedData.setObject('forgot_password', false)
      this.refs.greentoast.show('Please check your email to recover your forgotten password!', DURATION.FOREVER)
    }

    let experiment = this.state.experiments['welcome-message'];
    let clientId = DeviceInfo.getUniqueID();
    let ga = new Analytics('UA-44380471-1', clientId, 1, DeviceInfo.getUserAgent());
    let events = new GAHits.Event(
      'Login',
      'screen opens',
      'Login',
      '',
      experiment
    );
    ga.send(events);
    firebase.messaging().hasPermission()
      .then(enabled => {
        if (enabled) {
          // user has permissions
          firebase.messaging().getToken()
            .then(fcmToken => {
              if (fcmToken) {
                // user has a device token
                //alert(JSON.stringify(fcmToken));
                this.setState({device_token:fcmToken});
                //console.log(fcmToken);
              } else {
                // user doesn't have a device token yet
              }
            });
        } else {
          // user doesn't have permission
          firebase.messaging().requestPermission()
          .then(() => {
            // User has authorised
          })
          .catch(error => {
            // User has rejected permissions
          });
        }
      });
  }

  _onLoginButton = () => {
    try{
      this.setState({errormessage:'', error:false});
      if(this.state.email === '' || this.state.email === null){
        email.MarkField();
        return;
      }
      if(this.state.password === '' || this.state.password === null){
        password.MarkField();
        return;
      }
      this.setState({IndicatorModalFlag:true});
      var details = {
          'username': this.state.email,
          'password': this.state.password
      };
      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
      network.TimeMethod("POST", "login", (flag, response)=>{
          this.setState({IndicatorModalFlag:false});
          if(flag){
            if (response.hasOwnProperty('error')){
              this.setState({errormessage:'Invalid username or password!', error:true});
            }else{
              this.props.actions.Profile(response.wp , response.firebase);
              Realm.WriteData('User',{
                wp: JSON.stringify(response.wp),
                firebase:  JSON.stringify(response.firebase)
              });
              this.setState({userwpprofile:response.wp, userfbprofile:response.firebase});
              this.getUserProfile(response);
            }
          }else{
            this.setState({errormessage:response, error:true});
          }

      }, null, formBody);
    }
    catch(err){
      StyleMethods.LogException("Login / login / " + err.message);
    }
  }

  getUserProfile = (responseData) =>{
    try{
      this.setState({IndicatorModalFlag:true});
      var details = {
          'token': responseData.wp.token,
          'language': 'MT'
      };
      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");

      network.TimeMethod("POST", "getProfile", (flag, response)=>{
          this.setState({IndicatorModalFlag:false});
          if(!flag){
            this.setState({errormessage:'Something went wrong, please try again!', error:true});
          }else{
            if (response.hasOwnProperty('error')){
              this.setState({errormessage:'Something went wrong, please try again!', error:true});
            }else{
              this.editDeviceToken(responseData, response);
            }
          }
      }, null, formBody);
    }
    catch(err){
      StyleMethods.LogException("Login / getProfile / " + err.message);
    }
  }

  editDeviceToken = (responseData, currentuserprofile) =>{
    try{
      this.setState({IndicatorModalFlag:true});
      var details = {
          'token': responseData.wp.token,
          'language': currentuserprofile.preferences.language.data,
          'device_token':this.state.device_token,
          'device_type':Platform.OS
      };
      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");

      network.TimeMethod("POST", "editProfile", (flag, response)=>{
          this.setState({IndicatorModalFlag:false});
          if(!flag){
            this.setState({errormessage:'Something went wrong, please try again!', error:true});
          }else{
            if (response.hasOwnProperty('error')){
              this.setState({errormessage:'Something went wrong, please try again!', error:true});
            }else{
              this.refs.greentoast.show('Login Successful', 3000);
              this.setState({userprofile:response});
              this.props.actions.UserProfile(response);
              Realm.WriteData('UserProfile',{
                profiledata:  JSON.stringify(response)
              });
              if(response.preferences.privacy_policy.data === false){
                this.setState({isModalVisible:!this.state.isModalVisible});
                return;
              };
              if(response.on_boarding.data === false){
                this.props.navigator.resetTo({
                  screen: 'TVM.IntroScreen',
                  navigatorStyle:{navBarHidden:true},
                  passProps:{profiledata:response}
                });
              }else{
                this.props.navigator.resetTo({
                  screen: 'TVM.Landing',
                  navigatorStyle:{navBarHidden:true}
                });
              }
            }
          }
      }, null, formBody);
    }
    catch(err){
      StyleMethods.LogException("Login / editProfile / " + err.message);
    }
  }

  updatePrivacyPolicy = (privacy_policyvalue) =>{
    try{
      if(privacy_policyvalue === true){
          var details = {
              'privacy_policy': true,
              'id':this.state.userfbprofile.localId,
              'token':this.state.userwpprofile.token,
              'language':this.state.userprofile.preferences.language.data
          };
          this.setState({IndicatorModalFlag:true});
          var formBody = [];
          for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
          }
          formBody = formBody.join("&");
          network.TimeMethod("POST", "editProfile", (flag, response)=>{
              this.setState({IndicatorModalFlag:false});
              if (response.hasOwnProperty('error')){
                this.setState({errormessage:'Something went wrong, please try again!', error:true});
              }else{
                Realm.DeleteData('UserProfile')
                Realm.WriteData('UserProfile',{
                  profiledata:  JSON.stringify(response)
                });
                if(response.on_boarding.data === false){
                  this.props.navigator.push({
                    screen: 'TVM.IntroScreen',
                    navigatorStyle:{navBarHidden:true},
                    passProps:{profiledata:response}
                  });
                }else{
                  this.props.navigator.push({
                    screen: 'TVM.Landing',
                    navigatorStyle:{navBarHidden:true}
                  });
                }
              }
          }, null, formBody);
          this.setState({privacy_policy:privacy_policyvalue, isModalVisible: !this.state.isModalVisible})
      }else{
          Realm.DeleteData('User');
          Realm.DeleteData('UserProfile');
          this.setState({privacy_policy:privacy_policyvalue, isModalVisible: !this.state.isModalVisible})
      }
    }
    catch(err){
      StyleMethods.LogException("Login / editProfile / " + err.message);
    }
  }

  showModal = () =>{
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }

  _onSignupButton = () =>{
    this.props.navigator.push({
      screen: 'TVM.SignupScreen',
      navigatorStyle:{navBarHidden:true}
    });
  }

  _onForgotPassword =() =>{
    this.props.navigator.push({
      screen: 'TVM.ForgotPassword',
      navigatorStyle:{navBarHidden:true}
    });
  }

  render() {
    return (
      <ImageBackground source={IMAGES.LOGINBG} style={lg.loginContainer}>
      <KeyboardAwareScrollView contentContainerStyle={{backgroundColor:"transparent", paddingBottom:StyleMethods.getFontSize(100)}} keyboardShouldPersistTaps={'handled'} showsVerticalScrollIndicator={false} scrollEnabled={true} enableOnAndroid={true}>
        <View style={lg.LoginlogoContainer}>
          <Image style={lg.logo} source={IMAGES.LOGINLOGO} />
        </View>
        <View style={{width:'100%', paddingBottom:20}}>
          <TextField label={'Email Address*'} secureTextEntry={false} highlightColor={'white'}
            onChangeText={(text) => { this.state.email = text;}}
            ref={(ref) => this.emailInput = email = ref}
            onSubmitEditing={() => {this.passwordInput.focus();}}
            returnKeyType={'next'}
            placeholder={'Email address'}
            value={this.state.email}
            fieldColor={'white'}
            dense={true}
            autoCorrect={false}
            autoCapitalize={'none'}
            keyboardType={'email-address'}
            inputStyle={cs.contact_textInput}
          />

          <TextField label={'Password*'} secureTextEntry={true} highlightColor={'white'}
            onChangeText={(text) => {this.state.password = text;}}
            ref={(ref) => this.passwordInput = password = ref}
            returnKeyType={'done'}
            placeholder={'Password'}
            autoCapitalize={'none'}
            onSubmitEditing={() => this._onLoginButton()}
            value={this.state.password}
            fieldColor={'white'}
            dense={true}
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

        <TouchableOpacity onPress={this._onLoginButton.bind(this)} style={cs.buttonStyle}>
          <Text style={cs.buttonTextStyle}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={this._onForgotPassword.bind(this)} style={lg.forgotPassword}>
          <Text style={lg.forgotPasswordText}>Forgot password</Text>
        </TouchableOpacity>
        <View style={lg.createAccount}>
        <Text style={lg.newtotvmText}>New To TVMi?</Text>
        </View>
        <TouchableOpacity onPress={this._onSignupButton.bind(this)} style={lg.createAccount}>
          <Text style={lg.createAccountText}>CREATE YOUR ACCOUNT</Text>
        </TouchableOpacity>
        <Modal style ={ms.modalContainer} isVisible={this.state.isModalVisible}>
            <PrivacyModal onSelect={this.updatePrivacyPolicy.bind(this)} ref={(ref) => this.privacyModalOBJ = privacyModalOBJ = ref}/>
        </Modal>
        <Toast style={cs.greentoast} ref="greentoast" position={'bottom'}/>
      </KeyboardAwareScrollView>
      {this.state.IndicatorModalFlag?
      <View style={{position:'absolute',justifyContent:'center',alignItems:'center',left:0,right:0,top:0,bottom:0, zIndex:100, backgroundColor:'rgba(255,255,255,.5)'}}>
          <ActivityIndicator size="large" color={COLORS.BUTTONBG} />
      </View>:null
      }
      </ImageBackground>

    );
  }
}

LoginScreen.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
