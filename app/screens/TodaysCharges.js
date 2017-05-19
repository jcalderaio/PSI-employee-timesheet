import React, { Component } from 'react';
import { Image } from 'react-native';
import { Container, Content, Button, Text, Grid, Header, Left, Right, Body, Title, H1, View } from 'native-base';

export default class TodaysCharges extends Component {
  render() {
    return (
      <Container style={{ flex: 1 }}>

          <Header>
            <Body style={{ justifyContent: 'center' }}>
              <Title>Today's Charges</Title>
            </Body>
          </Header>

          <Content>

            <Image
              style={styles.tableStyle}
              source={require('../img/table.png')}
              resizeMode="contain"
            />

            <Button
               block
               onPress={() => {
                 alert('Charges Added!');
                 this.props.navigation.navigate('Today\'s Charges');
               }}
               style={styles.addChargeButton}
            >
               <Text>Add Entry</Text>
             </Button>

            <View style={styles.footer}>
              <Grid style={{ justifyContent: 'center', alignItems: 'flex-end' }} >
                  <Text style={{ color: 'steelblue', fontSize: 16 }}>Tap on the 'Hours' column to make changes.</Text>
              </Grid>
              <Grid style={{ justifyContent: 'center', alignItems: 'flex-end' }} >
                  <Text style={{ color: 'steelblue', fontSize: 16 }}>Hint: Type '0' to delete charge.</Text>
              </Grid>
            </View>


          </Content>
      </Container>
    );
  }
}

const styles = {
    tableStyle: {
        height: 165,
        flex: 1, 		//this will stretch it across the screen
        width: null,
    },
    footer: {
    	position: 'absolute',
    	left: 0,
    	right: 0,
    	top: 500,
    	alignItems: 'center'
    },
    addChargeButton: {
      marginHorizontal: 20,
  		marginTop: 160,
  		shadowColor: '#000',
  		shadowOffset: { width: 0, height: 2 },
  		shadowOpacity: 0.3,
  		shadowRadius: 2
    }
};
