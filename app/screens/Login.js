import React, { Component } from 'react';
import { AsyncStorage, Image } from 'react-native';
import { Container, Content, Form, Item, Input, Label, Button, Text, Icon, Spinner, View, Header, Body, Title } from 'native-base';

export default class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
            loggedIn: false,
			loadingSignIn: false,
			windowsId: '',
			password: '',
			message: ''
		};
	}

    componentWillMount() {
		this.loadFromStorage('user');
	}

    saveToStorage = async (key, value) => {
		try {
			await AsyncStorage.setItem(key, value);
		} catch (error) {
			console.log(error);
		}
	}

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

	signIn = () => {
		const { windowsId, password } = this.state;	//refactors out the user and pass out of state
        const { navigate } = this.props.navigation;

		// Keep this. Original code.
		this.setState({
			message: '', //resets the message to clear
			loadingSignIn: true
		});

		navigate('Main');

		// Delete this. It is duplicated at the end.
		this.setState({
			loggedIn: true,
			loadingSignIn: false
		});

		/*  Replace firebase.auth() with new signIn method

		firebase.auth().signInWithwindowsIdAndPassword(windowsId, password)
			.then(() => {		//If user found, sign them in
				// On successful login, store the username in async storage
				this.saveToStorage('user', windowsId).done();
				// Clear windowsId, password, make message color green, and no loading
				this.setState({
					windowsId: '',
					password: '',
					color: 'green',
					message: 'User Signed In',
					loadingSignIn: false
				});
			})
			.catch((error) => {		//If user not found
				this.setState({
					color: 'red',
					message: `${error}`,  // Error is very detailed
					loadingSignIn: false
				});
			});

		*/
	}

    render() {
        return (
            <Container>
				<Header
                    style={styles.headerStyle}
                >
                    <Body>
                        <Title style={styles.headerTextStyle}>Login</Title>
                    </Body>
                </Header>

				<Content style={{ backgroundColor: '#FFF' }}>

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
									defaultValue={this.state.windowsId}
									value={this.state.windowsId}
									onChangeText={windowsId => this.setState({ windowsId })}
									returnKeyType={'done'}
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
									secureTextEntry
									value={this.state.password}
									onChangeText={password => this.setState({ password })}
									returnKeyType={'done'}
								/>
							</Item>
						</Form>
						{/* If Sign in pressed, then show a loading screen*/}
						{this.state.loadingSignIn && <Spinner size='small' />}
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
