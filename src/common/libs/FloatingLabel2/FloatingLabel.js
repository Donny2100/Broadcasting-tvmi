'use strict';
import React, {Component} from "react";
import PropTypes from 'prop-types';
import {StyleSheet, Animated, Alert} from "react-native";
import StyleMethods from '../../Style_Methods';
export default class FloatingLabel extends Component {
  constructor(props: Object) {
    super(props);
    if(props.dense) {
      this.posTop = StyleMethods.getCorrectFontSizeForScreen(8);
      this.posBottom = StyleMethods.getCorrectFontSizeForScreen(18);
      this.fontLarge = StyleMethods.getCorrectFontSizeForScreen(12);
      this.fontSmall = StyleMethods.getCorrectFontSizeForScreen(10);
    } else {
      this.posTop = StyleMethods.getCorrectFontSizeForScreen(16);
      this.posBottom = StyleMethods.getCorrectFontSizeForScreen(37);
      this.fontLarge = StyleMethods.getCorrectFontSizeForScreen(16);
      this.fontSmall = StyleMethods.getCorrectFontSizeForScreen(12);
    }
    let posTop = (props.hasValue) ? this.posTop : this.posBottom;
    let fontSize = (props.hasValue) ? this.fontSmall : this.fontLarge;
    this.state = {
      labelColor: this.props.labelColor,
      top: new Animated.Value(posTop),
      fontSize: new Animated.Value(fontSize)
    };
  }

  MarkField(){
    this.setState({
      labelColor:'red'
    });
    //this.refs.wrapper.setNativeProps({style:{color: 'red'}});
  }

  UnMarkFieild(){
    this.setState({
      labelColor:'#757575'
    });
    //this.refs.wrapper.setNativeProps({style:{color: '#757575'}});
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
          marginLeft: (StyleMethods.getCorrectFontSizeForScreen(5)),
          //marginLeft:(this.props.positionFlag)?StyleMethods.getCorrectFontSizeForScreen(55):StyleMethods.getCorrectFontSizeForScreen(50),
          fontSize: this.state.fontSize,
          top: this.state.top,
          color: this.state.labelColor
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
