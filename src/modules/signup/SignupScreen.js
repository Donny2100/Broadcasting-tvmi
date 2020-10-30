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
import { commonStyle as cs, loginPageStyle as lg, SignupStyle as ss, ModalStyle as ms } from '../../common/style';
import StyleMethods from '../../common/Style_Methods';
import TextField from '../../common/libs/FloatingLabel/TextField';
import network from '../../common/network';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CheckBox from '../../common/libs/react-native-check-box';
import Modal from "react-native-modal";
import Toast, {DURATION} from 'react-native-easy-toast'
import Indicator from '../../common/libs/indicator';
import PrivacyModal from '../privacymodal/PrivacyModal';
import firebase from 'react-native-firebase';
import {Analytics, Hits as GAHits, Experiment as GAExperiment} from 'react-native-google-analytics';
import DeviceInfo from 'react-native-device-info';
var indicatorOBJ = null;
var privacyModalOBJ = null;
var fullname = null, email = null, password=null, ErrorMessageContainer=null;
import SharedData from '../../common/SharedData';

class SignupScreen extends Component {
  constructor(props: Object) {
    super(props);
    this.state = {
      fullname:'',//owais
      email: '',//owais_Afridi91@yahoo.com
      password: '',//test12345
      newsletter:false,
      privacy_policy:false,
      error: false,
			errormessage:'',
      isModalVisible: false,
      validPassword:false,
      experiments: {},
    };
    this.updatePrivacyPolicy = this.updatePrivacyPolicy.bind(this);
  }

  _handleLoginPress = () =>{
    this.props.navigator.resetTo({
      screen: 'TVM.LoginScreen',
      navigatorStyle:{navBarHidden:true}
    });
  }

  handlePasswordChange(pass) {

    this.setState({ password:pass});

    var re = /^(?=.*\d)(?=.*[A-Z])(.{8,15})$/;
    if (!this.state.validPassword) {
      if (re.test(pass)) {
      	//Password has to be at least 4 characters long
      	this.setState({ validPassword: true });
      }
    } else if (!re.test(pass)) {
      this.setState({ validPassword: false });
    }
  }

  componentDidMount() {
    let experiment = this.state.experiments['welcome-message'];
    let clientId = DeviceInfo.getUniqueID();
    let ga = new Analytics('UA-44380471-1', clientId, 1, DeviceInfo.getUserAgent());
    let events = new GAHits.Event(
      'Sign Up',
      'screen opens',
      'Sign Up',
      '',
      experiment
    );
    ga.send(events);
  }

