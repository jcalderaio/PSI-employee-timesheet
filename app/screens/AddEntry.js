import React, { Component } from 'react';
import { Text, Container, Content, Button, Grid, Header, Left, Right, Body, Title, H1 } from 'native-base';
import { Octicons } from '@expo/vector-icons';

import { CardSection } from '../components/CardSection';
import { Card } from '../components/Card';

export default class AddEntry extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: global.count
        };
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

				{/*Top Label*/}
				<Grid style={{ justifyContent: 'center' }} >
					<H1>Add Entry screen</H1>
				</Grid>

				{/*Global Holder*/}
                <Card>
                    <CardSection>
                      <Grid style={{ justifyContent: 'center', padding: 10 }}>
                        <Text>
                          {this.state.count}
                        </Text>
                      </Grid>
                    </CardSection>
                </Card>

				<Button
					block
					onPress={() => {
						this.setState((prevState) => ({
  							count: prevState.count + 1
							// OR count: global.count++
						}));
					}}
				>
					<Text>Add to Array</Text>
				</Button>

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
