TODO:
  -Never Fetch the data more than once:
        -Update Charge: status codes are '0' by default. If someone changes the amount of hours, the status changes to 1 'update'.
        -Select Recent- select recent jobs, and they are added to TodaysJobStore.todaysJobs (with a status of 3, add new) without updating the database.
        -Add Entry: input all the data and put status code to 2 (Add New). Then add this to "Todays Jobs", without touching the database
        -Changing todays_hours - if change todays hours, status code changes to update.
  -new logo. new colors?
  -Fetch data from server when there is an update?

  -If change hours and turn pink, get rid of 0
  -highlight things that have not been changed (pink lines?) ??? (have uncommitted information)
  -New hours vs old hours to change back from pink
  -on top of add entry, "warning make sure to commit changes"
  -On "Add Entry", go back and reset variables

// BUG:
-



What I did:
-Fixed the "Add Entry" screen. Numbers were splitting into characters, so I fixed that. Also, checks if hours are '0' and if hours are not 0.5 intervals
-Moves textbox into view when typing in hours on add entry
-Added directions to the "Add Entry" screen that turns into the "Add Charge" button when all their into is typed in
--retrieves JobId after you choose all from "Add Entry"
-"Add Entry" functionality added, but doesnt add until way later
-App only works in portrait mode
-Select Recent now adds non-duplicates to TodaysJobStore.todaysJobs (proven by a row count on todays jobs)
-Tons of debugging for Select Recent, such as, how many successfully added, how many were duplicates and not added, if non-are selected, etc.
-Rows that are uncommitted are colored pink. Once you commit the rows, they will turn to white.
-Added directions to todays charges that only show if there is something there.
-If you edit hours in TodaysCharges, the row will turn pink. I did all kinds of debugging so it wouldnt work with blank characters or dots



What He Needs to Fix:
-Please make the changes I asked in the emails
    -Timesheet_ID is already being returned for Timesheet. What else does it need to be returned for?
    -RecentJobs need status field with default of 2
    -RecentJobs needs hours field with default of 0 (cant do empty)
-It took hours for the changes to show after adding a job, therefore it couldnt check for duplicates when being added since they weren't in there, so there are duplicates.
-I can't work with the changes taking so long to update the database.
