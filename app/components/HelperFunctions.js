// TextInputManager
//
// Provides helper functions for managing the focus state of text

import { findNodeHandle } from 'react-native';
import TextInputState from 'react-native/lib/TextInputState';

export function focusTextInput(node) {
	try {
		TextInputState.focusTextInput(findNodeHandle(node));
	} catch (e) {
		console.log("Couldn't focus text input: ", e.message);
	}
}
