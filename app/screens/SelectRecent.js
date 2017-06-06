import React, { Component } from 'react';
import { Alert } from 'react-native';
import { Container, Content, Button, Grid, Header, Left, Right, Body, Title, Text } from 'native-base';
import { Octicons } from '@expo/vector-icons';

// Import components
import { RecentJobsTable } from '../components/RecentJobsTable';

export default class SelectRecent extends Component {
	constructor() {
		super();
		this.state = {
			recentJobs: global.recentJobs
		};
	}

	// Delete this function
	addObject = () => {
		global.recentJobs.push({"Job_Id": 666, "Job_Number": "98000-P-01", "Client_Name": "Parametric Solutions Inc.", "Task": "Personal", "Sub_Task": "General"});
		this.setState(this.state);
		//OR this.forceUpdate() (however, it's use is discouraged)
	}

	render() {
		const { navigate, goBack } = this.props.navigation;

		return (
			<Container>
				<Header style={styles.headerStyle}>
					<Left />
					<Body>
						<Title style={styles.headerTextStyle}>Select Recent</Title>
					</Body>
					<Right>
						<Button
                            transparent
                            onPress={() => goBack(null)}>
							<Octicons
                                name='x'
                                size={26}
                                style={{ color: '#FFF' }}
                            />
						</Button>
					</Right>
				</Header>
				<Content>
					{/*Heading*/}
					<Grid style={{ justifyContent: 'center', padding: 10 }}>
		              <Text>
		                <Text style={{ fontWeight: 'bold' }}>Charges from: </Text> Last 2 Weeks
		              </Text>
		            </Grid>

					{(this.state.recentJobs.length < 1) &&
						<Grid style={{ justifyContent: 'center', padding: 10, marginTop: 20 }}>
			              <Text>
			                You have no recent jobs!
			              </Text>
			            </Grid>
					}

					{(this.state.recentJobs.length > 0) &&
						<RecentJobsTable data={this.state.recentJobs} />
					}

					<Button
                        block
                        onPress={() => {
						    Alert.alert('Selected Charges Added', ' ');
							navigate('TodaysCharges');
					    }}
                        style={styles.addSelectedButton}>
						<Text>Add Selected</Text>
					</Button>

					<Button
                        block
                        onPress={() => {
						    Alert.alert('All Charges Added!', ' ');
						    navigate('TodaysCharges');
					    }}
                        style={styles.addAllButton}>
						<Text>Add All</Text>
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
	addSelectedButton: {
		backgroundColor: '#007aff',
		marginHorizontal: 20,
		marginTop: 50,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.3,
		shadowRadius: 2
	},
	addAllButton: {
		backgroundColor: '#007aff',
		marginHorizontal: 20,
		marginTop: 25,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.3,
		shadowRadius: 2,
		marginBottom: 40
	}
};
