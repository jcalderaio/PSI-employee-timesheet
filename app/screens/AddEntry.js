import React, { Component } from 'react';
import { Text, Container, Content, Button, Grid, Header, Left, Right, Body, Title, Picker } from 'native-base';
import { Octicons } from '@expo/vector-icons';
import { observer } from 'mobx-react/native';

// Import ONLY map from lodash (DELETE)
import { map } from 'lodash';

import authorizedJobStore from '../stores/AuthorizedJobStore';

const Item = Picker.Item;

@observer
export default class AddEntry extends Component {
	constructor(props) {
        super(props);
        this.state = {
            selectedClient: authorizedJobStore.clientNamesWithoutDupes[0]
        };
		authorizedJobStore.setClientFilter(this.state.selectedClient);
    }

	onValueChangeClient(value) {
        this.setState({
            selectedClient: value
        });
		authorizedJobStore.setClientFilter(value);
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

				<Text style={{ padding: 20, fontSize: 20 }}>Select Your Client</Text>
				{/*Client_Name Picker*/}
				<Picker
					style={{ borderWidth: 1, borderColor: 'black' }}
                    selectedValue={this.state.selectedClient}
                    onValueChange={this.onValueChangeClient.bind(this)}
				>
                    {map(authorizedJobStore.clientNamesWithoutDupes, (item, i) =>
						<Item label={item} value={item} key={i} />
					)}
				</Picker>

				<Text>{authorizedJobStore.clientFilter}</Text>


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
