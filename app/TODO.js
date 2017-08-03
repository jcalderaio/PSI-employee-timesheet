What I Did:
    -Added number of hours to Time Tracker screen
    -Need to implement
    -Added Object to userStore that holds {"PTO_Balance": 21.5,"Flex_Balance": 0,"Flex_Limit": 80,"Flex_Allowed": true,"QTD_Sum": 80,"QTD_Required": 144,"Week_Sum": 12}
    -Showed all data on main screen
    -Refreshes data on main screen everytime a charge is added/deleted
    -PTO and Flex on Add New Entry
    -PTO and Flex on TodaysJobStore

const date1 = moment(moment().format('hh:mm a'), 'hh:mm a');
const date2 = moment('10:00 pm', 'hh:mm a');


TODO:
    -11344 job_id is flex time
    -change "general" to Personal Time
    -Need to guard against negative hours in Time Tracker

Bugs:
    -Put a 2000 ml timer after every function.
    -look into ssl certificates
