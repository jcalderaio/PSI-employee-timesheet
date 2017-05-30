import React, { Component } from 'react';
import { AsyncStorage, Image, StatusBar, Platform, Keyboard, LayoutAnimation, Dimensions, UIManager } from 'react-native';
import { Container, Content, Form, Item, Input, Label, Button, Text, Icon, Spinner, View, Header, Body, Title } from 'native-base';
import base64 from 'base-64';

import { focusTextInput } from '../components/HelperFunctions';

import ApiUtils from '../components/ApiUtils';

export default class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
            loggedIn: false,
			loadingSignIn: false,
			windowsId: '',
			password: '',
			message: '',
			visibleHeight: 525,  //Initial height of screen
		};

		// Gives Android animations
		if (Platform.OS === 'android') {
      		UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    	}
	}

	// Loads username from AsyncStorage and creates Keyboard Listeners for screen move
    componentWillMount() {
		this.loadFromStorage('user');
		this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow.bind(this));
    	this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide.bind(this));
	}

	// removes listeners on unmount component
	componentWillUnmount() {
		this.keyboardDidShowListener.remove();
    	this.keyboardDidHideListener.remove();
	}

	// When keyboard is shown:
	keyboardDidShow(e) {
		// New size of window height
    	const newSize = Dimensions.get('window').height - e.endCoordinates.height;
	    this.setState({
	      visibleHeight: newSize,   // Sets the new height of screen so keyboard out of way
	      topLogo: { width: 100, height: 70 } // for Logo. Not in use
	  	});
		LayoutAnimation.configureNext(LayoutAnimation.Presets.spring); // This is the spring animation
  	}

	// When keyboard is shut
  	keyboardDidHide(e) {
		this.setState({
		  visibleHeight: 525,  // Reset height to Original
		  topLogo: { width: Dimensions.get('window').width }
	  	});
		LayoutAnimation.configureNext(LayoutAnimation.Presets.spring); // This is the spring animation
    }

	// Function I made to save values to AsyncStorage
    saveToStorage = async (key, value) => {
		try {
			await AsyncStorage.setItem(key, value);
		} catch (error) {
			console.log(error);
		}
	}

	// Function I made to load values from AsyncStorage
    loadFromStorage = async (key) => {
		try {
			await AsyncStorage.getItem(key).then((value) => {
				if (value !== null) {
					this.setState({ windowsId: value });
					console.log(value);
				}
			}).done();
		} catch (error) {
			console.log(error);
		}
	}

	// Pressed when the user "Logs In"
	signIn = () => {
		const { windowsId, password, employeeInfo } = this.state;	//refactors out the user and pass out of state
        const { navigate } = this.props.navigation;

		this.setState({
			message: '', //resets the message to clear
			loadingSignIn: true
		});

		fetch(`http://psitime.psnet.com/Api/Employees?Logon=jcalderaio`, {
	        method: 'get',
	        headers: {
	          'Authorization': 'Basic ' + base64.encode(`jcalderaio:7Rx8bu5hn4`)
	        }
	    })
	    .then(ApiUtils.checkStatus)
	    .then(response => response.json())
	    .then(responseData => {
		  // On successful login, store the username in async storage
		  this.saveToStorage('user', windowsId).done();
	      this.setState({
			password: '',
			loggedIn: true,
	        loadingSignIn: false
	      });
		  navigate('Tabs', { data: responseData[0] }); // Data available from BOTH tabs
	    })
	    .catch(e => {
	      this.setState({
	        message: `${e}: bad username/password`,
			password: '',
	        loadingSignIn: false
	      });
	    });
	}

    render() {
        return (
            <Container>
				{/*Hide Status Bar on Android because cuts into header*/}
				{(Platform.OS === 'android') &&
					<StatusBar
						hidden
					/>
				}

				<Header
                    style={styles.headerStyle}
                >
                    <Body>
                        <Title style={styles.headerTextStyle}>Login</Title>
                    </Body>
                </Header>

				<Content
					style={{ backgroundColor: '#FFF' }}
					contentContainerStyle={{ height: this.state.visibleHeight }}
				>

					<View style={{ flex: 1 }}>
						<Image
							style={styles.logoStyle}
							source={require('../img/logo.png')}
							resizeMode="contain"
						/>
					</View>

					<View style={{ flex: 1.3 }}>
						<Form>
							<Item inlineLabel>
								<Icon
									active
									name='logo-windows'
									style={{ color: '#396DA6' }}
								/>
								<Label style={{ fontWeight: 'bold' }}>Windows ID</Label>
								<Input
									autoCapitalize={'none'}
									defaultValue={this.state.windowsId}
									value={this.state.windowsId}
									onChangeText={windowsId => this.setState({ windowsId })}
									returnKeyType={'next'}
									blurOnSubmit={false}
									onSubmitEditing={() => focusTextInput(this.refs.inputB)}
								/>
							</Item>
							<Item inlineLabel>
								<Icon
									active
									name='unlock'
									style={{ color: 'orange' }}
								/>
								<Label style={{ fontWeight: 'bold' }}>Password</Label>
								<Input
									ref='inputB'
									secureTextEntry
									value={this.state.password}
									onChangeText={password => this.setState({ password })}
									returnKeyType={'send'}
									onSubmitEditing={this.signIn}
								/>
							</Item>
						</Form>

						{/* If Sign in pressed, then show a loading screen*/}
						{(this.state.loadingSignIn) && <Spinner size='small' />}
						{/* If NOT pressed, then show a login Button*/}
						{(!this.state.loadingSignIn) &&
							<Button
								block
								onPress={this.signIn}
								style={styles.loginButton}
							>
								<Text>Login</Text>
							</Button>
						}

						{/* If bad username/password then show error */}
						<Text style={styles.errorMessageStyle}>{this.state.message}</Text>
					</View>
				</Content>
			</Container>
        );
    }
}

const styles = {
	headerStyle: {
		backgroundColor: 'red'
	},
	headerTextStyle: {
		color: '#FFF'
	},
	loginButton: {
		backgroundColor: '#EF5350',
		marginHorizontal: 20,
		marginTop: 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 2
	},
	logoStyle: {
		height: 265,
		flex: 1, 		//this will stretch it across the screen
		width: null
	},
    errorMessageStyle: {
        marginTop: 20,
        paddingHorizontal: 20,
        fontSize: 14,
        color: 'red',
        alignSelf: 'center'
    }
};
