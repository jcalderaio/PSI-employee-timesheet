import React, { Component } from 'react';
import { Container, Content, Button, Grid, Header, Left, Right, Body, Title, H1 } from 'native-base';
import { Octicons } from '@expo/vector-icons';

export default class AddEntry extends Component {
  render() {
    const { goBack } = this.props.navigation;

    return (
        <Container>
			<Header
				style={styles.headerStyle}
			>
				<Left />
				<Body>
					<Title style={styles.headerTextStyle}>Add Entry</Title>
				</Body>
				<Right>
					<Button
						transparent
						onPress={() => goBack(null)}
					>
						<Octicons name='x' size={23} style={{ color: '#FFF' }} />
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

const styles = {
	headerStyle: {
	backgroundColor: 'red'
	},
	headerTextStyle: {
		color: '#FFF'
	},
};
