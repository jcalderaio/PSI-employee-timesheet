import React, { Component } from 'react';
import { Platform, Alert } from 'react-native';
import { Container, Content, Button, Text, Grid, Header, Body, Title, View, Spinner } from 'native-base';
import moment from 'moment';

// MobX
import { observer } from 'mobx-react/native';
import todaysJobStore from '../stores/TodaysJobStore';
import recentJobStore from '../stores/RecentJobStore';

// Import components
import { TodaysJobsTable } from '../components/TodaysJobsTable';

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
                <Text style={{ fontSize: 18 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Charges for Today: </Text> {moment().format('dddd, MMMM D, YYYY')}
                </Text>
              </Grid>
              <Grid style={{ justifyContent: 'center', paddingTop: 10 }} >
                  <Text style={{ color: 'red', fontSize: 16 }}>ALWAYS Update after changing ANYTHING!</Text>
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
  						<Grid style={{ justifyContent: 'center', padding: 10, marginTop: 20 }}>
  			              <Text style={{ fontWeight: 'bold', fontSize: 18 }}> You have no charges for today!</Text>
  			            </Grid>
  					}

  					{/*Start Table*/}
  					{(!todaysJobStore.isEmpty) &&
  						<TodaysJobsTable data={todaysJobStore.todaysJobs} />
  					}
  					{/*End of Table*/}


            <View style={{ paddingTop: 60 }}>
              <Grid style={{ justifyContent: 'center' }} >
                  <Text style={{ color: 'steelblue', fontSize: 16 }}>Tap on the 'Hours' column to make changes.</Text>
              </Grid>
              <Grid style={{ justifyContent: 'center' }} >
                  <Text style={{ color: 'steelblue', fontSize: 16 }}>Hint: Type '0' to delete charge.</Text>
              </Grid>
            </View>

            {/*Button: "Update Charges"*/}
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

             <Text>Size: {todaysJobStore.size}</Text>

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
  		shadowRadius: 2,
      marginTop: 60,
      marginBottom: 60
    },
    centerContainter: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
  	},
};
