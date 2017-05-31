import React, { Component } from 'react';
import { Container, Content, Button, Grid, Header, Left, Right, Body, Title, H1, Text } from 'native-base';
import { Octicons } from '@expo/vector-icons';

export default class SelectRecent extends Component {
  constructor() {
	super();
	this.state = {
		recentJobs: global.recentJobs
	};
  }

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
					<H1>{this.state.recentJobs[0].Client_Name}</H1>
				</Grid>

				<Button
					block
					onpress={() => this.setState({ recentJobs: global.recentJobs.push( {"Job_Id":13,"Job_Number":"98000-P-01","Client_Name":"Parametric Solutions Inc.","Task":"Personal","Sub_Task":"General"} )})}
				>
					<Text>Add More</Text>
				</Button>
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
