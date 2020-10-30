'use strict';
import React, {Component} from "react";
import PropTypes from 'prop-types';
import {View, TextInput, StyleSheet, Image} from "react-native";
import StyleMethods from '../../Style_Methods';
import Underline from './Underline';
import FloatingLabel from './FloatingLabel';
import Icon from 'react-native-vector-icons/FontAwesome';
export default class TextField extends Component {
  constructor(props: Object, context: Object) {
    super(props, context);
    this.state = {
      isFocused: false,
      text: props.value,
      height: props.height
    };
  }

  MarkField(){
    //this.refs.underline.MarkField();
    this.refs.ICON.setNativeProps({style:{color: 'red'}});
    this.refs.floatingLabel.MarkField();
  }

  UnMarkFieild(){
    //this.refs.underline.UnMarkFieild();
    this.refs.ICON.setNativeProps({style:{color: '#757575'}});
    this.refs.floatingLabel.UnMarkFieild();
  }

  focus() {
    this.refs.input.focus();
  }
  blur() {
    this.refs.input.blur();
  }
  isFocused() {
    return this.state.isFocused;
  }
  measureLayout(...args){
    this.refs.wrapper.measureLayout(...args)
  }
  componentWillReceiveProps(nextProps: Object){
    if(this.props.text !== nextProps.value){
      nextProps.value.length !== 0 ?
        this.refs.floatingLabel.floatLabel()
        : this.refs.floatingLabel.sinkLabel();
      this.setState({text: nextProps.value});
    }
    if(this.props.height !== nextProps.height){
      this.setState({height: nextProps.height});
    }
  }
  render() {
    let {
      icon,
      iconcolor,
      secureTextEntry,
      label,
      highlightColor,
      duration,
      labelColor,
      borderColor,
      textColor,
      textFocusColor,
      textBlurColor,
      onFocus,
      onBlur,
      onChangeText,
      onChange,
      value,
      dense,
      inputStyle,
      wrapperStyle,
      labelStyle,
      height,
      autoGrow,
      multiline,
      keyboardType,
      ...props
    } = this.props;
    return (
      <View style={[dense ? styles.denseWrapper : styles.wrapper, this.state.height ? {height: undefined}: {}, wrapperStyle]} ref="wrapper">
        <View style={{flexDirection:'row',flex:1,paddingLeft:StyleMethods.getCorrectFontSizeForScreen(10),paddingRight:StyleMethods.getCorrectFontSizeForScreen(10)}} >
        <View style={{flex:.30}} >
        <Icon ref="ICON"
          name={icon} size={StyleMethods.getCorrectFontSizeForScreen(15)}
          color={iconcolor} style={{alignSelf:'center'}}/>
        </View>
        <TextInput secureTextEntry={secureTextEntry}
          style={[dense ? styles.denseTextInput : styles.textInput, {
            color: textColor , flex:.70
          }, (this.state.isFocused && textFocusColor) ? {
            color: textFocusColor
          } : {}, (!this.state.isFocused && textBlurColor) ? {
            color: textBlurColor
          } : {}, inputStyle,  {height: StyleMethods.getCorrectFontSizeForScreen(23),paddingVertical:StyleMethods.getCorrectFontSizeForScreen(5)}]}
          multiline={multiline} keyboardType={keyboardType}
          onFocus={() => {
            this.setState({isFocused: true});
            this.refs.floatingLabel.floatLabel();
            this.refs.underline.expandLine();
            onFocus && onFocus();
          }}
          onBlur={() => {
            this.setState({isFocused: false});
            !this.state.text.length && this.refs.floatingLabel.sinkLabel();
            this.refs.underline.shrinkLine();
            onBlur && onBlur();
          }}
          onChangeText={(text) => {
            this.setState({text});
            onChangeText && onChangeText(text);
          }}
          onChange={(event) => {
            if(autoGrow){
              this.setState({height: event.nativeEvent.contentSize.height});
            }
            onChange && onChange(event);
          }}
          ref="input"
          value={this.state.text}
          {...props}
        />
        </View>
        <Underline
          //ref={(ref) => this.underline = underlineOBJ = ref}
          ref="underline"
          highlightColor={"transparent"}
          duration={duration}
          borderColor={borderColor}
        />
        <FloatingLabel
          isFocused={this.state.isFocused}
          ref="floatingLabel"
          focusHandler={this.focus.bind(this)}
          label={label}
          labelColor={labelColor}
          highlightColor={highlightColor}
          duration={duration}
          dense={dense}
          positionFlag={false}
          hasValue={(this.state.text.length) ? true : false}
          style={labelStyle}
        />
      </View>
    );
  }
}

TextField.propTypes = {
  duration: PropTypes.number,
  label: PropTypes.string,
  highlightColor: PropTypes.string,
  labelColor: PropTypes.string,
  borderColor: PropTypes.string,
  textColor: PropTypes.string,
  textFocusColor: PropTypes.string,
  textBlurColor: PropTypes.string,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChangeText: PropTypes.func,
  onChange: PropTypes.func,
  value: PropTypes.string,
  dense: PropTypes.bool,
  inputStyle: PropTypes.object,
  wrapperStyle: PropTypes.object,
  labelStyle: PropTypes.object,
  multiline: PropTypes.bool,
  keyboardType: PropTypes.string,
  autoGrow: PropTypes.bool,
  height: PropTypes.oneOfType([PropTypes.oneOf(undefined), PropTypes.number])
};

TextField.defaultProps = {
  duration: 200,
  labelColor: '#FFFFFF',
  borderColor: 'transparent',
  textColor: '#FFFFFF',
  value: '',
  dense: false,
  underlineColorAndroid: 'rgba(0,0,0,0)',
  multiline: false,
  keyboardType: "default",
  autoGrow: false,
  height: undefined
};

const styles = StyleSheet.create({
  wrapper: {
    height: StyleMethods.getCorrectFontSizeForScreen(54),
    paddingTop: StyleMethods.getCorrectFontSizeForScreen(20),
    paddingBottom: StyleMethods.getCorrectFontSizeForScreen(4),
    position: 'relative'
  },
  denseWrapper: {
    height: StyleMethods.getCorrectFontSizeForScreen(42),
    paddingTop: StyleMethods.getCorrectFontSizeForScreen(18),
    paddingBottom: StyleMethods.getCorrectFontSizeForScreen(2),
    position: 'relative'
  },
  textInput: {
    //marginLeft:50,
    fontSize: StyleMethods.getCorrectFontSizeForScreen(12),
    height: StyleMethods.getCorrectFontSizeForScreen(24),
    lineHeight: StyleMethods.getCorrectFontSizeForScreen(24),
    textAlignVertical: 'top'
  },
  denseTextInput: {
    //marginLeft:50,
    fontSize: StyleMethods.getCorrectFontSizeForScreen(12),
    height: StyleMethods.getCorrectFontSizeForScreen(20),
    lineHeight: StyleMethods.getCorrectFontSizeForScreen(18),
    paddingBottom: StyleMethods.getCorrectFontSizeForScreen(1),
    textAlignVertical: 'top'
  }
});
