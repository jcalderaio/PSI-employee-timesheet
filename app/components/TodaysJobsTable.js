import React, { Component } from 'react';
import { Text } from 'react-native';
import { Grid, Col, Row, View, Input } from 'native-base';
import { map } from 'lodash';
import todaysJobStore from '../stores/TodaysJobStore';

class TodaysJobsTable extends Component {
    render() {
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
              {map(this.props.data, (item) => {
                  // Items committed. Show as WHITE rows
                  // User can only change hours. If zero, will be deleted
                  if (item.Status === 0) {
                      return (
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
                                        //value={String(item.Hours)}
                                        onChangeText={value => {
                                            const hours = Number(value.trim());

                                            // Do not let Non-Numbers entered
                                            if (isNaN(hours)) {
                                                alert('You must enter a Number!');
                                                item.Hours = 0;
                                                item.Status = 3; // DELETE
                                                this.forceUpdate();
                                            // These want to be DELETED
                                            } else if (hours === 0) {
                                                item.Hours = 0;
                                                item.Status = 3; // DELETE
                                                this.forceUpdate();
                                            } else if (hours % 0.5 !== 0) {
                                                alert('You must enter hours in denominations of 0.5');
                                                item.Hours = (Math.round(hours * 2) / 2).toFixed(1);
                                                item.Status = 1; // UPDATE (PUT)
                                                this.forceUpdate();
                                                return;
                                            // These want to be UPDATED
                                            } else {
                                                item.Hours = hours;
                                                item.Status = 1;  // UPDATE (PUT)
                                                this.forceUpdate();
                                            }
                                        }}
                                        returnKeyType='send'
                                        keyboardType='numeric'
                                        maxLength={4}
                                        selectTextOnFocus
                                    />
                                </View>
                            </Col>
                          </Row>
                      );
                  } else if (item.Status === 2) {
                    // Items NOT committed. Show as PINK rows
                      return (
                          <Row style={{ minHeight: 50 }} key={item.Job_Id}>
                            <Col size={24} style={styles.pinkTableStyle.bodyFirst}>
                              <Text style={styles.tableStyle.bodyText}>{item.Job_Number}</Text>
                            </Col>
                            <Col size={28} style={styles.pinkTableStyle.body}>
                              <Text style={styles.tableStyle.bodyText}>{item.Client_Name}</Text>
                            </Col>
                            <Col size={31} style={styles.pinkTableStyle.body}>
                              <Text style={styles.tableStyle.bodyText}>{item.Sub_Task}</Text>
                            </Col>
                            <Col size={17} style={styles.pinkTableStyle.bodyLast}>
                                <View>
                                    <Input
                                        style={styles.hoursEntryBorder}
                                        defaultValue={String(item.Hours)}
                                        onChangeText={value => {
                                            const hours = Number(value.trim());

                                            // Do not let Non-Numbers entered
                                            if (isNaN(hours)) {
                                                alert('You must enter a Number!');
                                                item.Hours = 0;
                                                item.Status = 3; // DELETE
                                                this.forceUpdate();
                                            // These want to be DELETED
                                            } else if (hours === 0) {
                                                item.Hours = 0;
                                                item.Status = 3; // DELETE
                                                this.forceUpdate();
                                            } else if (hours % 0.5 !== 0) {
                                                alert('You must enter hours in denominations of 0.5');
                                                item.Hours = (Math.round(hours * 2) / 2).toFixed(1);
                                                item.Status = 1; // UPDATE (PUT)
                                                this.forceUpdate();
                                                return;
                                            // These want to be UPDATED
                                            } else {
                                                item.Hours = hours;
                                                item.Status = 1;  // UPDATE (PUT)
                                                this.forceUpdate();
                                            }
                                        }}
                                        returnKeyType='send'
                                        keyboardType='numeric'
                                        maxLength={4}
                                        selectTextOnFocus
                                    />
                                </View>
                            </Col>
                          </Row>
                      );
                  } else {
                      return (
                          <Row style={{ minHeight: 50 }} key={item.Job_Id}>
                            <Col size={24} style={styles.pinkTableStyle.bodyFirst}>
                              <Text style={styles.tableStyle.bodyText}>{item.Job_Number}</Text>
                            </Col>
                            <Col size={28} style={styles.pinkTableStyle.body}>
                              <Text style={styles.tableStyle.bodyText}>{item.Client_Name}</Text>
                            </Col>
                            <Col size={31} style={styles.pinkTableStyle.body}>
                              <Text style={styles.tableStyle.bodyText}>{item.Sub_Task}</Text>
                            </Col>
                            <Col size={17} style={styles.pinkTableStyle.bodyLast}>
                                <View>
                                    <Input
                                        style={styles.hoursEntryBorder}
                                        defaultValue={String(item.Hours)}
                                        onChangeText={value => {
                                            const hours = Number(value.trim());

                                            // Do not let Non-Numbers entered
                                            if (isNaN(hours)) {
                                                alert('You must enter a Number!');
                                                item.Hours = 0;
                                                item.Status = 3; // DELETE
                                                this.forceUpdate();
                                            // These want to be DELETED
                                            } else if (hours === 0) {
                                                item.Hours = 0;
                                                item.Status = 3; // DELETE
                                                this.forceUpdate();
                                            } else if (hours % 0.5 !== 0) {
                                                alert('You must enter hours in denominations of 0.5');
                                                item.Hours = (Math.round(hours * 2) / 2).toFixed(1);
                                                item.Status = 1; // UPDATE (PUT)
                                                this.forceUpdate();
                                                return;
                                            // These want to be UPDATED
                                            } else {
                                                item.Hours = hours;
                                                item.Status = 1;  // UPDATE (PUT)
                                                this.forceUpdate();
                                            }
                                        }}
                                        returnKeyType='send'
                                        keyboardType='numeric'
                                        maxLength={4}
                                        selectTextOnFocus
                                    />
                                </View>
                            </Col>
                          </Row>
                      );
                  }
              })}
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

export { TodaysJobsTable };
