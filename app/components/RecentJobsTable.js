/* Unused for Now */

import React from 'react';
import { Text } from 'react-native';
import { Grid, Col, Row } from 'native-base';

const RecentJobsTable = ({ data }) => (
  <Grid style={{ alignItems: 'center' }}>
    <Row style={{ height: 30 }} >
    {/*Table Labels*/}
      <Col size={24} style={styles.tableStyle.title}>
        <Text style={{ fontWeight: 'bold' }}>Job #</Text>
      </Col>
      <Col size={28} style={styles.tableStyle.title}>
        <Text style={{ fontWeight: 'bold' }}>Client</Text>
      </Col>
      <Col size={31} style={styles.tableStyle.title}>
        <Text style={{ fontWeight: 'bold' }}>Job Title</Text>
      </Col>
      <Col size={17} style={styles.tableStyle.titleLast}>
        <Text style={{ fontWeight: 'bold' }}>Add</Text>
      </Col>
    </Row>
    {/*Table Labels*/}
    {data.map((item, i) =>
      <Row style={{ minHeight: 50 }} key={i}>
        <Col size={24} style={styles.tableStyle.body}>
          <Text>{item.Job_Number}</Text>
        </Col>
        <Col size={28} style={styles.tableStyle.body}>
          <Text>{item.Client_Name}</Text>
        </Col>
        <Col size={31} style={styles.tableStyle.body}>
          <Text>{item.Sub_Task}</Text>
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

export { RecentJobsTable };
