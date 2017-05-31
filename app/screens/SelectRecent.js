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

  // Delete this function
  addObject = () => {
	global.recentJobs.push({"Job_Id":666,"Job_Number":"98000-P-01","Client_Name":"Parametric Solutions Inc.","Task":"Personal","Sub_Task":"General"});
	this.setState(this.state);
	//OR this.forceUpdate() (however, it's use is discouraged)
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
					<H1>{this.state.recentJobs.map(n => n.Client_Name + ', ')}</H1>
				</Grid>

				{/*Delete this button*/}
				<Button
					block
					onPress={this.addObject}
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
