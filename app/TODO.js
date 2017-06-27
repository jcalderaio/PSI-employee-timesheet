TODO:
  -Check for duplicates, use .trim : cant add jobs from "Select Recent" or "Add Charge" thats already in Today's Charges list. Just tell them to update "Today's Charges"
  -Never Fetch the data more than once:
        -Update Charge: status codes are '0' by default. If someone changes the amount of hours, the status changes to 1 'update'.
        -Select Recent- select recent jobs, and they are added to TodaysJobStore.todaysJobs (with a status of 3, add new) without updating the database.
        -Add Entry: input all the data and put status code to 2 (Add New). Then add this to "Todays Jobs", without touching the database
        -Changing todays_hours - if change todays hours, status code changes to update.
  -new logo. new colors?
  -Fetch data from server when there is an update?

  -on Todays charges, if select text, highlight all text
  -highlight things that have not been changed (pink lines?) ??? (have uncommitted information)


What I did:
-Fixed the "Add Entry" screen. Numbers were splitting into characters, so I fixed that. Also, checks if hours are '0' and if hours are not 0.5 intervals
-Added directions to the "Add Entry" screen that delete when the "Add Charge" button shows up
-App only works in portrait mode
-Select Recent now adds non-duplicates to TodaysJobStore.todaysJobs
