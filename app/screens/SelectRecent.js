import React, { Component } from 'react';
import { Container, Content, Button, Text, Grid, Header, Left, Right, Body, Title, H1 } from 'native-base';

export default class SelectRecent extends Component {
  render() {
    return (
        <Container>
			<Header>
				<Left />
				<Body>
					<Title>Select Recent</Title>
				</Body>
				<Right>
					<Button
						transparent
						onPress={() => this.props.navigation.goBack(null)}
					>
						<Text>Cancel</Text>
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
