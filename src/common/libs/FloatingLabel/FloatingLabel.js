'use strict';
import React, {Component} from "react";
import {StyleSheet, Animated} from "react-native";
import StyleMethods from '../../Style_Methods';
import PropTypes from 'prop-types';

export default class FloatingLabel extends Component {
  constructor(props: Object) {
    super(props);
    if(props.dense) {
      this.posTop = StyleMethods.getCorrectFontSizeForScreen(12);
      this.posBottom = StyleMethods.getCorrectFontSizeForScreen(32);
      this.fontLarge = StyleMethods.getCorrectFontSizeForScreen(13);
      this.fontSmall = StyleMethods.getCorrectFontSizeForScreen(13);
    } else {
      this.posTop = StyleMethods.getCorrectFontSizeForScreen(16);
      this.posBottom = StyleMethods.getCorrectFontSizeForScreen(37);
      this.fontLarge = StyleMethods.getCorrectFontSizeForScreen(16);
      this.fontSmall = StyleMethods.getCorrectFontSizeForScreen(12);
    }
    let posTop = (props.hasValue) ? this.posTop : this.posBottom;
    let fontSize = (props.hasValue) ? this.fontSmall : this.fontLarge;
    this.state = {
      top: new Animated.Value(posTop),
      fontSize: new Animated.Value(fontSize)
    };
  }

  MarkField(){
    this.refs.wrapper.setNativeProps({style:{color: 'red'}});
  }

  UnMarkFieild(){
    this.refs.wrapper.setNativeProps({style:{color: '#9E9E9E'}});
  }

  shouldComponentUpdate(nextProps: Object, nextState: Object) : bool {
    return (this.props.hasValue !== nextProps.hasValue) ? false : true;
  }
  floatLabel() {
    Animated.parallel([
      Animated.timing(this.state.top, {
        toValue: this.posTop,
        duration: this.props.duration
      }),
      Animated.timing(this.state.fontSize, {
        toValue: this.fontSmall,
        duration: this.props.duration
      })
    ]).start();
  }
  sinkLabel() {
    Animated.parallel([
      Animated.timing(this.state.top, {
        toValue: this.posBottom,
        duration: this.props.duration
      }),
      Animated.timing(this.state.fontSize, {
        toValue: this.fontLarge,
        duration: this.props.duration
      })
    ]).start();
  }
  render() : Object {
    let {
      label,
      labelColor,
      highlightColor,
      style
    } = this.props;
    return (
      <Animated.Text
        style={[{
          fontSize: this.state.fontSize,
          top: this.state.top,
          color: labelColor
        }, styles.labelText, this.props.isFocused && {
          color: highlightColor
        }, style]}
        ref="wrapper"
        allowFontScaling={false}
        onPress={()=> {
          this.props.focusHandler();
        }}
      >
        {label}
      </Animated.Text>
    );
  }
}

FloatingLabel.propTypes = {
  duration: PropTypes.number,
  label: PropTypes.string,
  labelColor: PropTypes.string,
  highlightColor: PropTypes.string,
  dense: PropTypes.bool,
  style: PropTypes.object
};

const styles = StyleSheet.create({
  labelText: {
    position: 'absolute',
    left: 0,
    backgroundColor: 'rgba(0,0,0,0)'
  }
});
