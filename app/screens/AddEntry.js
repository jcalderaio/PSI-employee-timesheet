import React, { Component } from 'react';
import { Container, Content, Button, Text, Grid, Header, Left, Right, Body, Title, H1 } from 'native-base';

export default class AddEntry extends Component {
  render() {
    const { goBack } = this.props.navigation;

    return (
        <Container>
			<Header>
				<Left />
				<Body>
					<Title>Add Entry</Title>
				</Body>
				<Right>
					<Button
						transparent
						onPress={() => goBack(null)}
					>
						<Text>Cancel</Text>
					</Button>
				</Right>
			</Header>
			<Content>
				<Grid style={{ justifyContent: 'center' }} >
					<H1>Add Entry screen</H1>
				</Grid>
			</Content>
		</Container>
    );
  }
}
