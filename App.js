import React from 'react';
import { View } from 'react-native';
import Expo, { Constants } from 'expo'; // Constants for Android status bar
import { ModalStack } from './app/navigation';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isReady: false // Need for NativeBase + Android
		};
	}

	async componentWillMount() {
		// Need for NativeBase + Android
		await Expo.Font.loadAsync({ 'Roboto': require('native-base/Fonts/Roboto.ttf'), 'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf') });

		// Need for NativeBase + Android
		this.setState({
			isReady: true
		});
	}

	render() {
		// Need for NativeBase + Android
		if (!this.state.isReady) {
			return <Expo.AppLoading />;
		}

		// Allows the status bar to fit on Android screens
		return (
			<View style={[styles.container, !Constants.platform && styles.androidStatusBarPadding]}>
				<ModalStack />
			</View>
		);
	}
}

// For android Status bar
const styles = {
  container: {
    flex: 1,
  },
  androidStatusBarPadding: {
    paddingTop: Constants.statusBarHeight
  }
};
