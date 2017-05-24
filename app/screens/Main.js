import React, { Component } from 'react';
import { Image } from 'react-native';
import { Container, Content, Button, Text, Grid, Header, Left, Right, Body, Title } from 'native-base';
import myTheme from '../Themes/myTheme';

import { CardSection } from '../components/CardSection';
import { Card } from '../components/Card';

export default class Main extends Component {
  render() {
    const { navigate, goBack } = this.props.navigation;

    return (
      <Container>

          {/* Header */}
          <Header
            style={styles.headerStyle}
          >
            <Left>
              <Button
                transparent
                onPress={() => goBack(null)}
              >
                <Text style={styles.headerTextStyle}>Logout</Text>
              </Button>
            </Left>

            <Body>
              <Title style={styles.headerTextStyle}>Main</Title>
            </Body>

            <Right />

          </Header>
          {/* End of Header */}

          <Content theme={myTheme}>

              <Image
                style={styles.bannerStyle}
                source={require('../img/banner.png')}
                resizeMode="contain"
              />
              <Card>
                <CardSection>
                  <Grid style={{ justifyContent: 'center', padding: 10 }}>
                    <Text>
                      Timesheet for John Calderaio
                    </Text>
                  </Grid>
                </CardSection>

                <CardSection>
                  <Grid style={{ justifyContent: 'center', padding: 10 }}>
                    <Text>
                      Friday, May 19th 2017
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
    bannerStyle: {
        height: 40,
        flex: 1, 		//this will stretch it across the screen
        width: null,
    },
    headerStyle: {
  		backgroundColor: 'red'
  	},
  	headerTextStyle: {
  		color: '#FFF'
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
