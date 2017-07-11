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


TODO:

Bugs:
    -TodaysCharges does not update after first try
