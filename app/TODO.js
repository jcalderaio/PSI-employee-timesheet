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


WHAT I DID:
-Added checkmarks to the "Select Recent" page
-Added an authorizedJobsStore that holds all information for jobs being Added
-Finished the frontend for the "Add New Entry" part
-It only shows one at a time, until you are done with them in order (so select client, then select a task, then select a sub-task, then Job Number is found automatically, then fill in hours, then press send, or press the button).
-It connects to a function i authorizedJobsStore and it checks to make sure hours are a multiple of 5. If not, it tells the user, if yes, I will add to the array stack with the correct status
-On Today's charges, you can edit the number of hours and submit
-Need the backend functions at this point to go much further.

Bugs:
-Select Recent - when press either button and transferred to "Todays Charges" screen, theres 4 second lag on Android. I think it has to do with sliding the tabs, because when I turned on sliding tabs for iOS, the table looked messed up. When I took it off, it was fixed.
-Recent Jobs button lagging big time!