  _onSignupButton = () =>{
    try{
      this.setState({errormessage:'', error:false});
      if(this.state.fullname === '' || this.state.fullname === null){
        fullname.MarkField();
        return;
      }
      if(this.state.email === '' || this.state.email === null){
        email.MarkField();
        return;
      }
      if(!StyleMethods.validateEmail(this.state.email)){
        this.setState({errormessage:'Enter a valid email', error:true});
        email.MarkField();
        return;
      }
      if(this.state.password === '' || this.state.password === null){
        password.MarkField();
        return;
      }
      if(this.state.validPassword === false){
        this.setState({errormessage:'Password must be atleast 8 characters long and should have atleast one upper case letter and one digit.', error:true});
        password.MarkField();
        return;
      }
      if(!this.state.privacy_policy){
        this.setState({isModalVisible:!this.state.isModalVisible});
        return;
      }
      if(indicatorOBJ !== null){
          indicatorOBJ.setModalVisible(true);
      }

      var details = {
          'fullname': this.state.fullname,
          'email':this.state.email,
          'password': this.state.password,
          'newsletter':this.state.newsletter,
          'privacy_policy':this.state.privacy_policy
      };
      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
      console.log("FormBody", formBody);
      network.TimeMethod("POST", "createUser", (flag, response)=>{
          if(indicatorOBJ !== null){
              indicatorOBJ.setModalVisible(false);
          }
          if(flag){
            if (response.hasOwnProperty('error')){
              console.log("response",response);
              this.setState({errormessage:'The email has already been taken!', error:true});
            }else{
              this.refs.greentoast.show('Signup Successful', 3000);
              SharedData.setObject('signup_status', true);
              let { email, password } = this.state
              SharedData.setObject('signup_info', { email, password });
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
    catch(err){
      StyleMethods.LogException("Sign Up / createUser / " + err.message);
    }
  }

  updateCheckbox = () =>{
    if(this.state.newsletter === true){
      this.setState({newsletter:false});
    }else if(this.state.newsletter === false){
      this.setState({newsletter:true});
    }
  }

  updatePrivacyPolicy = (privacy_policyvalue) =>{
    this.setState({privacy_policy:privacy_policyvalue, isModalVisible: !this.state.isModalVisible});
    if(privacy_policyvalue){
      //this._onSignupButton.bind(this);
      setTimeout(() => {this._onSignupButton()}, 500);
    }else{
      return;
    }
  }

  showModal = () =>{
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }

  render() {
    return (
      <ImageBackground source={IMAGES.LOGINBG} style={lg.loginContainer}>
      <KeyboardAwareScrollView contentContainerStyle={{backgroundColor:"transparent", paddingBottom:StyleMethods.getFontSize(50)}} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'} scrollEnabled={true} enableOnAndroid={true}>

        <View style={lg.logoContainer}>
          <Image style={lg.logo} source={IMAGES.LOGINLOGO} />
        </View>
        <View style={{width:'100%', paddingBottom:20}}>
          <TextField label={'Full Name*'} secureTextEntry={false} highlightColor={'white'}
            onChangeText={(text) => { this.state.fullname = text;}}
            ref={(ref) => this.fullnameInput = fullname = ref}
            onSubmitEditing={() => {this.emailInput.focus();}}
            returnKeyType={'next'}
            placeholder={'Full name'}
            value={this.state.fullname}
            fieldColor={'white'}
            dense={true}
            autoCorrect={false}
            autoCapitalize={'words'}
            keyboardType={'default'}
            inputStyle={cs.contact_textInput}
          />

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
            onChangeText={(text) => {this.handlePasswordChange(text)}}
            ref={(ref) => this.passwordInput = password = ref}
            returnKeyType={'done'}
            placeholder={'Password'}
            autoCapitalize={'none'}
            onSubmitEditing={() => this._onSignupButton()}
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



        <View style={ss.checkboxContainer}>
          <CheckBox
           style={ss.checkboxStyle}
           onClick={()=>this.updateCheckbox()}
           isChecked={this.state.newsletter}
           //rightText={'leftText'}
           />
           <View style={ss.checkboxTextContainer}>
             <Text style={ss.checkboxTextStyle}>
                  Yes, I would like to receive newsletters and promotional material from PBS.
                  I have read and understood the latest Privacy Policy updates <Text onPress={this.showModal.bind(this)} style={ss.clickHereStyle}>here</Text>
             </Text>
          </View>
        </View>
        <TouchableOpacity onPress={this._onSignupButton.bind(this)} style={cs.buttonStyle}>
          <Text style={cs.buttonTextStyle}>CREATE YOUR ACCOUNT</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this._handleLoginPress.bind(this)} style={cs.backbuttonStyle}>
          <Text style={cs.buttonTextStyle}>BACK</Text>
        </TouchableOpacity>
        <Modal style ={ms.modalContainer} isVisible={this.state.isModalVisible}>
            <PrivacyModal onSelect={this.updatePrivacyPolicy.bind(this)} ref={(ref) => this.privacyModalOBJ = privacyModalOBJ = ref}/>
        </Modal>
        <Toast style={cs.greentoast} ref="greentoast" position={'bottom'}/>
      </KeyboardAwareScrollView>
      <Indicator ref={(ref) => this.indicatorOBJ = indicatorOBJ = ref}/>
      </ImageBackground>
    );
  }
}


module.exports = (SignupScreen);
