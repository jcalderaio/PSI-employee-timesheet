import React, { Component } from 'react';
import { Image, Platform } from 'react-native';
import { Container, Content, Button, Text, Grid, Header, Body, Title, View } from 'native-base';
import moment from 'moment';

export default class TodaysCharges extends Component {
  render() {
      const { navigate, goBack, state } = this.props.navigation;
      const { First_Name, Last_Name, Employee_No } = state.params.data;

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

            {/*Todays Date*/}
            <Grid style={{ justifyContent: 'center', padding: 10 }}>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>Charges for Today: </Text> {moment().format('dddd, MMMM D, YYYY')}
              </Text>
            </Grid>

            {/*Charges Table*/}
            <Image
              style={styles.tableStyle}
              source={require('../img/table.png')}
              resizeMode="contain"
            />

            {/*Charges Table*/}
            <View style={{ top: 50 }}>
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
                 alert('Charges Updated!');
                 navigate('Today\'s Charges');
               }}
               style={styles.updateChargeButton}
            >
               <Text>Update Charges</Text>
             </Button>

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
    footer: {
    	position: 'absolute',
    	left: 0,
    	right: 0,
    	top: 500,
    	alignItems: 'center'
    },
    updateChargeButton: {
      backgroundColor: '#007aff',
      marginHorizontal: 20,
  		marginTop: 160,
  		shadowColor: '#000',
  		shadowOffset: { width: 0, height: 2 },
  		shadowOpacity: 0.3,
  		shadowRadius: 2
    }
};
