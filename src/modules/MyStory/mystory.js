import React, { Component } from 'react';
import {
	View,
	Text,
	Image,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	ImageBackground,
	ScrollView,
	BackHandler,
	AppState,
	Platform
} from 'react-native';
import PropTypes from 'prop-types';
import { commonStyle as cs, newsFeed as nf, bulletins as bi, ModalStyle as ms } from '../../common/style';
import StyleMethods from '../../common/Style_Methods';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as loginActions from '../../common/reducers/app.actions';
import network from '../../common/network';
import MenuModal from '../menu/MenuModal';
import Modal from "react-native-modal";
import Realm from '../../common/realm';
import Indicator from '../../common/libs/indicator';
import { Analytics, Hits as GAHits } from 'react-native-google-analytics';
import DeviceInfo from 'react-native-device-info';
var indicatorOBJ = null;
import Toast from 'react-native-easy-toast';
import ImagePicker from 'react-native-image-picker';


class MyStory extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isModalVisible: false,
			descriptionLabel: 'Do you have a story to tell us or a video/photo you want to show us?',
			videoText1: '',
			appState: '',
			mediaPickerModel: false,
			experiments: {},
			formValues: {
				name: null,
				email: null,
				phone: null,
				external_url: null,
				message: null,
				media: null,
				media_name: null,
				media_ext: null
			},
			errormessage: null
		};
		this._handleAppStateChange = this._handleAppStateChange.bind(this);
		this.onMediaSelected = this.onMediaSelected.bind(this);
	}

	_handleAppStateChange = (nextAppState) => {
		if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
			console.log("appState", this.state.appState);
			if (this.props.appdata.currentTrack !== 0 && this.props.appdata.currentTrack !== undefined) {
				console.log("page", this.props.appdata.currentTrack);
				console.log("props", this.props);
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

	_showMenu = () => {
		this.setState({ isModalVisible: !this.state.isModalVisible })
	}

	componentWillMount() {
		if (Platform.OS === 'android') {
			BackHandler.addEventListener('hardwareBackPress', this.onBackHandler);
		}
		AppState.addEventListener('change', this._handleAppStateChange);
	}

	componentWillUnmount() {
		if (Platform.OS === 'android') {
			BackHandler.removeEventListener('hardwareBackPress', this.onBackHandler);
		}
		AppState.removeEventListener('change', this._handleAppStateChange);
	}

	onBackHandler = () => {
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

	componentDidMount() {
		let experiment = this.state.experiments['welcome-message'];
		let clientId = DeviceInfo.getUniqueID();
		let ga = new Analytics('UA-44380471-1', clientId, 1, DeviceInfo.getUserAgent());
		let events = new GAHits.Event(
			'My_Story',
			'screen opens',
			'My_Story',
			'',
			experiment
		);
		ga.send(events);
		var user = this.props.appdata.profiledata;
		this.setState({ videoText1: this.toTitleCase(user.titles.my_story && user.titles.my_story.length > 0 ? user.titles.my_story : 'My Story') });
	}

	toTitleCase(str) {
		return str.replace(/\w\S*/g, function (txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	}

	onFormValueChanged(property, value) {
		let formValues = this.state.formValues;
		formValues[property] = value;
		this.setState({
			formValues: formValues
		});
		console.log('onFormValueChanged', formValues);
	}

	onUploadFileClicked() {
		this.setState({
			mediaPickerModel: true
		});
	}

	onMediaTypeClicked(type) {
		switch (type) {
			case 'PhotoCamera':
				ImagePicker.launchCamera({ mediaType: 'photo' }, (response) => {
					this.onMediaSelected('image', response);
				});
				break;
			case 'PhotoLibrary':
				ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
					this.onMediaSelected('image', response);
				});
				break;
			case 'VideoCamera':
				ImagePicker.launchCamera({ mediaType: 'video' }, (response) => {
					this.onMediaSelected('video', response);
				});
				break;
			case 'VideoLibrary':
				ImagePicker.launchImageLibrary({ mediaType: 'video' }, (response) => {
					this.onMediaSelected('video', response);
				});
				break;
		}

		this.setState({
			mediaPickerModel: false
		});
	}

	onMediaSelected(type, response) {
		console.log('Response = ', response);

		if (response.didCancel) {
			console.log('User cancelled image picker');
		} else if (response.error) {
			console.log('ImagePicker Error: ', response.error);
		} else if (response.customButton) {
			console.log('User tapped custom button: ', response.customButton);
		} else {
			let path = ''

			if(Platform.OS === 'android') {
				path = response.path
			} else if(Platform.OS === 'ios') {
				path = response.fileName
			}

			var splitArr = path.split('.');
			var extension = splitArr[splitArr.length - 1];
			var name = 'story_' + type + '.' + extension;
			var photo = {
				uri: response.uri,
				type: this.getMediaType(type, extension),
				name: name,
				isVideo: type == 'video',
				isStatic: true
			};
			const formValues = this.state.formValues;
			formValues.media = photo;
			formValues.media_name = name;
			formValues.media_ext = extension;
			console.log(photo);
			this.setState({
				formValues: formValues
			});
		}
	}

	getMediaType(type, extension) {
		var mimeType = type + '/';
		if (extension == 'jpg' || extension == 'jpeg') {
			mimeType += 'jpeg';
		} else if (extension == '3gp') {
			mimeType += '3gpp';
		} else if (extension == 'png' || extension == 'mp4') {
			mimeType += extension;
		} else {
			mimeType += '*';
		}
		console.log('getMediaType', type, extension);
		return mimeType;
	}

	onSubmitClicked() {
		try {
			if (!this.state.formValues.name || !this.state.formValues.email
				|| !this.state.formValues.media) {
				this.refs.redtoast.show('Required fields are empty (name or email or media)', 3000);
				return;
			}

			if (indicatorOBJ !== null) {
				indicatorOBJ.setModalVisible(true);
			}

			// generate body
			var data = Realm.ReadData('User');
			var _token = data[0].wp;
			var res = _token.split(",");
			var res2 = res[0].split(":");
			const token_data = res2[1];
			var details = {
				...this.state.formValues,
				'token': stripEndQuotes(token_data),
			};
			var formBody = new FormData();
			for (var property in details) {
				formBody.append(property, details[property]);
			}

			// send request
			network.FormMethod("POST", "https://www.tvm.com.mt/wp-json/wp/v2/myStory", (flag, response) => {
				if (indicatorOBJ !== null) {
					indicatorOBJ.setModalVisible(false);
				}

				console.log('MyStory', 'onSubmitResponse', response);
				if (flag) {
					if (response.hasOwnProperty('error')) {
						this.refs.redtoast.show(response.error, 3000);
						return;
					} else {
						if (response.hasOwnProperty('success')) {
							this.refs.redtoast.show(this.props.appdata.profiledata.my_story.success, 3000);
							this.setState({
								formValues: {
									name: null,
									email: null,
									phone: null,
									external_url: null,
									message: null,
									media: null,
									media_ext: null,
									media_name: null
								},
							});
							return;
						}
					}
				}
				this.refs.redtoast.show(response, 3000);
			}, null, formBody, true);
		}
		catch (err) {
			console.log(err);
			StyleMethods.LogException("MyStory / MyStory / " + err.message);
		}
	}

	render() {
		return (
			<View style={cs.container}>
				{this.state.isModalVisible ?
					<View style={ms.modalTransparentBG}></View>
					: null}
				<Modal backdropOpacity={0} animationOut="slideOutUp" animationIn="slideInDown" animationInTiming={1000} animationOutTiming={1000} backdropTransitionInTiming={3000} backdropTransitionOutTiming={3000} style={ms.menuModal} isVisible={this.state.isModalVisible}>
					<MenuModal onSelect={this.updateScreen.bind(this)} ref={(ref) => this.privacyModalOBJ = privacyModalOBJ = ref} />
				</Modal>
				<View style={nf.topView}>
					<ImageBackground style={nf.topViewLeft} source={require('../../common/assets/img/bg-storyfeed.png')}>
						{(!this.state.isModalVisible) ?
							<TouchableOpacity style={nf.menuButton} onPress={this._showMenu.bind(this)}>
								<Image style={nf.menuImage} source={require('../../common/assets/img/menu-icon.png')} />
							</TouchableOpacity> : null}
					</ImageBackground>
					<View style={nf.topViewRight}>
						<View style={bi.toptextView}>
							<Text style={bi.toptext}>{this.props.appdata.profiledata.my_story.label_title}</Text>
						</View>
					</View>
				</View>
				<View style={nf.bottomView}>
					<View style={[bi.bulletsinstabsView, { paddingHorizontal: StyleMethods.getFontSize(40) }]}>
						<Text style={[bi.tabstext, { textAlign: "center" }]}>{this.props.appdata.profiledata.my_story.label_top}</Text>
					</View>
					<View style={bi.bulletinsbelowFormView}>
						<ScrollView>
							<View style={[bi.formWrapper]}>
								<View style={bi.uploadFileWrapperView}>
									{!this.state.formValues.media ?
										<TouchableOpacity style={bi.uploadFileInnerWrapperView} onPress={() => { this.onUploadFileClicked() }}>
											<Image style={bi.uploadIcon} source={require('../../common/assets/img/upload.png')} />
											<Text style={bi.uploadText}>{this.props.appdata.profiledata.my_story.select_box}</Text>
										</TouchableOpacity>
										: <TouchableOpacity style={bi.uploadFileInnerWrapperView} onPress={() => { this.onUploadFileClicked() }}>
											{!this.state.formValues.media.isVideo ?
												<Image style={bi.previewImage} source={{ isStatic: true, uri: this.state.formValues.media.uri }} />
												: null}
											<Text style={bi.uploadText}>{this.state.formValues.media.isVideo ? 'Video Selected' : 'Image Selected'}</Text>
										</TouchableOpacity>
									}
								</View>
								<TextInput
									ref={(ref) => this.nameInput = ref}
									style={bi.textInputView}
									value={this.state.formValues.name}
									onChangeText={(text) => this.onFormValueChanged('name', text)}
									onSubmitEditing={() => { this.emailInput.focus(); }}
									placeholder={this.props.appdata.profiledata.my_story.name}
									placeholderTextColor="#707070"
									underlineColorAndroid="transparent" />
								<TextInput
									ref={(ref) => this.emailInput = ref}
									style={bi.textInputView}
									value={this.state.formValues.email}
									onChangeText={(text) => this.onFormValueChanged('email', text)}
									onSubmitEditing={() => { this.phoneInput.focus(); }}
									placeholder={this.props.appdata.profiledata.my_story.email}
									placeholderTextColor="#707070"
									keyboardType="email-address"
									underlineColorAndroid="transparent" />
								<TextInput
									ref={(ref) => this.phoneInput = ref}
									style={bi.textInputView}
									value={this.state.formValues.phone}
									onChangeText={(text) => this.onFormValueChanged('phone', text)}
									onSubmitEditing={() => { this.urlInput.focus(); }}
									placeholder={this.props.appdata.profiledata.my_story.tel}
									placeholderTextColor="#707070"
									keyboardType="phone-pad"
									underlineColorAndroid="transparent" />
								<TextInput
									ref={(ref) => this.urlInput = ref}
									style={bi.textInputView}
									value={this.state.formValues.external_url}
									onChangeText={(text) => this.onFormValueChanged('external_url', text)}
									onSubmitEditing={() => { this.messageInput.focus(); }}
									placeholder={this.props.appdata.profiledata.my_story.ext_url}
									placeholderTextColor="#707070"
									keyboardType="url"
									underlineColorAndroid="transparent" />
								<TextInput
									ref={(ref) => this.messageInput = ref}
									style={[bi.textInputView, { textAlignVertical: 'top' }]}
									value={this.state.formValues.message}
									onChangeText={(text) => this.onFormValueChanged('message', text)}
									onSubmitEditing={() => { this.submitInput.focus(); }}
									placeholder={this.props.appdata.profiledata.my_story.message}
									placeholderTextColor="#707070"
									underlineColorAndroid="transparent"
									multiline={true}
									numberOfLines={10} />
								<TouchableOpacity
									ref={(ref) => this.submitInput = ref}
									style={[bi.submitView]}
									onPress={() => this.onSubmitClicked()}>
									<Text style={bi.submitTextView}>{this.props.appdata.profiledata.my_story.submit}</Text>
								</TouchableOpacity>
							</View>
						</ScrollView>
					</View>
				</View>
				<Modal onBackdropPress={() => this.setState({ mediaPickerModel: false })} backdropOpacity={0.7} animationOut="slideOutUp" animationIn="slideInDown" animationInTiming={1000} animationOutTiming={1000} backdropTransitionInTiming={3000} backdropTransitionOutTiming={3000} isVisible={this.state.mediaPickerModel}>
					<TouchableWithoutFeedback>
						<View style={bi.dialog}>
							<Text style={[bi.menuItem, { color: '#C51A25' }]}>{this.props.appdata.profiledata.my_story.popup_lable_1}</Text>
							<TouchableOpacity onPress={() => this.onMediaTypeClicked('PhotoCamera')}>
								<Text style={bi.menuItem}>{this.props.appdata.profiledata.my_story.popup_lable_2}</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => this.onMediaTypeClicked('PhotoLibrary')}>
								<Text style={bi.menuItem}>{this.props.appdata.profiledata.my_story.popup_lable_3}</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => this.onMediaTypeClicked('VideoCamera')}>
								<Text style={bi.menuItem}>{this.props.appdata.profiledata.my_story.popup_lable_4}</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => this.onMediaTypeClicked('VideoLibrary')}>
								<Text style={bi.menuItem}>{this.props.appdata.profiledata.my_story.popup_lable_5}</Text>
							</TouchableOpacity>
						</View>
					</TouchableWithoutFeedback>
				</Modal>
				<Indicator ref={(ref) => this.indicatorOBJ = indicatorOBJ = ref} />
				<Toast style={cs.redtoast} ref="redtoast" position={'top'} />
			</View>
		);
	}
}

MyStory.propTypes = {
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

function stripEndQuotes(s) {
	var t = s.length;
	if (s.charAt(0) == '"') s = s.substring(1, t--);
	if (s.charAt(--t) == '"') s = s.substring(0, t);
	return s;
}

export default connect(mapStateToProps, mapDispatchToProps)(MyStory);
