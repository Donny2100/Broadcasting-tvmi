import { Navigation } from 'react-native-navigation';

import LoginScreen from './modules/login/LoginScreen';
import SignupScreen from './modules/signup/SignupScreen';
import ForgotPassword from './modules/forgotpassword/ForgotPassword';
import Landing from './modules/landing/Landing';
import WebPages from './modules/WebPages/webpages';
import Simpleweb from './modules/Simpleweb/simpleweb';
import MenuModal from './modules/menu/MenuModal';
import IntroScreen from './modules/intro/IntroScreen';
import Newsfeed from './modules/NewsFeed/newsfeed';
import BulletIns from './modules/BulletIns/bulletins';
import LiveTv from './modules/LiveTv/livetv';
import Search from './modules/Search/search';
import SettingsScreen from './modules/settings/SettingsScreen';
import WalkThrough from './modules/walkthrough/WalkThrough';
import TVMiScreen from './modules/TVMi';
import MyStory from './modules/MyStory/mystory';

export function registerScreens(store, Provider) {
  Navigation.registerComponent(
    'TVM.LoginScreen',
    () => LoginScreen,
    store,
    Provider
  );
  Navigation.registerComponent(
    'TVM.SignupScreen',
    () => SignupScreen,
    store,
    Provider
  );
  Navigation.registerComponent(
    'TVM.ForgotPassword',
    () => ForgotPassword,
    store,
    Provider
  );
  Navigation.registerComponent('TVM.Landing', () => Landing, store, Provider);
  Navigation.registerComponent(
    'TVM.IntroScreen',
    () => IntroScreen,
    store,
    Provider
  );
  Navigation.registerComponent(
    'TVM.MenuModal',
    () => MenuModal,
    store,
    Provider
  );
  Navigation.registerComponent('TVM.Newsfeed', () => Newsfeed, store, Provider);
  Navigation.registerComponent('TVM.MyStory', () => MyStory, store, Provider);
  Navigation.registerComponent(
    'TVM.BulletIns',
    () => BulletIns,
    store,
    Provider
  );
  Navigation.registerComponent('TVM.LiveTv', () => LiveTv, store, Provider);
  Navigation.registerComponent('TVM.Search', () => Search, store, Provider);
  Navigation.registerComponent('TVM.WebPages', () => WebPages, store, Provider);
  Navigation.registerComponent(
    'TVM.Simpleweb',
    () => Simpleweb,
    store,
    Provider
  );
  Navigation.registerComponent(
    'TVM.SettingsScreen',
    () => SettingsScreen,
    store,
    Provider
  );
  Navigation.registerComponent(
    'TVM.WalkThrough',
    () => WalkThrough,
    store,
    Provider
  );
  Navigation.registerComponent('TVM.TVMi', () => TVMiScreen, store, Provider);
}
