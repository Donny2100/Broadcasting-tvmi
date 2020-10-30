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
  Alert,
  StyleSheet,
  Platform
} from "react-native";
import PropTypes from 'prop-types';

import IMAGES from '../../common/images';
import { commonStyle as cs, loginPageStyle as lg, ModalStyle as ms, newsFeed as nf } from '../../common/style';
import Realm from '../../common/realm';
import StyleMethods from '../../common/Style_Methods';
import { copilot, walkthroughable, CopilotStep } from '@okgrow/react-native-copilot';
const WalkthroughableText = walkthroughable(Text);
const WalkthroughableImage = walkthroughable(Image);
var UserData =null;
var USER = null;
var copilotRef = null;
class WalkThrough extends Component {
  constructor(props: Object) {
    super(props);
    UserData = Realm.ReadData('UserProfile');
    USER = JSON.parse(UserData[0].profiledata);
    console.log(USER);
    let index = 1;
    let walkthroughArray = [];
    for(let key in USER.walkthrough.step) {
        let obj = USER.walkthrough.step[key];
        obj.order = index;
        index = index + 1;
        //obj.key = key;
        walkthroughArray.push(obj);
    };
    console.log(walkthroughArray);
    this.state = {
      menuVisible:false,
      walkthrough:walkthroughArray,
      walkthroughBK:IMAGES.WALKTHROUGHBG,
      visibleArea:{width:StyleMethods.getFontSize(95),height:StyleMethods.getFontSize(100), position:'absolute', left:StyleMethods.getFontSize(-25), top:StyleMethods.getFontSize(0)}
    };
    //alert(JSON.stringify(walkthroughArray));
  }

  static propTypes = {
    start: PropTypes.func.isRequired,
    copilotEvents: PropTypes.shape({
      on: PropTypes.func.isRequired,
    }).isRequired,
  };


  componentDidMount() {
    this.props.copilotEvents.on('stepChange', this.handleStepChange);
    this.props.start();
    this.props.copilotEvents.on('stop', this.handleStopEvent);
  }

  handleStopEvent = () => {
    this.props.navigator.resetTo({
      screen: 'TVM.Landing',
      navigatorStyle:{navBarHidden:true}
    });
  }

  handleStepChange = (step) => {

    if(step.name ==="Menu"){
      this.setState({menuVisible:false, visibleArea:{width:StyleMethods.getFontSize(95),height:StyleMethods.getFontSize(100), position:'absolute', left:StyleMethods.getFontSize(-35), top:StyleMethods.getFontSize(0)}});//20, 108, 198, 288, 378, 468
    }else if(step.name ==="The Story Feed" || step.name ==="L-Għalf tal-Istorja"){
      this.setState({menuVisible:true, visibleArea:{width:StyleMethods.getFontSize(95),height:StyleMethods.getFontSize(100), position:'absolute', left:StyleMethods.getFontSize(-25), top:StyleMethods.getFontSize(0)}});
    }else if(step.name === "Featured Videos" || step.name === "Videos Dehru" || step.name === "Filmati"){
      this.setState({menuVisible:true, visibleArea:{width:StyleMethods.getFontSize(95),height:StyleMethods.getFontSize(100), position:'absolute', left:StyleMethods.getFontSize(-25), top:StyleMethods.getFontSize(88)}});
    }else if(step.name === "My Story"){
      this.setState({menuVisible:true, visibleArea:{width:StyleMethods.getFontSize(95),height:StyleMethods.getFontSize(100), position:'absolute', left:StyleMethods.getFontSize(-25), top:StyleMethods.getFontSize(178)}});
    }else if(step.name === "Live"){
      this.setState({menuVisible:true, visibleArea:{width:StyleMethods.getFontSize(95),height:StyleMethods.getFontSize(100), position:'absolute', left:StyleMethods.getFontSize(-25), top:StyleMethods.getFontSize(268)}});
    }else if(step.name === "TVMi"){
      this.setState({menuVisible:true, visibleArea:{width:StyleMethods.getFontSize(95),height:StyleMethods.getFontSize(100), position:'absolute', left:StyleMethods.getFontSize(-25), top:StyleMethods.getFontSize(358)}});
    }else if(step.name === "Search"){
      this.setState({menuVisible:true, visibleArea:{width:StyleMethods.getFontSize(95),height:StyleMethods.getFontSize(100), position:'absolute', left:StyleMethods.getFontSize(-25), top:StyleMethods.getFontSize(448)}});
    }else if(step.name === "Preferences" || step.name === "Preferenzi"){
      this.setState({menuVisible:true, visibleArea:{width:StyleMethods.getFontSize(95),height:StyleMethods.getFontSize(100), position:'absolute', right:StyleMethods.getFontSize(-35), top:StyleMethods.getFontSize(0)}});
    }
  }

