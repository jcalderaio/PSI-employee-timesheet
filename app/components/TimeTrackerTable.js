import React, { Component } from 'react';
import { Text } from 'react-native';
import { Grid, Col, Row, View, Input } from 'native-base';
import { map } from 'lodash';
import { observer } from 'mobx-react/native';
import { InsertingRow } from './InsertingRow';

//MobX
import timeTrackerStore from '../stores/TimeTrackerStore';

@observer
class TimeTrackerTable extends Component {
    render() {
        return (
            <Grid style={{ alignItems: 'center' }}>
              <Row style={{ height: 30 }} >
              {/*Table Labels*/}
                <Col size={33} style={styles.tableStyle.titleFirst}>
                  <Text style={{ fontWeight: 'bold' }}>In Time</Text>
                </Col>
                <Col size={33} style={styles.tableStyle.title}>
                  <Text style={{ fontWeight: 'bold' }}>Out Time</Text>
                </Col>
                <Col size={33} style={styles.tableStyle.titleLast}>
                  <Text style={{ fontWeight: 'bold' }}>Difference</Text>
                </Col>
              </Row>

              <InsertingRow />

             </Grid>
        );
    }
}

const styles = {
	container: {
		flex: 1
	},
	tableStyle: {
		titleFirst: {
			backgroundColor: '#a0a6ab',
			borderWidth: 1,
			justifyContent: 'center',
			alignItems: 'center'
		},
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
		bodyFirst: {
			backgroundColor: '#fff',
			borderLeftWidth: 1,
			borderBottomWidth: 1,
			borderRightWidth: 1,
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
	},
    pinkTableStyle: {
		bodyFirst: {
			backgroundColor: '#FFC0CB',
			borderLeftWidth: 1,
			borderBottomWidth: 1,
			borderRightWidth: 1,
			justifyContent: 'center',
			alignItems: 'center'
		},
		body: {
			backgroundColor: '#FFC0CB',
			borderBottomWidth: 1,
			borderRightWidth: 1,
			justifyContent: 'center',
			alignItems: 'center'
		},
		bodyLast: {
			backgroundColor: '#FFC0CB',
			borderBottomWidth: 1,
			justifyContent: 'center',
			alignItems: 'center'
		}
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

export { TimeTrackerTable };
