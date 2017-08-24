import React, { Component } from 'react';
import { Image, Platform, Alert } from 'react-native';
import { Container, Content, Button, Text, Grid, Header, Left, Right, Body, Title, View, Spinner, Row, Col } from 'native-base';
import moment from 'moment';
import { observer } from 'mobx-react/native';
import { SimpleLineIcons } from '@expo/vector-icons';
import { CardSection } from '../components/CardSection';
import { Card } from '../components/Card';
import { scale } from '../components/HelperFunctions';

//MobX
import userStore from '../stores/UserStore';
import todaysJobStore from '../stores/TodaysJobStore';
import recentJobStore from '../stores/RecentJobStore';
import authorizedJobStore from '../stores/AuthorizedJobStore';
import timeTrackerStore from '../stores/TimeTrackerStore';

// If true, fetch info from store, if false DONT
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

              {/*Begin Info Card*/}
              <Card>
                {/*Display Fname + Lname*/}
                <CardSection>
                  <Grid style={styles.gridStyle}>
                    <Text style={{ fontStyle: 'italic', fontSize: global.LARGE_TEXT }}>
                      {userStore.employeeInfo.First_Name} {userStore.employeeInfo.Last_Name}
                    </Text>
                  </Grid>
                </CardSection>

                {/*Display Date*/}
                <CardSection>
                  <Grid style={styles.gridStyle}>
                    <Text style={{ fontSize: global.MEDIUM_TEXT }}>
                      <Text style={{ fontWeight: 'bold', fontSize: global.MEDIUM_TEXT }}>Today's Date: </Text> {moment().format('dddd, MMMM D, YYYY')}
                    </Text>
                  </Grid>
                </CardSection>

                {/*Display Tracked Hours, Charged Hours*/}
                <CardSection>
                  <Grid style={styles.gridStyle}>
                    <Row>
                        <Col>
                            <Text style={{ fontSize: global.MEDIUM_TEXT }}>
                              Tracked Hours: <Text style={{ fontWeight: 'bold', fontSize: global.MEDIUM_TEXT }}>{timeTrackerStore.totalHours}</Text>
                            </Text>
                        </Col>
                        <Col>
                            <Text style={{ fontSize: global.MEDIUM_TEXT }}>
                              Charged Hours: <Text style={{ fontWeight: 'bold', fontSize: global.MEDIUM_TEXT }}>{todaysJobStore.totalHours}</Text>
                            </Text>
                        </Col>
                    </Row>
                  </Grid>
                </CardSection>

                {/*Display QTD Worked + QTD Required*/}
                <CardSection>
                  <Grid style={styles.gridStyle}>
                    <Row>
                        <Col>
                            <Text style={{ fontSize: global.MEDIUM_TEXT }}>
                              QTD Required: <Text style={{ fontWeight: 'bold', fontSize: global.MEDIUM_TEXT }}>{userStore.ptoFlexInfo.QTD_Required}</Text>
                            </Text>
                        </Col>
                        <Col>
                            <Text style={{ fontSize: global.MEDIUM_TEXT }}>
                              QTD Worked: <Text style={{ fontWeight: 'bold', fontSize: global.MEDIUM_TEXT }}>{userStore.ptoFlexInfo.QTD_Sum}</Text>
                            </Text>
                        </Col>
                    </Row>
                  </Grid>
                </CardSection>

                {/*Display QTD Worked + QTD Required*/}
                <CardSection>
                  <Grid style={styles.gridStyle}>
                    <Row>
                        <Col>
                            <Text style={{ fontSize: global.MEDIUM_TEXT }}>
                              PTO Balance: <Text style={{ fontWeight: 'bold', fontSize: global.MEDIUM_TEXT }}>{userStore.ptoFlexInfo.PTO_Balance}</Text>
                            </Text>
                        </Col>
                        <Col>
                            <Text style={{ fontSize: global.MEDIUM_TEXT }}>
                              Flex Balance: <Text style={{ fontWeight: 'bold', fontSize: global.MEDIUM_TEXT }}>{userStore.ptoFlexInfo.Flex_Balance}</Text>
                            </Text>
                        </Col>
                    </Row>
                  </Grid>
                </CardSection>

                {/*Display a warning if todays hours >= 24*/}
                {(todaysJobStore.totalHours >= 24) &&
                    <CardSection>
                      <Grid style={styles.gridStyle}>
                        <Text style={{ color: 'red', fontWeight: 'bold', fontSize: global.MEDIUM_TEXT }}>
                          Warning! Excessive hours today!
                        </Text>
                      </Grid>
                    </CardSection>
                }

              </Card>
              {/*End Info Card*/}

              <View style={{ marginBottom: 25 }}>
                  <Button
          			block
          			onPress={() => navigate('AddEntry')}
          			style={styles.addEntryButton}
    		      >
    					<Text style={{ fontSize: global.MEDIUM_TEXT }}>Add Entry</Text>
    			  </Button>

                  <Button
            		block
            		onPress={() => navigate('SelectRecent')}
            		style={styles.selectRecentButton}
    			  >
    					<Text style={{ fontSize: global.MEDIUM_TEXT }}>Select Recent</Text>
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
  		marginTop: (Platform.OS === 'ios') ? scale(50) : scale(25),
  		shadowColor: '#000',
  		shadowOffset: { width: 0, height: 2 },
  		shadowOpacity: 0.3,
  		shadowRadius: 2
    },
    selectRecentButton: {
      backgroundColor: '#007aff',
      marginHorizontal: 20,
  		marginTop: (Platform.OS === 'ios') ? scale(25) : scale(17),
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
    gridStyle: {
      justifyContent: 'center', padding: scale(10)
    }
};
