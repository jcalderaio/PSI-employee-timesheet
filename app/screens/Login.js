import React, { Component } from 'react';
import {
  AsyncStorage,
  Image,
  Platform,
  Keyboard,
  LayoutAnimation,
  Dimensions,
  UIManager
} from 'react-native';
import {
  Container,
  Content,
  Form,
  Item,
  Input,
  Label,
  Button,
  Text,
  Icon,
  Spinner,
  View,
  Header,
  Body,
  Title
} from 'native-base';
import base64 from 'base-64'; // converts Authorization password to base-64
import { Ionicons } from '@expo/vector-icons';

import { focusTextInput } from '../components/HelperFunctions'; // Move to next text input

import ApiUtils from '../components/ApiUtils'; // checks for errors in Fetches

import userStore from '../stores/UserStore';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      passwordEncrypted: true,
      windowsId: '',
      password: '',
      message: '',
      visibleHeight: 525 //Initial height of screen (used to move keyboard) (was 525)
    };

    // Gives Android animations
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  // Loads username from AsyncStorage and creates Keyboard Listeners for keyboard
  componentWillMount() {
    this.loadFromStorage('user');
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShow.bind(this)
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide.bind(this)
    );
  }

  // removes listeners from keyboard on unmount component
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  // When keyboard is shown:
  keyboardDidShow(e) {
    // New size of window height
    const newSize = Dimensions.get('window').height - e.endCoordinates.height;
    this.setState({
      visibleHeight: newSize // Sets the new height of screen so keyboard out of way
    });
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring); // This is the spring animation
  }

  // When keyboard is shut
  keyboardDidHide() {
    this.setState({
      visibleHeight: 525 // Reset height to Original
    });
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring); // This is the spring animation
  }

  // Function I made to save username to AsyncStorage
  saveToStorage = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log(error);
    }
  };

  // Function I made to load username from AsyncStorage
  loadFromStorage = async key => {
    try {
      await AsyncStorage.getItem(key)
        .then(value => {
          if (value !== null) {
            this.setState({ windowsId: value });
            console.log(value);
          }
        })
        .done();
    } catch (error) {
      console.log(error);
    }
  };

  getEmployeeInfo = () => {
    const { windowsId, password } = this.state; //refactors out the user and pass out of state
    const { navigate } = this.props.navigation;

    this.setState({
      message: '', //resets the message to clear
      loading: true
    });

    fetch(`https://psitime.psnet.com/Api/Employees?Logon=${windowsId}`, {
      method: 'GET',
      headers: {
        Authorization: 'Basic ' + base64.encode(`${windowsId}:${password}`)
      }
    })
      .then(ApiUtils.checkStatus)
      .then(response => response.json())
      .then(responseData => {
        // On successful login, store the username in async storage
        this.saveToStorage('user', windowsId).done();

        // Add these variables to MobX
        userStore.windowsId = windowsId;
        userStore.password = password;
        userStore.employeeInfo = responseData[0];
        userStore.loggedIn = true;

        this.setState({
          password: '',
          loading: false,
          passwordEncrypted: true
        });
        navigate('Main'); // Put this inside the last fetch statement
      })
      .catch(e => {
        this.setState({
          message: `${e}: bad username/password`,
          password: '',
          loading: false
        });
      });
  };

  // Pressed when the user "Logs In"
  signIn = () => {
    this.getEmployeeInfo();
  };

  render() {
    return (
      <Container>
        <Header style={styles.headerStyle}>
          <Body>
            <Title style={styles.headerTextStyle}>Login</Title>
          </Body>
        </Header>

        <Content
          style={{ backgroundColor: 'black' }}
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
            <Form style={{ backgroundColor: 'white', marginHorizontal: 20 }}>
              <Item inlineLabel>
                <Icon active name="logo-windows" style={{ color: '#396DA6' }} />
                <Label
                  style={{
                    fontWeight: 'bold',
                    fontSize: global.MEDIUM_TEXT
                  }}
                >
                  Windows ID
                </Label>
                <Input
                  style={{ fontSize: global.MEDIUM_TEXT }}
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
                <Icon active name="unlock" style={{ color: 'orange' }} />
                <Label
                  style={{
                    fontWeight: 'bold',
                    fontSize: global.MEDIUM_TEXT
                  }}
                >
                  Password
                </Label>
                <Input
                  style={{ fontSize: global.MEDIUM_TEXT }}
                  ref="inputB"
                  secureTextEntry={this.state.passwordEncrypted}
                  value={this.state.password}
                  onChangeText={password => this.setState({ password })}
                  returnKeyType={'send'}
                  onSubmitEditing={this.signIn}
                />
                {/*Eye Button*/}
                <Button
                  transparent
                  onPress={() =>
                    this.setState({
                      passwordEncrypted: !this.state.passwordEncrypted
                    })}
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                >
                  <Ionicons name="ios-eye" size={26} />
                  {/*"Show" if password encrypted*/}
                  {this.state.passwordEncrypted &&
                    <Text
                      style={{
                        fontSize: global.XS_TEXT,
                        color: 'black',
                        marginTop: -10
                      }}
                    >
                      Show
                    </Text>}
                  {/*"Hide" if password not encrypted*/}
                  {!this.state.passwordEncrypted &&
                    <Text
                      style={{
                        fontSize: global.XS_TEXT,
                        color: 'black',
                        marginTop: -10
                      }}
                    >
                      Hide
                    </Text>}
                </Button>
              </Item>
            </Form>

            {/* If Sign in pressed, then show a loading screen*/}
            {this.state.loading && <Spinner size="small" />}
            {/* If NOT pressed, then show a login Button*/}
            {!this.state.loading &&
              <Button block onPress={this.signIn} style={styles.loginButton}>
                <Text style={{ fontSize: global.MEDIUM_TEXT }}>Login</Text>
              </Button>}

            {/* If bad username/password then show error */}
            <Text style={styles.errorMessageStyle}>
              {this.state.message}
            </Text>
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
    flex: 1, //this will stretch it across the screen
    width: null
  },
  errorMessageStyle: {
    marginTop: 20,
    paddingHorizontal: 20,
    fontSize: global.SMALL_TEXT,
    color: 'red',
    alignSelf: 'center'
  }
};
