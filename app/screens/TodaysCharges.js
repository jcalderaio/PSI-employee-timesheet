import React, { Component } from 'react';
import { Platform, Alert, Dimensions } from 'react-native';
import { Container, Content, Button, Text, Grid, Header, Body, Title, View, Spinner } from 'native-base';
import moment from 'moment';

// MobX
import { observer } from 'mobx-react/native';
import todaysJobStore from '../stores/TodaysJobStore';
import recentJobStore from '../stores/RecentJobStore';

// Import table component
import { TodaysJobsTable } from '../components/TodaysJobsTable';

// Variable that is half the height of the screen
const halfHeight = Dimensions.get('window').height / 4;

@observer
export default class TodaysCharges extends Component {
  render() {
      const { navigate } = this.props.navigation;

      if ((recentJobStore.recentJobs === null) || (todaysJobStore.todaysJobs == null)) {
        return (
          <View style={styles.centerContainter}>
            <Spinner size='large' />
            <Text style={{ marginTop: -7, color: '#0BD318' }}>LOADING</Text>
          </View>
        );
      }

    return (
      <Container>

          <Header
            style={styles.headerStyle}
          >
            <Body>
              <Title style={styles.headerTextStyle}>Today's Charges</Title>
            </Body>
          </Header>

          <Content>

            {/*Heading*/}
            <View style={{ paddingVertical: 30 }}>
              <Grid style={{ justifyContent: 'center' }}>
                <Text style={{ fontSize: 18, textAlign: 'center' }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Charges for Today:</Text> {moment().format('dddd, MMMM D, YYYY')}
                </Text>
              </Grid>
            </View>

            {/*If error*/}
  					{(todaysJobStore.errorMessage) &&
  						<Grid style={{ justifyContent: 'center', padding: 10, marginTop: 20 }}>
  			        <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'red' }}>{todaysJobStore.errorMessage}</Text>
  			      </Grid>
  					}

  					{/*If No Recent Jobs*/}
  					{(todaysJobStore.isEmpty) &&
              <View style={styles.centerContainter}>
    						<Grid style={{ justifyContent: 'center', marginTop: halfHeight }}>
    			        <Text style={{ fontWeight: 'bold', fontSize: 18 }}> You have no charges for today!</Text>
    			      </Grid>
              </View>
  					}

  					{/*Start TodaysJobs Table*/}
  					{(!todaysJobStore.isEmpty) &&
  						<TodaysJobsTable data={todaysJobStore.todaysJobs} />
  					}
  					{/*End of Table*/}

            {/*Directions*/}
            {(!todaysJobStore.isEmpty) &&
              <View style={{ paddingTop: 60 }}>
                <Grid style={{ justifyContent: 'center' }} >
                    <Text style={{ color: 'steelblue', fontSize: 16 }}>Tap on the 'Hours' column to make changes.</Text>
                </Grid>
                <Grid style={{ justifyContent: 'center' }} >
                    <Text style={{ color: 'steelblue', fontSize: 16 }}>Hint: Type '0' to delete charge.</Text>
                </Grid>
              </View>
  					}

            {/*Button: "Update Charges"*/}
            {(!todaysJobStore.isEmpty) &&
              <View style={{ marginTop: 60, marginBottom: 60 }}>
                {(todaysJobStore.hasUncommitted) &&
                    <Text style={{ color: 'red', fontSize: 16, textAlign: 'center', marginBottom: 10 }}>Rows in PINK are uncommitted. Click 'Update Charges' to commit.</Text>
                }
                <Button
                   block
                   onPress={() => {
                       Alert.alert(
                         'Charges Updated!',
                          ' '
                       );
                      navigate('TodaysCharges');
                   }}
                   style={styles.updateChargeButton}
                >
                   <Text>Update Charges</Text>
                 </Button>
              </View>
  					}


            {/* FOR DEBUGGING */}
            {/* Shows size of table (for DEBUGGING)*/}
            <Text>Size: {todaysJobStore.size}</Text>

            {(todaysJobStore.hasUncommitted) &&
              <Text>Has Uncommitted: true</Text>
            }
            {(!todaysJobStore.hasUncommitted) &&
              <Text>Has Uncommitted: false</Text>
            }
            {/* FOR DEBUGGING */}


          </Content>
      </Container>
    );
  }
}

const styles = {
    tableStyle: {
      height: (Platform.OS === 'ios') ? 165 : 170,
      flex: 1, 		//this will stretch it across the screen
      width: null,
    },
    headerStyle: {
  		backgroundColor: 'red'
  	},
  	headerTextStyle: {
  		color: '#FFF'
  	},
    updateChargeButton: {
      backgroundColor: '#007aff',
      marginHorizontal: 20,
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
