import React, { Component } from 'react';
import { Text, Platform } from 'react-native';
import { Grid, Col, Row, View, Input } from 'native-base';
import { map } from 'lodash';
import { observer } from 'mobx-react/native';

//MobX
import todaysJobStore from '../stores/TodaysJobStore';

@observer
class TodaysJobsTable extends Component {
    render() {
        return (
            <Grid style={{ alignItems: 'center' }}>
              <Row style={{ height: 30 }} >
              {/*Table Labels*/}
                <Col size={24} style={styles.tableStyle.titleFirst}>
                  <Text style={styles.tableStyle.titleText}>Job #</Text>
                </Col>
                <Col size={28} style={styles.tableStyle.title}>
                  <Text style={styles.tableStyle.titleText}>Client</Text>
                </Col>
                <Col size={31} style={styles.tableStyle.title}>
                  <Text style={styles.tableStyle.titleText}>Job Title</Text>
                </Col>
                <Col size={17} style={styles.tableStyle.titleLast}>
                  <Text style={styles.tableStyle.titleText}>Hours</Text>
                </Col>
              </Row>
              {/*Table Labels*/}
              {map(todaysJobStore.todaysJobs, (item) => {
                  // Items committed. Show as WHITE rows
                  // User can only change hours. If zero, will be deleted
                  if (item.Status === 0) { // 0 - do nothing
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
                                        ref='Status0'
                                        style={styles.hoursEntryBorder}
                                        defaultValue={String(item.Hours)}
                                        onEndEditing={e => {
                                            const hours = Number(e.nativeEvent.text.replace(/[^0-9\-\.]/g, ''));
                                            item.Old_Hours = item.Hours;

                                            // Not a number
                                            if (isNaN(hours)) {
                                                alert('You must enter a Number!');
                                                return;
                                            } else if (item.Hours === hours) {
                                                return;
                                            } else if (hours === 0) {
                                                item.Hours = 0;
                                                item.Status = 3; // DELETE
                                            } else if (hours % 0.5 !== 0) {
                                                item.Hours = Math.round(hours * 2) / 2;
                                                if (item.Hours === item.Old_Hours) {
                                                    item.Status = 0;
                                                } else if (item.Hours === 0) {
                                                    item.Status = 3;
                                                } else {
                                                    item.Status = 1;
                                                }
                                            } else {
                                                item.Hours = hours;
                                                item.Status = 1;  // UPDATE (PUT)
                                            }
                                        }}
                                        returnKeyType='done'
                                        keyboardType={
											(Platform.OS === 'android') && 'numeric'
										}
                                        maxLength={6}
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
                                        onEndEditing={e => {
                                            const hours = Number(e.nativeEvent.text.replace(/[^0-9\-\.]/g, ''));

                                            // Not a number
                                            if (isNaN(hours)) {
                                                alert('You must enter a Number!');
                                                return;
                                                // A number
                                                // Do nothing. POSTS with 0 hrs will just not be added
                                            } else if (hours === 0) {
                                                item.Hours = 0;
                                            } else if (hours % 0.5 !== 0) {
                                                item.Hours = Math.round(hours * 2) / 2;
                                            } else {
                                                item.Hours = hours;
                                            }
                                        }}
                                        returnKeyType='done'
                                        keyboardType={
											(Platform.OS === 'android') && 'numeric'
										}
                                        maxLength={6}
                                        selectTextOnFocus
                                    />
                                </View>
                            </Col>
                          </Row>
                      );
                  } else {  // (Item.Status === 1 || 3)
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
                                        onEndEditing={e => {
                                            const hours = Number(e.nativeEvent.text.replace(/[^0-9\-\.]/g, ''));

                                            // Not a number
                                            if (isNaN(hours)) {
                                                alert('You must enter a Number!');
                                                item.Status = 0;
                                                return;
                                                // A number
                                                // Went back to old number
                                            } else if (item.Old_Hours === hours) {
                                                item.Hours = hours;
                                                item.Status = 0;
                                            } else if (hours === 0) {
                                                item.Hours = 0;
                                                item.Status = 3; // DELETE
                                            } else if (hours % 0.5 !== 0) {
                                                item.Hours = Math.round(hours * 2) / 2;
                                                if (item.Hours === item.Old_Hours) {
                                                    item.Status = 0;
                                                } else if (item.Hours === 0) {
                                                    item.Status = 3;
                                                } else {
                                                    item.Status = 1;
                                                }
                                            } else {
                                                item.Hours = hours;
                                                item.Status = 1;  //PUT
                                            }
                                        }}
                                        returnKeyType='done'
                                        keyboardType={
											(Platform.OS === 'android') && 'numeric'
										}
                                        maxLength={6}
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
            borderRightWidth: 0.5,
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
            borderRightWidth: 0.5,
			justifyContent: 'center',
			alignItems: 'center'
		},
		bodyText: {
			fontSize: global.SMALL_TEXT,
            textAlign: 'center'
		},
        titleText: {
            fontWeight: 'bold',
            fontSize: global.MEDIUM_TEXT
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
            borderRightWidth: 0.5,
			justifyContent: 'center',
			alignItems: 'center'
		}
	},
	hoursEntryBorder: {
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: global.LARGE_TEXT,
		height: 25,
		width: 60,
        textAlign: 'center'
	}
};

export { TodaysJobsTable };
