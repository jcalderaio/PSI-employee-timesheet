import React, { Component } from 'react';
import { Image, Platform, Alert } from 'react-native';
import { Container, Content, Button, Text, Grid, Header, Left, Right, Body, Title, View, Spinner, Row, Col } from 'native-base';
import moment from 'moment';
import { observer } from 'mobx-react/native';
import { SimpleLineIcons } from '@expo/vector-icons';
import { CardSection } from '../components/CardSection';
import { Card } from '../components/Card';

//MobX
import userStore from '../stores/UserStore';
import todaysJobStore from '../stores/TodaysJobStore';
import recentJobStore from '../stores/RecentJobStore';
import authorizedJobStore from '../stores/AuthorizedJobStore';
import timeTrackerStore from '../stores/TimeTrackerStore';

let flag = true;

@observer
export default class Main extends Component {
    componentWillMount() {
        // Only fetch initial jobs on first launch
        if (flag) {
            todaysJobStore.fetchTodaysJobs();
            recentJobStore.fetchRecentJobs();
            authorizedJobStore.fetchAuthorizedJobs();
            timeTrackerStore.fetchTimeTracker();
            userStore.fetchPtoFlexInfo();
            flag = false;
        }
    }

 render() {
    const { navigate, goBack } = this.props.navigation;

    //Needs to refresh every time screen is shown

    // For testing purposes
    //console.log('Todays Jobs:', todaysJobStore.todaysJobs);
    //console.log('Recent Jobs:', recentJobStore.recentJobs);

    if ((recentJobStore.recentJobs === null) || (todaysJobStore.todaysJobs === null) || (recentJobStore.timeTrackerList === null) || (userStore.ptoFlexInfo === null)) {
      return (
        <View style={styles.centerContainter}>
          <Spinner size='large' />
          <Text style={{ marginTop: -7, color: '#0BD318' }}>LOADING</Text>
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
                onPress={() => {
                    userStore.loggedIn = false;
                    Alert.alert(
                      'Logout?',
                       ' ',
                       [
                         { text: 'Cancel', onPress: () => console.log('Cancel Pressed!') },
                         { text: 'OK',
                         onPress: () => {
                             flag = true;
                             goBack(null);
                         } },
                       ]
                    );
                }}
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
                {/*Display Fname + Lname*/}
                <CardSection>
                  <Grid style={{ justifyContent: 'center', padding: 10 }}>
                    <Text>
                      <Text style={{ fontWeight: 'bold' }}>Name: </Text>
                      {userStore.employeeInfo.First_Name} {userStore.employeeInfo.Last_Name}
                    </Text>
                  </Grid>
                </CardSection>

                {/*Display Date*/}
                <CardSection>
                  <Grid style={{ justifyContent: 'center', padding: 10 }}>
                    <Text>
                      <Text style={{ fontWeight: 'bold' }}>Today's Date: </Text> {moment().format('dddd, MMMM D, YYYY')}
                    </Text>
                  </Grid>
                </CardSection>

                {/*Display Tracked Hours, Charged Hours*/}
                <CardSection>
                  <Grid style={{ justifyContent: 'center', padding: 10 }}>
                    <Row>
                        <Col>
                            <Text>
                              Tracked Hours: <Text style={{ fontWeight: 'bold' }}>{timeTrackerStore.totalHours}</Text>
                            </Text>
                        </Col>
                        <Col>
                            <Text>
                              Charged Hours: <Text style={{ fontWeight: 'bold' }}>{todaysJobStore.totalHours}</Text>
                            </Text>
                        </Col>
                    </Row>
                  </Grid>
                </CardSection>

                {/*Display QTD Worked + QTD Required*/}
                <CardSection>
                  <Grid style={{ justifyContent: 'center', padding: 10 }}>
                    <Row>
                        <Col>
                            <Text>
                              QTD Worked: <Text style={{ fontWeight: 'bold' }}>{userStore.ptoFlexInfo.QTD_Sum}</Text>
                            </Text>
                        </Col>
                        <Col>
                            <Text>
                              QTD Required: <Text style={{ fontWeight: 'bold' }}>{userStore.ptoFlexInfo.QTD_Required}</Text>
                            </Text>
                        </Col>
                    </Row>
                  </Grid>
                </CardSection>

                {/*Display QTD Worked + QTD Required*/}
                <CardSection>
                  <Grid style={{ justifyContent: 'center', padding: 10 }}>
                    <Row>
                        <Col>
                            <Text>
                              PTO Balance: <Text style={{ fontWeight: 'bold' }}>{userStore.ptoFlexInfo.PTO_Balance}</Text>
                            </Text>
                        </Col>
                        <Col>
                            <Text>
                              Flex Balance: <Text style={{ fontWeight: 'bold' }}>{userStore.ptoFlexInfo.Flex_Balance}</Text>
                            </Text>
                        </Col>
                    </Row>
                  </Grid>
                </CardSection>

                {/*Display a warning if todays hours >= 24*/}
                {(todaysJobStore.totalHours >= 24) &&
                    <CardSection>
                      <Grid style={{ justifyContent: 'center', padding: 10 }}>
                        <Text style={{ color: 'red', fontWeight: 'bold' }}>
                          Warning! Excessive hours today!
                        </Text>
                      </Grid>
                    </CardSection>
                }

              </Card>

              <View style={{ marginBottom: 60 }}>
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
    timeTrackerButton: {
      backgroundColor: '#007aff',
      marginHorizontal: 20,
  		marginTop: 25,
        marginBottom: 30,
  		shadowColor: '#000',
  		shadowOffset: { width: 0, height: 2 },
  		shadowOpacity: 0.3,
  		shadowRadius: 2
    },
    centerContainter: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
  	},
};
