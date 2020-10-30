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

import { SignupStyle as ss, commonStyle as cs, ModalStyle as ms } from '../../common/style';
import StyleMethods from '../../common/Style_Methods';
import renderIf from '../../common/renderIf';
import Modal from "react-native-modal";
import COLORS from '../../common/colors';
var onSelect = null;
class PrivacySettingsModal extends Component {
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
					<View style={[ms.modalButtonInnerView,{width:'100%'}]}>
						<TouchableOpacity onPress={() => {onSelect(false)}} style={[cs.buttonStyle,{backgroundColor:COLORS.BLUETHEMECOLOR}]}>
							<Text style={cs.buttonTextStyle}>Done</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
	);
}
}
export default PrivacySettingsModal;
