import React, { Component } from 'react';
import { Alert } from 'react-native';
import { Container, Content, Button, Grid, Row, Col, Header, Left, Right, Body, Title, Text, Spinner, View } from 'native-base';
import { Octicons } from '@expo/vector-icons';

// MobX
import { observer } from 'mobx-react/native';
import recentJobsStore from '../stores/RecentJobsStore';

// Import components
//import { RecentJobsTable } from '../components/RecentJobsTable';

@observer
export default class SelectRecent extends Component {
	componentWillMount() {
		recentJobsStore.fetchRecentJobs();
	}

	render() {
		const { navigate, goBack } = this.props.navigation;

		if (recentJobsStore.recentJobs === null) {
	      return (
	        <View style={styles.centerContainter}>
	          <Spinner size='large' />
	        </View>
	      );
	    }

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
					<Grid style={{ justifyContent: 'center', padding: 20 }}>
		              <Text style={{ fontSize: 18 }}>
		                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Charges from: </Text> Last 2 Weeks
		              </Text>
		            </Grid>

					{/*If No Recent Jobs*/}
					{(recentJobsStore.isEmpty) &&
						<Grid style={{ justifyContent: 'center', padding: 10, marginTop: 20 }}>
			              <Text style={{ fontWeight: 'bold', fontSize: 19 }}> You have no recent jobs!</Text>
			            </Grid>
					}

					{/*Start Table*/}
					{(!recentJobsStore.isEmpty) &&
						<Grid style={{ alignItems: 'center' }}>
					      <Row style={{ height: 30 }} >
					      {/*Table Labels*/}
					        <Col size={24} style={styles.tableStyle.title}>
					          <Text style={{ fontWeight: 'bold' }}>Job #</Text>
					        </Col>
					        <Col size={28} style={styles.tableStyle.title}>
					          <Text style={{ fontWeight: 'bold' }}>Client</Text>
					        </Col>
					        <Col size={31} style={styles.tableStyle.title}>
					          <Text style={{ fontWeight: 'bold' }}>Job Title</Text>
					        </Col>
					        <Col size={17} style={styles.tableStyle.titleLast}>
					          <Text style={{ fontWeight: 'bold' }}>Add</Text>
					        </Col>
					      </Row>
					      {/*Table Labels*/}
					      {recentJobsStore.recentJobs.map((item, i) =>
					        <Row style={{ minHeight: 50 }} key={i}>
					          <Col size={24} style={styles.tableStyle.body}>
					            <Text style={styles.tableStyle.bodyText}>{item.Job_Number}</Text>
					          </Col>
					          <Col size={28} style={styles.tableStyle.body}>
					            <Text style={styles.tableStyle.bodyText}>{item.Client_Name}</Text>
					          </Col>
					          <Col size={31} style={styles.tableStyle.body}>
					            <Text style={styles.tableStyle.bodyText}>{item.Sub_Task}</Text>
					          </Col>
					          <Col size={17} style={styles.tableStyle.bodyLast}>
					            <Text>L</Text>
					          </Col>
					        </Row>
					      )}
					    </Grid>
					}
					{/*End of Table*/}

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

					{/*DELETE - FOR TESTING*/}
					<Button
                        block
                        onPress={() => {
							recentJobsStore.addJob();
						    console.log(recentJobsStore.recentJobs);
					    }}
                        style={styles.addAllButton}>
						<Text>Add to Store</Text>
					</Button>
					{/*END DELETE - FOR TESTING*/}

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
	},
	centerContainter: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
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
		bodyText: {
			fontSize: 14
		}
	}
};
