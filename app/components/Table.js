/* @flow weak */

import React from 'react';
import { Text } from 'react-native';
import { Grid, Col, Row } from 'native-base';

const Table = (props) => (
  <Grid style={{ alignItems: 'center' }}>
    <Row style={{ height: 50 }}>
      <Col size={27} style={styles.tableStyle.title}>
        <Text style={{ fontWeight: 'bold' }}>Job #</Text>
      </Col>
      <Col size={33} style={styles.tableStyle.title}>
        <Text style={{ fontWeight: 'bold' }}>Client</Text>
      </Col>
      <Col size={23} style={styles.tableStyle.title}>
        <Text style={{ fontWeight: 'bold' }}>Job Title</Text>
      </Col>
      <Col size={17} style={styles.tableStyle.titleLast}>
        <Text style={{ fontWeight: 'bold' }}>Add</Text>
      </Col>
    </Row>
    {props.data.map((item, i) =>
      <Row style={{ height: 50 }} key={i}>
        <Col size={27} style={styles.tableStyle.body}>
          <Text>{item.props.value1}</Text>
        </Col>
        <Col size={33} style={styles.tableStyle.body}>
          <Text>{item.props.value2}</Text>
        </Col>
        <Col size={23} style={styles.tableStyle.body}>
          <Text>{item.props.value3}</Text>
        </Col>
        <Col size={17} style={styles.tableStyle.bodyLast}>
          <Text>L</Text>
        </Col>
      </Row>
    )}
  </Grid>
);

const styles = {
  container: {
    flex: 1,
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
	}
};

export { Table };
