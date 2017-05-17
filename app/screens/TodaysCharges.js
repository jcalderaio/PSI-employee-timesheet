import React, { Component } from 'react';
import { Image } from 'react-native';
import { Container, Content, Button, Text, Grid, Header, Left, Right, Body, Title, H1 } from 'native-base';

export default class TodaysCharges extends Component {
  render() {
    return (
      <Container>

          <Header>
            <Body style={{ justifyContent: 'center' }}>
              <Title>Today's Charges</Title>
            </Body>
          </Header>

          <Content>
            <Grid style={{ justifyContent: 'center' }} >
    					<H1>Today's Charges</H1>
    				</Grid>
          </Content>
      </Container>
    );
  }
}

const styles = {
    bannerStyle: {
        height: 45,
        flex: 1, 		//this will stretch it across the screen
        width: null,
    },
    addEntryButton: {
      marginHorizontal: 20,
  		marginTop: 60,
  		shadowColor: '#000',
  		shadowOffset: { width: 0, height: 2 },
  		shadowOpacity: 0.3,
  		shadowRadius: 2
    },
    selectRecentButton: {
      marginHorizontal: 20,
  		marginTop: 25,
  		shadowColor: '#000',
  		shadowOffset: { width: 0, height: 2 },
  		shadowOpacity: 0.3,
  		shadowRadius: 2
    }
};
