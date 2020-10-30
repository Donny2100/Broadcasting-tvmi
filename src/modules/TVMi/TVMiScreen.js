import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  BackHandler,
  AppState,
  Platform,
  WebView,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import {
  commonStyle as cs,
  bulletins as bi,
  newsFeed as nf,
  storyPage as sp,
  livetv as lt,
  searchPage as se,
  ModalStyle as ms,
} from '../../common/style';
import StyleMethods from '../../common/Style_Methods';
import MenuModal from '../menu/MenuModal';
import Modal from 'react-native-modal';
import Indicator from '../../common/libs/indicator';
import Toast, { DURATION } from 'react-native-easy-toast';
import {
  Analytics,
  Hits as GAHits,
  Experiment as GAExperiment,
} from 'react-native-google-analytics';
import DeviceInfo from 'react-native-device-info';

const WEBVIEW_SOURCE = {
  uri: 'https://www.tvm.com.mt/mt/tvmi/',
};

export default class TVMiScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchFlag: false,
      isModalVisible: false,
      newsFeed: [],
      searchItem: null,
      appState: '',
      experiments: {},
    };
    this._handleAppStateChange = this._handleAppStateChange.bind(this);
  }

  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('appState', this.state.appState);

      if (
        this.props.appdata.currentTrack !== 0 &&
        this.props.appdata.currentTrack !== undefined
      ) {
        console.log('page', this.props.appdata.currentTrack);
        console.log('props', this.props);

        var temp = '';
        this.props.navigator.resetTo({
          passProps: { temp },
          screen: 'TVM.LiveTv',
          navigatorStyle: StyleMethods.newNavigationStyle(),
          animated: false,
        });
      }
    }

    this.setState({ appState: nextAppState });
  };

  componentDidMount() {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this._onBackHandler);
    }
    AppState.addEventListener('change', this._handleAppStateChange);

    let experiment = this.state.experiments['welcome-message'];
    let clientId = DeviceInfo.getUniqueID();
    let ga = new Analytics(
      'UA-44380471-1',
      clientId,
      1,
      DeviceInfo.getUserAgent()
    );
    let events = new GAHits.Event(
      'TVMi',
      'screen opens',
      'TVMi',
      '',
      experiment
    );
    ga.send(events);
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this._onBackHandler);
    }
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  _showMenu = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  _onBackHandler = () => {
    this._close();
    return true;
  };

  _close = () => {
    this.props.navigator.resetTo({
      screen: 'TVM.Landing',
      navigatorStyle: StyleMethods.newNavigationStyle(),
      animationType: 'fade',
      animated: true,
    });
  };

  _updateScreen = ScreenValue => {
    if (!this.state.isModalVisible) {
      return;
    }

    this.setState({ isModalVisible: !this.state.isModalVisible });

    if (ScreenValue !== '') {
      this.props.navigator.resetTo({
        screen: ScreenValue,
        navigatorStyle: { navBarHidden: true },
        animated: true,
      });
    }
  };

  render() {
    return (
      <View style={cs.container}>
        {this.state.isModalVisible ? (
          <View style={ms.modalTransparentBG} />
        ) : null}

        <Modal
          backdropOpacity={'0'}
          animationOut={'slideOutUp'}
          animationIn={'slideInDown'}
          animationInTiming={1000}
          animationOutTiming={1000}
          backdropTransitionInTiming={3000}
          backdropTransitionOutTiming={3000}
          style={ms.menuModal}
          isVisible={this.state.isModalVisible}>
          <MenuModal
            onSelect={this._updateScreen}
            ref={ref => (this.privacyModalOBJ = privacyModalOBJ = ref)}
          />
        </Modal>

        <View style={nf.topView}>
          <ImageBackground
            style={nf.topViewLeft}
            source={require('../../common/assets/img/bg-storyfeed.png')}>
            {!this.state.isModalVisible ? (
              <TouchableOpacity
                style={nf.menuButton}
                onPress={this._showMenu.bind(this)}>
                <Image
                  style={nf.menuImage}
                  source={require('../../common/assets/img/menu-icon.png')}
                />
              </TouchableOpacity>
            ) : null}
          </ImageBackground>

          <View style={nf.topViewRight}>
            <View style={bi.toptextView}>
              <Text style={bi.toptext}>{'TVMi'}</Text>
            </View>
          </View>
        </View>

        <View style={nf.bottomView}>
          <WebView style={styles.webview} source={WEBVIEW_SOURCE} />
        </View>

        <Indicator ref={ref => (this.indicatorOBJ = indicatorOBJ = ref)} />

        <Toast
          style={cs.redtoastBackground}
          textStyle={cs.redtoast}
          ref="redtoast"
          position={'top'}
        />
      </View>
    );
  }
}

TVMiScreen.propTypes = {
  actions: PropTypes.object.isRequired,
  navigator: PropTypes.object,
};

function stripEndQuotes(s) {
  var t = s.length;
  if (s.charAt(0) == '"') s = s.substring(1, t--);
  if (s.charAt(--t) == '"') s = s.substring(0, t);
  return s;
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: '#ccc',
  },
});
