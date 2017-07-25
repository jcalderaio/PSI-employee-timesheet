import React, { Component } from 'react';
import { Grid, Col, Row, View, Input, Text } from 'native-base';
import { map } from 'lodash';
import { observer } from 'mobx-react/native';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';

//MobX
import timeTrackerStore from '../stores/TimeTrackerStore';

@observer
class InsertingRow extends Component {
	render() {
		return (
			<Row style={{ height: 40 }} >
			{/* In_Time */}
			  <Col size={50} style={styles.pinkTableStyle.bodyFirst}>
				  <DatePicker
					style={{ flex: 1 }}
					customStyles={{
						dateInput: {
							borderWidth: 0
						}
					}}
					androidMode={'spinner'}
					date={timeTrackerStore.inTimeDisplay}
					placeholder={' '}
					mode="time"
					format="hh:mm a"
					confirmBtnText="Confirm"
					cancelBtnText="Cancel"
					minuteInterval={15}
					showIcon={false}
					is24Hour={false}
					onDateChange={(time) => {
						//2017-07-06T08:01:55.51
						timeTrackerStore.inTimeDisplay = time;  // Sets view to see 12 hr
						//print(moment_24hr.hours() + ':' + moment_24hr.minutes());
						const moment_24hr = moment(time, 'hh:mm a'); // Converts to 24 hr
						let hours = moment_24hr.hours();
						let minutes = moment_24hr.minutes();
						if (hours < 10) hours = `0${hours}`;
						if (minutes < 10) minutes = `0${minutes}`;
						const newTime = moment().format(`YYYY[-]MM[-]DD[T]${hours}[:]${minutes}[:]ss[.]SS`);
						//console.log(newTime);

						timeTrackerStore.inTime = newTime;
						timeTrackerStore.insertRow();
					}}
				  />
			  </Col>
			  {/* Out_Time */}
			  <Col size={50} style={styles.pinkTableStyle.bodyLast}>
				  <DatePicker
					//style={{ flex: 1 }}
					customStyles={{
						dateInput: {
							borderWidth: 0
						}
					}}
					androidMode={'spinner'}
					date={timeTrackerStore.outTimeDisplay}
					placeholder={' '}
					mode="time"
					format="hh:mm a"
					confirmBtnText="Confirm"
					cancelBtnText="Cancel"
					minuteInterval={15}
					showIcon={false}
					is24Hour={false}
					onDateChange={(time) => {
						timeTrackerStore.outTimeDisplay = time; // Sets view to see 12 hr
						const moment_24hr = moment(time, 'hh:mm a'); // Converts to 24 hr
						const dateTime = moment();
						dateTime.hours(moment_24hr.hours());
						dateTime.minutes(moment_24hr.minutes());
						timeTrackerStore.outTime = dateTime;
						timeTrackerStore.insertRow();
					}}
				  />
			  </Col>
		  </Row>
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

export { InsertingRow };
