What I Did:
    -Made TimeTracker screen to hold all the views and info
    -Made TimeTrackerStore to house all the functions used on TimeTracker
    -Made TimeTrackerTable to show the TimeTracker with In/Out times
    -On Main screen (componentWillMount), TimeTracker calls fetch to retrieve TimeTracker array

    -Took away forceUpdate() and made it a MobX @observable instead


Timesheet:
  -all times after first time must be later in day
  -moment().format('hh:mm a')); is non military timeout
  -moment().format('HH:mm')); is military time

  console.log('Date: ', moment().format('hh:mm a'));
  console.log('Date Type: ', typeof moment().format('hh:mm a')); //string
  const date1 = moment(moment().format('hh:mm a'), 'hh:mm a');
  const date2 = moment('10:00 pm', 'hh:mm a');

  // How to get the difference
  const result = date2.diff(date1, 'minutes');

  console.log('Difference: ', result / 60, ' hours');


TODO:

Bugs:
    -TodaysCharges does not update ON SCREEN after first try (it really is updates. Just log out and log back in to see that).
