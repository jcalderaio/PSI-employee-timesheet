import React, { Component } from 'react';
import { Text, Container, Content, Button, Grid, Header, Left, Right, Body, Title } from 'native-base';
import { Octicons } from '@expo/vector-icons';

// Import ONLY map from lodash (DELETE)
import { map, uniq } from 'lodash';

import authorizedJobStore from '../stores/AuthorizedJobStore';

export default class AddEntry extends Component {
  // DELETE
  componentWillMount() {
	this.renderJobsNoDupes();
  }
  // DELETE
  renderJobsNoDupes() {
	// JSON to array with property you want
    const clientNamesWithoutDupes = uniq(map(authorizedJobStore.authorizedJobs, 'Client_Name'));
  }

  render() {
    const { goBack } = this.props.navigation;

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
				{/*Heading*/}
				<Grid style={{ justifyContent: 'center', paddingVertical: 30 }}>
				  <Text style={{ fontSize: 18 }}>
					Please, Add a New Entry
				  </Text>
				</Grid>

				{/*Example of how to use lodash
				<Text>{map(authorizedJobStore.authorizedJobs, (item) => {
					return item.Client_Name;
				})}</Text> */}

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
};
