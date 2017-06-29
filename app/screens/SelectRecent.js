import React, { Component } from 'react';
import { Alert } from 'react-native';
import { Container, Content, Button, Grid, Header, Left, Right, Body, Title, Text, View } from 'native-base';
import { Octicons } from '@expo/vector-icons';

// MobX
import { observer } from 'mobx-react/native';
import recentJobStore from '../stores/RecentJobStore';

// Import components
import { RecentJobsTable } from '../components/RecentJobsTable';

@observer
export default class SelectRecent extends Component {
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
                            onPress={() => {
								recentJobStore.clearChecks();
								goBack(null);
							}}
						>
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
					<Grid style={{ justifyContent: 'center', paddingVertical: 30 }}>
		              <Text style={{ fontSize: 18 }}>
		                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Charges from: </Text> Last 2 Weeks
		              </Text>
		            </Grid>

					{/*If error*/}
					{(recentJobStore.errorMessage) &&
						<Grid style={{ justifyContent: 'center', padding: 10, marginTop: 20 }}>
			              <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'red' }}>{recentJobStore.errorMessage}</Text>
			            </Grid>
					}

					{/*If No Recent Jobs*/}
					{(recentJobStore.isEmpty) &&
						<Grid style={{ justifyContent: 'center', padding: 10, marginTop: 20 }}>
			              <Text style={{ fontWeight: 'bold', fontSize: 18 }}> You have no recent jobs!</Text>
			            </Grid>
					}

					{/*Start Table*/}
					{(!recentJobStore.isEmpty) &&
						<RecentJobsTable data={recentJobStore.recentJobs} />
					}
					{/*End of Table*/}

					{/*Buttons*/}
					{(!recentJobStore.isEmpty) &&
						<View>
							<Button
		                        block
		                        onPress={() => recentJobStore.addRecent('Selected', navigate)}
		                        style={styles.addSelectedButton}>
								<Text>Add Selected</Text>
							</Button>

							<Button
		                        block
		                        onPress={() => recentJobStore.addRecent('All', navigate)}
		                        style={styles.addAllButton}>
								<Text>Add All</Text>
							</Button>
						</View>
					}

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
		marginBottom: 60
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
