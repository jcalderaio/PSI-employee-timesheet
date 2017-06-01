import React, { Component } from 'react';
import { Platform, Alert} from 'react-native';
import {
	Container,
	Content,
	Button,
	Grid,
	Col,
	Row,
	Header,
	Left,
	Right,
	Body,
	Title,
	Text,
	View
} from 'native-base';
import { Octicons } from '@expo/vector-icons';
import Table from 'react-native-simple-table';

const columns = [
	{
		title: 'Job #',
		dataIndex: 'Job_Number',
		width: 100
	}, {
		title: 'Client',
		dataIndex: 'Client_Name',
		width: 140
	}, {
		title: 'Job Title',
		dataIndex: 'Sub_Task'
	}, {
		title: 'Add'
	}
];

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
		const dataSource = this.state.recentJobs;

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

					<Grid style={{ alignItems: 'center' }}>
						<Row style={{ height: 50 }}>
							<Col size={27} style={styles.tableStyle.title}>
								<Text style={{ fontWeight: 'bold' }}>Job #</Text>
							</Col>
							<Col size={33} style={styles.tableStyle.title}>
								<Text style={{ fontWeight: 'bold' }}>Client</Text>
							</Col>
							<Col size={23} style={styles.tableStyle.title}>
								<Text style={{ fontWeight: 'bold' }}>Job Title</Text>
							</Col>
							<Col size={17} style={styles.tableStyle.titleLast}>
								<Text style={{ fontWeight: 'bold' }}>Add</Text>
							</Col>
						</Row>
						{this.state.recentJobs.map((jobs) => {
							return (
								<Row style={{ height: 50 }}>
									<Col size={27} style={styles.tableStyle.body}>
										<Text>{jobs.Job_Number}</Text>
									</Col>
									<Col size={33} style={styles.tableStyle.body}>
										<Text>{jobs.Client_Name}</Text>
									</Col>
									<Col size={23} style={styles.tableStyle.body}>
										<Text>{jobs.Sub_Task}</Text>
									</Col>
									<Col size={17} style={styles.tableStyle.bodyLast}>
										<Text>L</Text>
									</Col>
								</Row>
							);
						})}
					</Grid>

					{/*
					<View style={styles.container}>
						<Table
                            columnWidth={60}
                            columns={columns}
                            dataSource={dataSource}
                            key={dataSource.Job_Id}
                        />
					</View>
					*/}

					<Button
                        block
                        onPress={() => {
						    Alert.alert('Selected Charges Added', ' ');
							goBack('TodaysCharges');
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
	container: {},
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
		shadowRadius: 2
	},
	tableStyle: {
		title: {
			backgroundColor: '#a0a6ab',
			borderTopWidth: 1,
			borderBottomWidth: 1,
			borderRightWidth: 1,
			justifyContent: 'center',
			alignItems: 'center'
		},
		titleLast: {
			backgroundColor: '#a0a6ab',
			borderTopWidth: 1,
			borderBottomWidth: 1,
			justifyContent: 'center',
			alignItems: 'center'
		},
		body: {
			backgroundColor: '#fff',
			borderBottomWidth: 1,
			borderRightWidth: 1,
			justifyContent: 'center',
			alignItems: 'center'
		},
		bodyLast: {
			backgroundColor: '#fff',
			borderBottomWidth: 1,
			justifyContent: 'center',
			alignItems: 'center'
		},
	}
};
