import React, { Component } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { Text, Container, Content, Button, Grid, Header, Left, Right, Body, Title, View, Input, Icon, Spinner } from 'native-base';
import { Octicons } from '@expo/vector-icons';
import { observer } from 'mobx-react/native';
import ModalPicker from 'react-native-modal-picker';

// Import ONLY map from lodash (DELETE)
import { map } from 'lodash';

// MobX
import authorizedJobStore from '../stores/AuthorizedJobStore';
import todaysJobStore from '../stores/TodaysJobStore';

// Add this to show that it will update the observables in the MobX stores
@observer
export default class AddEntry extends Component {
	constructor() {
		super();
		this.state = {
			selectedTask: '',
			selectedSubTask: '',
			selectedJobNumber: ''
		};
	}

	render() {
		// These are from React Navigation
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
	// Add data to jobNumberData from authorizedJobStore
	const jobNumberData = map(authorizedJobStore.jobNumberWithoutDupes, (item, i) => (
		{ key: i, label: item }
	));
	jobNumberData.unshift({ key: -4, section: true, label: 'Job Numbers' });

	if ((authorizedJobStore.loading)) {
	  return (
		<View style={styles.centerContainter}>
		  <Spinner size='large' />
		  <Text style={{ marginTop: -7, color: '#0BD318' }}>LOADING</Text>
		</View>
	  );
	}

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

				{(todaysJobStore.hasUncommitted) &&
	              <Text style={{ color: 'red', fontSize: 16, textAlign: 'center', padding: 10 }}>WARNING! You have uncommitted changes. Please go to the 'Today's Charges' tab and click the 'Update Charges' button. If you proceed with Adding a new Entry, your changes will be lost.</Text>
	            }

				{/* This moves the keyboard when I type anything into the hours box */}
				<KeyboardAvoidingView
					style={{ flex: 1 }}
					behavior='position'
				>

					{/*Select Client*/}
					<View style={{ paddingBottom: 25, paddingTop: 15 }}>
						<Grid style={{ justifyContent: 'center', paddingBottom: 10 }}>
						  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Select a Client</Text>
						</Grid>

						<ModalPicker
							ref='clientModal'
							data={clientData}
							initValue='Clients'
							onChange={(value) => {
								authorizedJobStore.clearAll();
								authorizedJobStore.setClientFilter(value.label);
								this.setState({ selectedTask: '' });
							}}
							style={{ paddingHorizontal: 35 }}
						/>
					</View>

					{/*Select Task*/}
					{(authorizedJobStore.clientFilter) &&
						<View style={{ paddingBottom: 25 }}>
							<Grid style={{ justifyContent: 'center', paddingBottom: 10 }}>
							  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Select a Task</Text>
							</Grid>

							<ModalPicker
								ref='taskModal'
								data={taskData}
								onChange={(value) => {
									authorizedJobStore.taskFilter = null;
						          	authorizedJobStore.subTaskFilter = null;
						          	authorizedJobStore.jobNumber = null;
						          	authorizedJobStore.hours = null;
									authorizedJobStore.setTaskFilter(value.label);
									this.setState({ selectedTask: value.label });
									this.setState({ selectedSubTask: '' });
								}}
								style={{ paddingHorizontal: 35 }}
							>
								{/*If selection above you just picked, then selection below you gets cleared*/}
								<View style={styles.selectionStyle}>
									<Text>{this.state.selectedTask === '' ? 'Tasks' : this.state.selectedTask}</Text>
								</View>
							</ModalPicker>
						</View>
					}

					{/*Select Sub-Task*/}
					{(authorizedJobStore.taskFilter) &&
						<View style={{ paddingBottom: 25 }}>
							<Grid style={{ justifyContent: 'center', paddingBottom: 10 }}>
							  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Select a Sub-Task</Text>
							</Grid>

							<ModalPicker
								ref='subTaskModal'
								data={subTaskData}
								onChange={(value) => {
									authorizedJobStore.subTaskFilter = null;
						          	authorizedJobStore.jobNumber = null;
						          	authorizedJobStore.hours = null;
									authorizedJobStore.setSubTaskFilter(value.label);
									this.setState({ selectedSubTask: value.label });
									this.setState({ selectedJobNumber: '' });
								}}
								style={{ paddingHorizontal: 35 }}
							>
								{/*If selection above you just picked, then selection below you gets cleared*/}
								<View style={styles.selectionStyle}>
									<Text>{this.state.selectedSubTask === '' ? 'Sub-Tasks' : this.state.selectedSubTask}</Text>
								</View>
							</ModalPicker>
						</View>
					}

					{/*Was for when number auto-filled if less than 1*/}
					{/*}
					{(authorizedJobStore.jobNumberSize === 1) &&
						<Grid style={{ flexDirection: 'row', justifyContent: 'center', paddingBottom: 25 }}>
							<Text style={{ fontSize: 18, fontWeight: 'bold' }}>Job Number: </Text>
							<Text style={styles.jobNumberBorder}>{authorizedJobStore.jobNumber}</Text>
						</Grid>
					} */}

					{/*Select Job Number*/}
					{(authorizedJobStore.subTaskFilter) &&
						<View style={{ paddingBottom: 25 }}>
							<Grid style={{ justifyContent: 'center', paddingBottom: 10 }}>
							  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Select a Job Number</Text>
							</Grid>

							<ModalPicker
								ref='jobNoModal'
								data={jobNumberData}
								onChange={(value) => {
									authorizedJobStore.jobNumber = null;
									authorizedJobStore.hours = null;
									authorizedJobStore.setJobNumber(value.label);
									this.setState({ selectedJobNumber: value.label });
								}}
								style={{ paddingHorizontal: 35 }}
							>
								{/*If selection above you just picked, then selection below you gets cleared*/}
								<View style={styles.selectionStyle}>
									<Text>{this.state.selectedJobNumber === '' ? 'Job Numbers' : this.state.selectedJobNumber}</Text>
								</View>
							</ModalPicker>
						</View>
					}

					{/*Select Hours*/}
					{(authorizedJobStore.jobNumber) &&
						<Grid style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 25 }}>
							<Icon
								active
								name='timer'
								style={{ paddingRight: 5 }}
							/>
							<Text style={{ fontSize: 18, fontWeight: 'bold' }}>Hours: </Text>
							<View>
								<Input
									style={styles.hoursEntryBorder}
									value={authorizedJobStore.hours}
									onChangeText={value => {
										authorizedJobStore.hours = null;
										authorizedJobStore.setHours(value.trim());
									}}
									returnKeyType='send'
									keyboardType='numeric'
									maxLength={6}
									onSubmitEditing={() => authorizedJobStore.addEntry(navigate)}
								/>
							</View>
						</Grid>
					}

					{/*Add Charge Button*/}
					{(authorizedJobStore.hours !== null && authorizedJobStore.hours !== '' && !isNaN(authorizedJobStore.hours)) &&
						<Button
			               block
						   style={styles.addChargeButton}
			               onPress={() => authorizedJobStore.addEntry(navigate)}
			            >
			               <Text>Add Charge</Text>
			            </Button>
					}


					{/*Directions*/}
					{(authorizedJobStore.hours === null || authorizedJobStore.hours === '' || isNaN(authorizedJobStore.hours)) &&
						<View style={{ paddingHorizontal: 35, marginBottom: 60 }}>
						  <Grid style={{ justifyContent: 'center' }} >
							  <Text style={{ color: 'steelblue', fontSize: 16, textAlign: 'center' }}>Click the bottom-most field and make a selection to reveal the next one.</Text>
						  </Grid>
						</View>
					}

				</KeyboardAvoidingView>

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
  	  shadowRadius: 2,
	  marginBottom: 60
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
		height: 20,
		width: 50
	},
	centerContainter: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
  	},
  	selectionStyle: {
		flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
		borderColor: '#ccc',
        borderWidth: 1,
        padding: 8,
        borderRadius: 5
	}
};
