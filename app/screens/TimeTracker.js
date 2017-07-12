import React, { Component } from 'react';
import { Alert } from 'react-native';
import { Container, Content, Button, Grid, Header, Left, Right, Body, Title, Text, View } from 'native-base';
import { Octicons } from '@expo/vector-icons';

// MobX
import { observer } from 'mobx-react/native';
import timeTrackerStore from '../stores/TimeTrackerStore';

// Import components
import { TimeTrackerTable } from '../components/TimeTrackerTable';

@observer
export default class TimeTracker extends Component {
	render() {
		const { goBack } = this.props.navigation;

		return (
			<Container>
				<Header style={styles.headerStyle}>
					<Left />
					<Body>
						<Title style={styles.headerTextStyle}>Time Tracker</Title>
					</Body>
					<Right>
						<Button
                            transparent
                            onPress={() => {
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
		                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>PSI </Text> Time Calculator
		              </Text>
		            </Grid>

					{/*Table*/}
					<TimeTrackerTable />

					{/*Buttons*/}
					<View style={{ marginTop: 60, marginBottom: 60 }}>
						{/*Button: "Update Charges"*/}
			            {(!timeTrackerStore.isEmpty && timeTrackerStore.hasUncommitted) &&
			              <View>
			                <Text style={{ color: 'red', fontSize: 16, textAlign: 'center', marginBottom: 10 }}>Rows in PINK are uncommitted. Click 'Update Charges' to commit.</Text>
			                <Button
			                   block
			                   onPress={() => timeTrackerStore.updateTimeTracker()}
			                   style={styles.updateTimeTrackerButton}
			                >
			                   <Text>Update Time Tracker</Text>
			                 </Button>
			              </View>
			  			}
						<Button
							block
							onPress={() => timeTrackerStore.resetAll()}
							style={styles.resetAllButton}>
							<Text>Reset All</Text>
						</Button>
					</View>
					{/*End Buttons*/}

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
	updateTimeTrackerButton: {
		backgroundColor: '#007aff',
		marginHorizontal: 20,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.3,
		shadowRadius: 2
	},
	resetAllButton: {
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
	centerContainter: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
  	}
};
