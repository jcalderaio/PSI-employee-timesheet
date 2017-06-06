import React, { Component } from 'react';
import { Image, Platform, Alert } from 'react-native';
import { Container, Content, Button, Text, Grid, Header, Left, Right, Body, Title, View, Spinner } from 'native-base';
import base64 from 'base-64';  // converts Authorization password to base-64
import moment from 'moment';
import { SimpleLineIcons } from '@expo/vector-icons';

import ApiUtils from '../components/ApiUtils'; // checks for errors in Fetches

import { CardSection } from '../components/CardSection';
import { Card } from '../components/Card';

export default class Main extends Component {
  constructor() {
    super();
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    this.fetchAPIs();
  }

  fetchAPIs = () => {
    fetch(`http://psitime.psnet.com/Api/RecentJobs?Employee_ID=${global.employeeInfo.Employee_No}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + base64.encode(`${global.windowsId}:${global.password}`)
        }
    })
    .then(ApiUtils.checkStatus)
    .then(response => response.json())
    .then(responseData => {
      // These Global variables are available in every file!
      global.recentJobs = responseData;
      console.log(responseData);
      this.setState({
  			loading: false
  	  });
    })
    .catch(e => {
      console.log(`Error Retreiving Recent Jobs: ${e}`);
      this.setState({
          loading: false
      });
    });
  }

  render() {
    const { navigate, goBack } = this.props.navigation;

    if (this.state.loading) {
      return (
        <View style={styles.centerContainter}>
          <Spinner size='large' />
        </View>
      );
    }

    return (
      <Container>
          {/* Header */}
          <Header
            style={styles.headerStyle}
          >
            <Left>
              {/*Logout button with option to cancel*/}
              <Button
                transparent
                onPress={() => Alert.alert(
                  'Logout?',
                   ' ',
                   [
                     { text: 'Cancel', onPress: () => console.log('Cancel Pressed!') },
                     { text: 'OK', onPress: () => goBack(null) },
                   ]
                )}
              >
                 <SimpleLineIcons name='logout' color='#FFF' size={21.5} />

              </Button>
            </Left>

            <Body>
              <Title style={styles.headerTextStyle}>Main</Title>
            </Body>

            <Right />

          </Header>
          {/*End Header*/}

          {/*Body*/}
          <Content>

              {/*Banner Image at top of screen*/}
              <View style={styles.imageStyle.imageOuter}>
                <Image
                  style={styles.imageStyle.imageInner}
                  source={require('../img/banner.png')}
                  resizeMode="contain"
                />
              </View>

              <Card>
                <CardSection>
                  <Grid style={{ justifyContent: 'center', padding: 10 }}>
                    <Text style={{ fontSize: 20 }}>Timesheet for {global.employeeInfo.First_Name} {global.employeeInfo.Last_Name}</Text>
                  </Grid>
                </CardSection>

                <CardSection>
                  <Grid style={{ justifyContent: 'center', padding: 10 }}>
                    <Text>
                      <Text style={{ fontWeight: 'bold' }}>Today's Date: </Text> {moment().format('dddd, MMMM D, YYYY')}
                    </Text>
                  </Grid>
                </CardSection>

                <CardSection>
                  <Grid style={{ justifyContent: 'center', padding: 10 }}>
                    <Text>
                      Hours charged today: <Text style={{ fontWeight: 'bold' }}>9</Text>
                    </Text>
                  </Grid>
                </CardSection>

                <CardSection>
                  <Grid style={{ justifyContent: 'center', padding: 10 }}>
                    <Text style={{ color: 'red', fontWeight: 'bold' }}>
                      Warning! Excessive hours today!
                    </Text>
                  </Grid>
                </CardSection>

              </Card>

              <Button
      					block
      					onPress={() => navigate('AddEntry')}
      					style={styles.addEntryButton}
			        >
					       <Text>Add Entry</Text>
			        </Button>

              <Button
        				block
        				onPress={() => navigate('SelectRecent')}
        				style={styles.selectRecentButton}
				      >
					        <Text>Select Recent</Text>
			        </Button>

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
    imageStyle: {
      imageOuter: {
        flexDirection: 'row'
      },
      imageInner: {
        flexShrink: 1,
        marginTop: (Platform.OS === 'ios') ? -18 : -16
      }
    },
    addEntryButton: {
      backgroundColor: '#007aff',
      marginHorizontal: 20,
  		marginTop: 60,
  		shadowColor: '#000',
  		shadowOffset: { width: 0, height: 2 },
  		shadowOpacity: 0.3,
  		shadowRadius: 2
    },
    selectRecentButton: {
      backgroundColor: '#007aff',
      marginHorizontal: 20,
  		marginTop: 25,
  		shadowColor: '#000',
  		shadowOffset: { width: 0, height: 2 },
  		shadowOpacity: 0.3,
  		shadowRadius: 2
    },
    centerContainter: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }
};
