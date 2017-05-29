// TextInputManager
//
// Provides helper functions for managing the focus state of text
// inputs. This is a hack! You are supposed to be able to call
// "focus()" directly on TextInput nodes, but that doesn't seem
// to be working as of ReactNative 0.36
//
import { findNodeHandle } from 'react-native';
import TextInputState from 'react-native/lib/TextInputState';


export function focusTextInput(node) {
  try {
    TextInputState.focusTextInput(findNodeHandle(node));
  } catch (e) {
    console.log("Couldn't focus text input: ", e.message);
  }
}
