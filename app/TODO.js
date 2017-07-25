What I Did:
    -Made TimeTracker screen to hold all the views and info
    -Made TimeTrackerStore to house all the functions used on TimeTracker
    -Made TimeTrackerTable to show the TimeTracker with In/Out times
    -On Main screen (componentWillMount), TimeTracker calls fetch to retrieve TimeTracker array
    -Took away forceUpdate() and made it a MobX @observable instead
    -Everythings running smoother than before, other than yesterdays update
    -I have all the code written for the time entry sheet, just need to update the GUI
    -Did you start working on the dummy account?
    after this im taking a year of to go into treatment for my Lyme disease, and when I get get back I need something to show my potentials


TimeTracker:
//print(moment_24hr.format('hh:mm a')); // Converts from 24 to 12 hour!!!!
-so on the client side, when a user types in the time it will be in 12 hour format (so it looks nice on the screen). I will then convert it to 24 hour format, and set the moment.hours and moment.minutes. Will do diff math with the moment dates.

When I retrieve it back from the database, I will getHours and getMinutes and plug them into my 24 hr to 12 hour converter.

const moment = require('moment');
let time = moment();
const c = console.log;

-all times after first time must be later in day


// Set the hours/ minutes of the moment to store in database
time.hours(23); time.minutes(42);

// When pull out of database
const a = `${time.hours()}:${time.minutes()}`;
var b = a.split(':');

c(`${b[0]}:${b[1]}`);


// Put 24 hour based in here
function getHours(hours) {
    if(hours === 0) {
      return '12 am';
    } else if (hours <= 11) {
      return hours % 12 + ' am';
    } else if (hours === 12) {
      return '12 pm';
    } else {
      return hours % 12 + ' pm';
    }
}

// How to get the difference
const result = date2.diff(date1, 'minutes');
console.log('Difference: ', result / 60, ' hours');

// Random shit
-moment().format('hh:mm a')); is non military timeout
-moment().format('HH:mm')); is military time

console.log('Date: ', moment().format('hh:mm a'));
console.log('Date Type: ', typeof moment().format('hh:mm a')); //string
const date1 = moment(moment().format('hh:mm a'), 'hh:mm a');
const date2 = moment('10:00 pm', 'hh:mm a');


TODO:

Bugs:
    -TodaysCharges does not update ON SCREEN after first try (it really is updates. Just log out and log back in to see that).

    -Put a 2000 ml timer after every function.
    -look into ssl certificates



    timeTrackerStore.inTimeDisplay = time;  // Sets view to see 12 hr
    const moment_24hr = moment(time, 'hh:mm a'); // Converts to 24 hr
    const dateTime = new Date();
    dateTime.setHours(moment_24hr.hours());
    dateTime.setMinutes(moment_24hr.minutes());
    timeTrackerStore.inTime = dateTime.toString();
    timeTrackerStore.insertRow();



    timeTrackerStore.outTimeDisplay = time; // Sets view to see 12 hr
    const moment_24hr = moment(time, 'hh:mm a'); // Converts to 24 hr
    const dateTime = new Date();
    dateTime.setHours(moment_24hr.hours());
    dateTime.setMinutes(moment_24hr.minutes());
    timeTrackerStore.outTime = dateTime;
    timeTrackerStore.insertRow();
