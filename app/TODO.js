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
  -new logo. new colors?
  -Fetch data from server when there is an update?
  -Make app only work in portrait mode
  -on Todays charges, if select text, highlight all text
  -highlight things that have not been changed (pink lines?) ??? (have uncommitted information)
PTO
  -Hours in database in variable vs hours there
  -PTO - show PTO hours left on main screen
  -make sure not negative and does not exceed PTO hours
Flex
  -show flex on main
  -allows to bank time
  -expected - worked = most negative on flex

What to say:
-you dont know if the suggested "status" will work. you dont know how someone will exit the app. swiping?
-Need the backend functions at this point to go much further.

What I did:
-Fixed the doubling up numbers on 'Add Entry' screen:
    1) I added a "unique" tag to the ones that were doubling the same numbers
    2) For those that returned more than one different number, I added another "picker" for the user to choose from
-Doesn't reload from API upon subsequent reloads. Only loads when I want them too, giving me grain control of the app.
-Fixed the main screen with the hours. Before, on todays charges, when you edited an hour and flipped back to the main screen, the number of hours would not add properly. This is because it was concatenating it like a string. I had to force it into a number, and then it worked just fine.
  3) Added the new Logo
-Added black around the screen and the input areas. Looks like how many professional apps look.
  4) Status bar. Before, Android's status bar was being smushed. But, now, the Android status bar is configured to fit into the screen.
