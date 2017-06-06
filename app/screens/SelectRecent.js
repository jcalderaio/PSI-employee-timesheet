import React, { Component } from 'react';
import { Alert } from 'react-native';
import { Container, Content, Button, Grid, Header, Left, Right, Body, Title, Text, Spinner, View } from 'native-base';
import { Octicons } from '@expo/vector-icons';

// MobX
import { observer } from 'mobx-react/native';
import recentJobsStore from '../stores/RecentJobsStore';

// Import components
import { RecentJobsTable } from '../components/RecentJobsTable';

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
					<Grid style={{ justifyContent: 'center', padding: 10 }}>
		              <Text>
		                <Text style={{ fontWeight: 'bold' }}>Charges from: </Text> Last 2 Weeks
		              </Text>
		            </Grid>

					{(recentJobsStore.isEmpty) &&
						<Grid style={{ justifyContent: 'center', padding: 10, marginTop: 20 }}>
			              <Text style={{ fontWeight: 'bold', fontSize: 19 }}> You have no recent jobs!</Text>
			            </Grid>
					}

					{(!recentJobsStore.isEmpty) &&
						<RecentJobsTable data={recentJobsStore.recentJobs} />
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
	},
	centerContainter: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }
};
