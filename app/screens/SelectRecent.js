import React, { Component } from 'react';
import { Container, Content, Button, Grid, Header, Left, Right, Body, Title, H1 } from 'native-base';
import { Octicons } from '@expo/vector-icons';

export default class SelectRecent extends Component {
  render() {
    return (
        <Container>
			<Header
				style={styles.headerStyle}
			>
				<Left />
				<Body>
					<Title style={styles.headerTextStyle}>Select Recent</Title>
				</Body>
				<Right>
					<Button
						transparent
						onPress={() => this.props.navigation.goBack(null)}
					>
						<Octicons name='x' size={26} style={{ color: '#FFF' }} />
					</Button>
				</Right>
			</Header>
			<Content>
				<Grid style={{ justifyContent: 'center' }} >
					<H1>Select Recent screen</H1>
				</Grid>
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
};
