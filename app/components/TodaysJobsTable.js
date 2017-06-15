import React from 'react';
import { Text } from 'react-native';
import { Grid, Col, Row, View, Input } from 'native-base';
import { map } from 'lodash';
import todaysJobStore from '../stores/TodaysJobStore';

const TodaysJobsTable = ({ data }) => {
    return (
        <Grid style={{ alignItems: 'center' }}>
          <Row style={{ height: 30 }} >
          {/*Table Labels*/}
            <Col size={24} style={styles.tableStyle.titleFirst}>
              <Text style={{ fontWeight: 'bold' }}>Job #</Text>
            </Col>
            <Col size={28} style={styles.tableStyle.title}>
              <Text style={{ fontWeight: 'bold' }}>Client</Text>
            </Col>
            <Col size={31} style={styles.tableStyle.title}>
              <Text style={{ fontWeight: 'bold' }}>Job Title</Text>
            </Col>
            <Col size={17} style={styles.tableStyle.titleLast}>
              <Text style={{ fontWeight: 'bold' }}>Hours</Text>
            </Col>
          </Row>
          {/*Table Labels*/}
          {map(data, (item) =>
            <Row style={{ minHeight: 50 }} key={item.Job_Id}>
              <Col size={24} style={styles.tableStyle.bodyFirst}>
                <Text style={styles.tableStyle.bodyText}>{item.Job_Number}</Text>
              </Col>
              <Col size={28} style={styles.tableStyle.body}>
                <Text style={styles.tableStyle.bodyText}>{item.Client_Name}</Text>
              </Col>
              <Col size={31} style={styles.tableStyle.body}>
                <Text style={styles.tableStyle.bodyText}>{item.Sub_Task}</Text>
              </Col>
              <Col size={17} style={styles.tableStyle.bodyLast}>
                  <View>
                      <Input
                          style={styles.hoursEntryBorder}
                          defaultValue={String(item.Hours)}
                          value={todaysJobStore.updatedHours}
                          onChangeText={value => todaysJobStore.setUpdatedHours(value)}
                          returnKeyType='send'
                          keyboardType='numeric'
                          //onSubmitEditing={() => alert('Update Entry!')}
                      />
                  </View>
              </Col>
            </Row>
          )}
        </Grid>
    );
};

const styles = {
  container: {
    flex: 1,
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
    hoursEntryBorder: {
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 18,
		height: 25,
		width: 50
	}
};

export { TodaysJobsTable };
