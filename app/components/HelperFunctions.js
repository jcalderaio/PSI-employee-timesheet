import { findNodeHandle, Dimensions } from 'react-native';
import TextInputState from 'react-native/lib/TextInputState';

// TextInputManager (Helper function for managing the focus state of text)
export function focusTextInput(node) {
  try {
    TextInputState.focusTextInput(findNodeHandle(node));
  } catch (e) {
    console.log("Couldn't focus text input: ", e.message);
  }
}

// Functions for managing size of text/other things based on width
const { width, height } = Dimensions.get('window');

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 680;

export function scale(size) {
  return width / guidelineBaseWidth * size;
}

export function verticalScale(size) {
  return height / guidelineBaseHeight * size;
}

export function moderateScale(size, factor = 0.5) {
  return size + (scale(size) - size) * factor;
}

global.XS_TEXT = scale(12);
global.SMALL_TEXT = scale(14);
global.MEDIUM_TEXT = scale(16);
global.LARGE_TEXT = scale(18);
global.XL_TEXT = scale(20);
