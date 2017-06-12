import React, { Component } from 'react';
import { Text, Container, Content, Button, Grid, Header, Left, Right, Body, Title, H1 } from 'native-base';
import { Octicons } from '@expo/vector-icons';

import { CardSection } from '../components/CardSection';
import { Card } from '../components/Card';

export default class AddEntry extends Component {
    constructor(props) {
        super(props);
    }

  render() {
    const { goBack } = this.props.navigation;

    return (
        <Container>

			{/*Header*/}
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
			{/*End Header*/}

			{/*Body*/}
			<Content>
				{/*Heading*/}
				<Grid style={{ justifyContent: 'center', paddingVertical: 30 }}>
				  <Text style={{ fontSize: 18 }}>
					<Text style={{ fontWeight: 'bold', fontSize: 18 }}>Please, </Text>Add a New Entry
				  </Text>
				</Grid>

			</Content>
			{/*End Body*/}

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
