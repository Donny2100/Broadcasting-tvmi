import React, { Component } from 'react';
import {
	Modal,
	Platform,
  View,
	ActivityIndicator
} from 'react-native';
import PropTypes from 'prop-types';
import StyleMethods from '../Style_Methods';
import COLORS from '../colors';

import renderIf from '../renderIf';
var IndicatorModal = null;
class Indicator extends Component {
	constructor(props) {
		super(props);
    this.state = {
      modalVisible: false
		};
		
	}

	componentDidMount() {
		let visible = this.props.modalVisible !== undefined ? this.props.modalVisible : this.state.modalVisible;
		this.setState({
			modalVisible: visible
		});
		this.setStyle(visible);
	}

  setModalVisible(visible) {
		if(IndicatorModal === null){
			return;
		}
		this.setStyle(visible);
    this.setState({modalVisible: visible});
	}
	
	setStyle(visible) {
		if(visible){
			IndicatorModal.setNativeProps({style:{position:'absolute',justifyContent:'center',alignItems:'center',left:0,right:0,top:0,bottom:0, zIndex:100, backgroundColor:'rgba(255,255,255,.5)'}});
		}else{
			IndicatorModal.setNativeProps({style:{position:'absolute',justifyContent:'center',alignItems:'center',left:StyleMethods.getWidth(),top:0,bottom:0, zIndex:100, backgroundColor:'transparent'}});
		}
	}

	render() {
		return (
			<View ref={(ref) => this.IndicatorModal = IndicatorModal = ref} style={{position:'absolute',justifyContent:'center',alignItems:'center',top:0,bottom:0}}>
				{renderIf(this.state.modalVisible)(() => (
					<ActivityIndicator size="large" color={COLORS.BUTTONBG} />
				))}
			</View>
		);
	}
}
export default Indicator;
