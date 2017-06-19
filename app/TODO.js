//iPhone button hex = #0x007aff

/*John Calderaio:
	@AriaFallah I'm not an expert with testing, but just try to create your functions as pure as possible, for example: */

class MessageStore {
  // bad
  markMessageAsRead = message => {
    if (message.status === 'new') {
      fetch({
        method: 'GET',
        path: `/notification/read/${message.id}`
      }).then(() => message.status = 'read')
    }
  }
  // good
  markMessageAsRead = message => {
    if (message.status !== 'new') {
      return Promise.reject('Message is not new')
    }
    // it's now easily mockable
    return api.markMessageAsRead(message).then(() => {
      // this is a pure function
      // you can test it easily
      return this.updateMessage(message, { status: ' read' })
    })
  }
}

TODO:
  -Check for duplicates: cant add jobs from "Select Recent" or "Add Charge" thats already in Today's Charges list. Just tell them to update "Today's Charges"
  -Never Fetch the data more than once:
        -Update Charge: status codes are '0' by default. If someone changes the amount of hours, the status changes to 1 'update'.
        -Select Recent- select recent jobs, and they are added to TodaysJobStore.todaysJobs (with a status of 3, add new) without updating the database.
        -Add Entry: input all the data and put status code to 2 (Add New). Then add this to "Todays Jobs", without touching the database
        -Changing todays_hours - if change todays hours, status code changes to update.

  -show "checks" on recent
  -new logo. new colors?
  -(make a function in todaysChargesStore?) For "Add Charge", use authorized jobs and filter JSON to fill in component
  -Fetch data from server when there is an update?

WHat to DO:
Bugs:
-"Job Number" doubles up sometimes
-Hour edit not sticking on Today's Charges screen
-Hours concatenating when go back to main screen from Today's Charges
*** If figure out bugs early let him know

what to say:
-you dont know if the suggested "status" will work. you dont know how someone will exit the app. swiping?
-Need the backend functions at this point to go much further.
