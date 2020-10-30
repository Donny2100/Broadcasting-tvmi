'use strict';
import React, {Component} from "react";
import {View, StyleSheet, Animated} from "react-native";
import StyleMethods from '../../Style_Methods';
import PropTypes from 'prop-types';

export default class Underline extends Component {
  constructor(props: Object) {
    super(props);
    this.state = {
      lineLength: new Animated.Value(0),
    };
    this.wrapperWidth = 0;
  }

  MarkField(){
    this.refs.Animatedwrapper.setNativeProps({style:{backgroundColor: 'red'}});
    this.refs.wrapper.setNativeProps({style:{backgroundColor: 'red'}});
  }

  UnMarkFieild(){
    this.refs.Animatedwrapper.setNativeProps({style:{backgroundColor: '#ab7321'}});
    this.refs.wrapper.setNativeProps({style:{backgroundColor: '#E0E0E0'}});
  }

  componentDidMount() {
    requestAnimationFrame(() => {
      if (this.refs.wrapper == null) {
        return;
      }
      const container = this.refs.wrapper;  // un-box animated view
      container.measure((left, top, width, height) => {
        this.wrapperWidth = width;
      });
    });
  }
  expandLine() {
    Animated.timing(this.state.lineLength, {
      toValue: this.wrapperWidth,
      duration: this.props.duration
    }).start();
  }
  shrinkLine() {
    Animated.timing(this.state.lineLength, {
      toValue: 0,
      duration: this.props.duration
    }).start();
  }
  render() {
    let {
      borderColor,
      highlightColor
    } = this.props;
    return (
      <View
        style={[styles.underlineWrapper, {
          backgroundColor: borderColor
        }]}
        ref="wrapper"
      >
        <Animated.View
          style={[{
            width: this.state.lineLength,
            height: StyleMethods.getFontSize(1),
            backgroundColor: highlightColor
          }]}
          ref="Animatedwrapper"
          >
        </Animated.View>
      </View>
    );
  }
}

Underline.propTypes = {
  duration: PropTypes.number,
  highlightColor: PropTypes.string,
  borderColor: PropTypes.string
};

const styles = StyleSheet.create({
  underlineWrapper: {
    height: StyleMethods.getCorrectFontSizeForScreen(1),
    alignItems: 'center'
  }
});
