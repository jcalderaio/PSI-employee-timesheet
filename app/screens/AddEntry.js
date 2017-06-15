import React, { Component } from 'react';
import { Text, Container, Content, Button, Grid, Header, Left, Right, Body, Title, View, Item, Input } from 'native-base';
import { Octicons } from '@expo/vector-icons';
import { observer } from 'mobx-react/native';
import ModalPicker from 'react-native-modal-picker';

// Import ONLY map from lodash (DELETE)
import { map } from 'lodash';

import authorizedJobStore from '../stores/AuthorizedJobStore';

@observer
export default class AddEntry extends Component {
  render() {
    const { goBack } = this.props.navigation;
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
						onPress={() => goBack(null)}
					>
						<Octicons name='x' size={23} style={{ color: '#FFF' }} />
					</Button>
				</Right>
			</Header>
			{/*End Header*/}

			{/*Body*/}
			<Content>

				{/*Select Client*/}
				<View style={{ paddingVertical: 30 }}>
					<Grid style={{ justifyContent: 'center', paddingBottom: 15 }}>
					  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Select a Client</Text>
					</Grid>

					<ModalPicker
						data={clientData}
						initValue='Clients'
						onChange={(value) => authorizedJobStore.setClientFilter(value.label)}
						style={{ paddingHorizontal: 35 }}
					/>
				</View>

				{/*Select Task*/}
				<View style={{ paddingBottom: 30 }}>
					<Grid style={{ justifyContent: 'center', paddingBottom: 15 }}>
					  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Select a Task</Text>
					</Grid>

					<ModalPicker
						data={taskData}
						initValue='Tasks'
						onChange={(value) => {
							authorizedJobStore.setTaskFilter(value.label);
							authorizedJobStore.jobNumber = null;
						}}
						style={{ paddingHorizontal: 35 }}
					/>
				</View>

				{/*Select Sub-Task*/}
				<View style={{ paddingBottom: 30 }}>
					<Grid style={{ justifyContent: 'center', paddingBottom: 15 }}>
					  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Select a Sub-Task</Text>
					</Grid>

					<ModalPicker
						data={subTaskData}
						initValue='Sub-Tasks'
						onChange={(value) => {
							authorizedJobStore.setSubTaskFilter(value.label);
							authorizedJobStore.setJobNumber();
						}}
						style={{ paddingHorizontal: 35 }}
					/>
				</View>

				<View style={{ paddingBottom: 30, flexDirection: 'row', paddingHorizontal: 5 }}>
					<Text style={{ fontSize: 18, fontWeight: 'bold' }}>Job Number: </Text>
                    <Text>{authorizedJobStore.jobNumber}</Text>
                </View>

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
	}
};