  renderWalktrhoughModal = ( item ) => {
    return (
      <CopilotStep ref={(ref) => this.copilotRef = copilotRef = ref} 
        text={item.desc} order={item.order} name={item.title}>
          <WalkthroughableText style={this.state.visibleArea}>
          </WalkthroughableText>
      </CopilotStep>
    );
  };

  render() {
    return (
      <ImageBackground source={this.state.walkthroughBK} style={[lg.walkThroughloginContainer,{position:'relative'}]} resizeMode={'contain'}>
        {this.state.menuVisible?
          <View style={ms.walkthroughMenuMainContainer}>
            <View style={[ms.menuLeftSideWalkthrough,{flexDirection:'column'}]}>
              <TouchableOpacity onPress={() => {onSelect('TVM.Landing')}} style={ms.menuLeftWalkthroughContainer}>
                  <Image style={ms.menuLeftItemImage} source={IMAGES.STORYFEED} />
                  <View style={ms.menuleftItemTextContainer}>
                    <Text style={ms.menuLeftItemTextWalkthrough}>
                      {USER.preferences.language.data ==="EN"?'STORY FEED':'AħBARIJIET'}
                    </Text>
                  </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {onSelect('TVM.BulletIns')}} style={ms.menuLeftWalkthroughContainer}>
                  <Image style={ms.menuLeftItemImage} source={IMAGES.FEATUREDVIDEOS} />
                  <View style={ms.menuleftItemTextContainer}>
                    <Text style={ms.menuLeftItemTextWalkthrough}>
                      {USER.preferences.language.data ==="EN"?'FEATURED VIDEOS':'FILMATI'}
                    </Text>
                  </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {onSelect('TVM.MyStory')}} style={ms.menuLeftWalkthroughContainer}>
                  <Image style={ms.menuLeftItemImage} source={IMAGES.MYSTORY} />
                  <View style={ms.menuleftItemTextContainer}>
                    <Text style={ms.menuLeftItemTextWalkthrough}>{USER.preferences.language.data ==="EN"?'MY STORY':'STORJA MY'}</Text>
                  </View>
              </TouchableOpacity>
              {/*<TouchableOpacity onPress={() => {onSelect('')}} style={ms.menuLeftWalkthroughContainer}>
                  <Image style={ms.menuLeftItemImage} source={IMAGES.MYSTORY} />
                  <View style={ms.menuleftItemTextContainer}>
                    <Text style={ms.menuLeftItemTextWalkthrough}>MY STORY</Text>
                  </View>
              </TouchableOpacity>*/}
              <TouchableOpacity onPress={() => {onSelect('TVM.LiveTv')}} style={ms.menuLeftWalkthroughContainer}>
                  <Image style={ms.menuLeftItemImage} source={IMAGES.LIVEICON} />
                  <View style={ms.menuleftItemTextContainer}>
                    <Text style={ms.menuLeftItemTextWalkthrough}>LIVE</Text>
                  </View>
              </TouchableOpacity>
              {/*<TouchableOpacity onPress={() => {onSelect('')}} style={ms.menuLeftWalkthroughContainer}>
                  <Image style={ms.menuLeftItemImage} source={IMAGES.TVMI} />
                  <View style={ms.menuleftItemTextContainer}>
                    <Text style={ms.menuLeftItemTextWalkthrough}>TVMi</Text>
                  </View>
              </TouchableOpacity>*/}
              <TouchableOpacity onPress={() => {onSelect('TVM.Search')}} style={ms.menuLeftWalkthroughContainer}>
                  <Image style={ms.menuLeftItemImage} source={IMAGES.SEARCHICON} />
                  <View style={ms.menuleftItemTextContainer}>
                    <Text style={ms.menuLeftItemTextWalkthrough}>
                      {USER.preferences.language.data ==="EN"?'SEARCH':'FITTEX'}
                    </Text>
                  </View>
              </TouchableOpacity>
              {/*}
              <TouchableOpacity onPress={() => {onSelect('TVM.Landing')}} style={ms.menuLeftItemContainer}>
                  <Image style={ms.menuLeftItemImage} source={IMAGES.ACTIVE_MENU} />
              </TouchableOpacity>
              */}
              <TouchableOpacity onPress={() => {onSelect('')}} style={nf.walkthrough_menubarMenuButton}>
                  <Image style={nf.menuImage} source={IMAGES.MENU} />
              </TouchableOpacity>
            </View>
          </View>
          :null
        }
        <View style={{flex: 1,alignItems: 'center', paddingTop: 40,}}>
          {this.state.walkthrough.map(this.renderWalktrhoughModal)}
        </View>
      </ImageBackground>
    );
  }
}


export default copilot()(WalkThrough);
