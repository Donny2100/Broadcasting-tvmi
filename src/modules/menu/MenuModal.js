import React, { Component } from 'react';
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
  Platform,
  WebView,
} from 'react-native';
import PropTypes from 'prop-types';
import {
  SignupStyle as ss,
  ModalStyle as ms,
  newsFeed as nf,
} from '../../common/style';
import IMAGES from '../../common/images';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as loginActions from '../../common/reducers/app.actions';
import SharedData from '../../common/SharedData'

var onSelect = null;
class MenuModal extends Component {
  constructor(props) {
    super(props);
    /*
		Story feed = Aħbarijiet
		Featured Videos = Filmati
		Live = Live
		Search = Fittex
		*/

    if (this.props.appdata.hasOwnProperty('profiledata')) {
      //this.props.appdata.profiledata.language.data ==
      console.log(this.props.appdata.profiledata.preferences);
    }

    this.state = {
      modalVisible: true,
      whiteLine: false,
      storyfeed:
        this.props.appdata.profiledata.preferences.language.data === 'EN'
          ? 'Story Feed'
          : 'AĦBARIJIET',
      MyStory:
        this.props.appdata.profiledata.preferences.language.data === 'EN'
          ? 'My Story'
          : 'STORJA MY',
      FeaturedVideos:
        this.props.appdata.profiledata.preferences.language.data === 'EN'
          ? 'Featured Videos'
          : 'FILMATI',
      Live:
        this.props.appdata.profiledata.preferences.language.data === 'EN'
          ? 'LIVE'
          : 'LIVE',
      Search:
        this.props.appdata.profiledata.preferences.language.data === 'EN'
          ? 'SEARCH'
          : 'FITTEX',
      NonStopNews:
        this.props.appdata.profiledata.preferences.language.data === 'EN'
          ? 'Non Stop News'
          : 'MHUX WAQFA AĦBARIJIET',
      };

    onSelect = this.props.onSelect;

    console.log(this.props.appdata);
  }

  render() {
    return (
      <ScrollView contentContainerStyle={ms.menuModalInner}>
        <View style={ms.menuLeftSide}>
          <TouchableOpacity
            onPress={() => {
              onSelect('TVM.Landing');
            }}
            style={ms.menuLeftItemContainer}>
            <Image style={ms.menuLeftItemImage} source={IMAGES.STORYFEED} />
            <Text style={ms.menuLeftItemText}>{this.state.storyfeed}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onSelect('TVM.BulletIns');
            }}
            style={ms.menuLeftItemContainer}>
            <Image
              style={ms.menuLeftItemImage}
              source={IMAGES.FEATUREDVIDEOS}
            />
            <Text style={ms.menuLeftItemText}>{this.state.FeaturedVideos}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onSelect('TVM.MyStory');
            }}
            style={ms.menuLeftItemContainer}>
            <Image style={ms.menuLeftItemImage} source={IMAGES.MYSTORY} />
            <Text style={ms.menuLeftItemText}>{this.state.MyStory}</Text>
          </TouchableOpacity>
          {/*
					<TouchableOpacity onPress={() => {onSelect('')}} style={ms.menuLeftItemContainer}>
							<Image style={ms.menuLeftItemImage} source={IMAGES.MYSTORY} />
							<Text style={ms.menuLeftItemText}>MY STORY</Text>
					</TouchableOpacity>
					*/}
          <TouchableOpacity
            onPress={() => {
              onSelect('TVM.LiveTv');
            }}
            style={ms.menuLeftItemContainer}>
            <Image style={ms.menuLeftItemImage} source={IMAGES.LIVEICON} />
            <Text style={ms.menuLeftItemText}>{this.state.Live}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              onSelect('TVM.TVMi');
            }}
            style={ms.menuLeftItemContainer}>
            <Image style={ms.menuLeftItemImage} source={IMAGES.TVMI} />
            <Text style={ms.menuLeftItemText}>{'TVMi'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              onSelect('TVM.Search');
            }}
            style={ms.menuLeftItemContainer}>
            <Image style={ms.menuLeftItemImage} source={IMAGES.SEARCHICON} />
            <Text style={ms.menuLeftItemText}>{this.state.Search}</Text>
          </TouchableOpacity>
          {/*}
					<TouchableOpacity onPress={() => {onSelect('TVM.Landing')}} style={ms.menuLeftItemContainer}>
							<Image style={ms.menuLeftItemImage} source={IMAGES.ACTIVE_MENU} />
					</TouchableOpacity>
          */}

          <TouchableOpacity
            onPress={() => {
              SharedData.setObject("PLATFORM", "NONSTOP")
              onSelect('TVM.Landing');
            }}
            style={ms.menuLeftItemContainer}>
            <Image style={ms.menuLeftItemImage} source={IMAGES.NONSTOP} />
            <Text style={ms.menuLeftItemText}>{this.state.NonStopNews}</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            onPress={() => {
              onSelect('');
              setTimeout(() => {
                this.setState({ whiteLine: true });
              }, 800);
            }}
            style={nf.menubarMenuButton}>
            <Image style={nf.menuImage} source={IMAGES.MENU} />
          </TouchableOpacity> */}
        </View>
        <TouchableOpacity
          onPress={() => {
            onSelect('');
          }}
          style={ms.menuRightItemContainer}
        />
      </ScrollView>
    );
  }
}

MenuModal.propTypes = {
  actions: PropTypes.object.isRequired,
  navigator: PropTypes.object,
};

function mapStateToProps(state, ownProps) {
  return {
    appdata: state.appdata,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(loginActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuModal);

//export default connect(mapStateToProps, mapDispatchToProps)(Landing);
//export default MenuModal;
