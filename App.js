import React from 'react';
import Expo from 'expo';
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
		await Expo.Font.loadAsync({ 'Roboto': require('native-base/Fonts/Roboto.ttf'), 'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf')});

		this.setState({ isReady: true }); // Need for NativeBase + Android
	}

	render() {
		// Need for NativeBase + Android
		if (!this.state.isReady) {
			return <Expo.AppLoading />;
		}

		return (<ModalStack />);
	}
}
