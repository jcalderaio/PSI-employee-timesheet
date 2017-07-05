What I Did:
    -TodaysJobStore - added function to let us know if there are uncommitted changes
    -Todays Charges tab - directions pop up near button when there are uncommited changes, saying "Rows in PINK are uncommitted. Click 'Update Charges' to commit."
    -Add Entry - directions pop up at the top when there are uncommited changes, saying "WARNING! You have uncommitted changes. Please go to the 'Today's Charges' tab and click the 'Update Charges' button. If you proceed with Adding a new Entry, your changes will be lost."
    -Add Entry - Made it so no one can add '.', '-', or any Non numbers to the database.
    -Upgraded to new React Native and New Expo
    -It loads now when adding new charge
    -TodaysCharges - selectcts entire field on focus
    -TodaysCharges - prevent people from adding non-Numbers, non-divisers of 0.5, and automatically rounds number to closest 0.5
    -TodaysCharges - Update Charges button is hidden until there are charges needed to commit
    -Basically done todays charges



TODO:
-Need to change pink back to white if original hours go back.
  -Never Fetch the data more than once:
        -Update Charge: status codes are '0' by default. If someone changes the amount of hours, the status changes to 1 'update'.
        -Select Recent- select recent jobs, and they are added to TodaysJobStore.todaysJobs (with a status of 3, add new) without updating the database.
        -Add Entry: input all the data and put status code to 2 (Add New). Then add this to "Todays Jobs", without touching the database
        -Changing todays_hours - if change todays hours, status code changes to update.

  -If change hours and turn pink, get rid of 0
  -highlight things that have not been changed (pink lines?) ??? (have uncommitted information)
  -New hours vs old hours to change back from pink
  -On "Add Entry", go back and reset variables

// BUG:
-How to reproduce the problem:
1.       Start fresh
2.       Select recent
3.       Check the first two jobs
4.       Add Selected
5.       Enter some hours for the first pink job but don’t update charges
6.       Select recent
7.       Check the first three jobs
8.       Add Selected
9.       Message box says they’re all duplicates.  In reality, 2 are duplicates and 1 is new.  The underlying logic behaves correctly, just the msgbox math has an error.


What He Needs to Fix:
-Please make the changes I asked in the emails
    -RecentJobs needs hours field with default of 0 (cant do empty)
