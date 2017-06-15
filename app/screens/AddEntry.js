import React, { Component } from 'react';
import { Alert } from 'react-native';
import { Text, Container, Content, Button, Grid, Header, Left, Right, Body, Title, View, Item, Input, Icon, Label } from 'native-base';
import { Octicons, Ionicons } from '@expo/vector-icons';
import { observer } from 'mobx-react/native';
import ModalPicker from 'react-native-modal-picker';

// Import ONLY map from lodash (DELETE)
import { map } from 'lodash';

import authorizedJobStore from '../stores/AuthorizedJobStore';

@observer
export default class AddEntry extends Component {
	render() {
    const { goBack, navigate } = this.props.navigation;
	// Add data to clientData from authorizedJobStore
	const clientData = map(authorizedJobStore.clientNamesWithoutDupes, (item, i) => (
		{ key: i, label: item }
	));
	clientData.unshift({ key: -1, section: true, label: 'Clients' });

	// Add data to taskData from authorizedJobStore
	const taskData = map(authorizedJobStore.tasksWithoutDupes, (item, i) => (
		{ key: i, label: item }
	));
	taskData.unshift({ key: -2, section: true, label: 'Tasks' });

	// Add data to subTaskData from authorizedJobStore
	const subTaskData = map(authorizedJobStore.subTasksWithoutDupes, (item, i) => (
		{ key: i, label: item }
	));
	subTaskData.unshift({ key: -3, section: true, label: 'Sub-Tasks' });

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
						onPress={() => {
							authorizedJobStore.clearAll();
							goBack(null);
						}}
					>
						<Octicons name='x' size={23} style={{ color: '#FFF' }} />
					</Button>
				</Right>
			</Header>
			{/*End Header*/}

			{/*Body*/}
			<Content>

				{/*Select Client*/}
				<View style={{ paddingBottom: 25 }}>
					<Grid style={{ justifyContent: 'center', paddingBottom: 15 }}>
					  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Select a Client</Text>
					</Grid>

					<ModalPicker
						ref='clientModal'
						data={clientData}
						initValue='Clients'
						onChange={(value) => {
							authorizedJobStore.clearAll();
							authorizedJobStore.setClientFilter(value.label);
						}}
						style={{ paddingHorizontal: 35 }}
					/>
				</View>

				{/*Select Task*/}
				{(authorizedJobStore.clientFilter) &&
					<View style={{ paddingBottom: 25 }}>
						<Grid style={{ justifyContent: 'center', paddingBottom: 15 }}>
						  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Select a Task</Text>
						</Grid>

						<ModalPicker
							ref='taskModal'
							data={taskData}
							initValue='Tasks'
							onChange={(value) => {
								authorizedJobStore.taskFilter = null;
					          	authorizedJobStore.subTaskFilter = null;
					          	authorizedJobStore.jobNumber = null;
					          	authorizedJobStore.hours = null;
								authorizedJobStore.setTaskFilter(value.label);
							}}
							style={{ paddingHorizontal: 35 }}
						/>
					</View>
				}

				{/*Select Sub-Task*/}
				{(authorizedJobStore.taskFilter) &&
					<View style={{ paddingBottom: 25 }}>
						<Grid style={{ justifyContent: 'center', paddingBottom: 15 }}>
						  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Select a Sub-Task</Text>
						</Grid>

						<ModalPicker
							ref='subTaskModal'
							data={subTaskData}
							initValue='Sub-Tasks'
							onChange={(value) => {
								authorizedJobStore.subTaskFilter = null;
					          	authorizedJobStore.jobNumber = null;
					          	authorizedJobStore.hours = null;
								authorizedJobStore.setSubTaskFilter(value.label);
								authorizedJobStore.setJobNumber();
							}}
							style={{ paddingHorizontal: 35 }}
						/>
					</View>
				}

				{/*Job Number (pre-filled)*/}
				{(authorizedJobStore.jobNumber) &&
					<Grid style={{ flexDirection: 'row', justifyContent: 'center', paddingBottom: 25 }}>
						<Text style={{ fontSize: 18, fontWeight: 'bold' }}>Job Number: </Text>
						<Text style={styles.jobNumberBorder}>{authorizedJobStore.jobNumber}</Text>
					</Grid>
				}

				{/*Select Hours*/}
				{(authorizedJobStore.jobNumber) &&
					<Grid style={{ flexDirection: 'row', justifyContent: 'center', paddingBottom: 25 }}>
						<Icon
							active
							name='timer'
							style={{ paddingRight: 3 }}
						/>
						<Text style={{ fontSize: 18, fontWeight: 'bold' }}>Hours: </Text>
						<View>
							<Input
								style={styles.hoursEntryBorder}
								value={authorizedJobStore.hours}
								onChangeText={value => authorizedJobStore.setHours(value)}
								returnKeyType='send'
								keyboardType='numeric'
								onSubmitEditing={() => {
									Alert.alert(
		 		                     'Charge Added!',
		 		                      ' '
		 		                   );
								   authorizedJobStore.addEntry();
				                   navigate('TodaysCharges');
								}}
							/>
						</View>
					</Grid>
				}

				{/*Add Charge Button*/}
				{(authorizedJobStore.jobNumber) &&
					<Button
		               block
					   style={styles.addChargeButton}
		               onPress={() => {
		                   Alert.alert(
		                     'Charge Added!',
		                      ' '
		                   );
						   authorizedJobStore.addEntry();
		                   navigate('TodaysCharges');
		               }}
		            >
		               <Text>Add Charge</Text>
		            </Button>
				}

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
	outerContainer: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-around'
	},
	innerContainer: {
		flex: 1
	},
	addChargeButton: {
      backgroundColor: '#007aff',
      marginHorizontal: 20,
  		shadowColor: '#000',
  		shadowOffset: { width: 0, height: 2 },
  		shadowOpacity: 0.3,
  		shadowRadius: 2
  	},
	jobNumberBorder: {
		backgroundColor: '#a0a6ab',
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 18
	},
	hoursEntryBorder: {
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 18,
		height: 25,
		width: 50
	}

};
