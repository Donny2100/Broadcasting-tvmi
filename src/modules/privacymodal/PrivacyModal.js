import React, { PropTypes, Component } from 'react';
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
  WebView
} from 'react-native';

import { SignupStyle as ss, ModalStyle as ms } from '../../common/style';
import StyleMethods from '../../common/Style_Methods';
import renderIf from '../../common/renderIf';
import Modal from "react-native-modal";
import COLORS from '../../common/colors';
var onSelect = null;
class PrivacyModal extends Component {
	constructor(props) {
		super(props);
    this.state = {
      modalVisible:true
    };
		onSelect = this.props.onSelect;
	}

	render() {
		return(
			<View style ={ms.modalInnerView}>
				<View style={ms.modalTitleContainer}>
					<Text style={ms.modalTitle}>Privacy Policy</Text>
				</View>
				<WebView
					source={{uri: 'https://www.tvm.com.mt/mt/privacy-policy/app/'}}
					style={{marginTop: 20}}
				/>
				<View style={ms.modalButtonsContainer}>
					<View style={ms.modalButtonInnerView}>
						<TouchableOpacity onPress={() => {onSelect(false)}} style={ms.declineButton}>
							<Text style={ms.declineText}>Decline</Text>
						</TouchableOpacity>
					</View>
					<View style={ms.modalButtonInnerView}>
						<TouchableOpacity onPress={() => {onSelect(true)}} style={ms.acceptButton}>
							<Text style={ms.acceptText}>Accept</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
	);
}
}
export default PrivacyModal;
