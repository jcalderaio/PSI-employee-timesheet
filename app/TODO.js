What I Did:
    -TodaysJobStore - added function to let us know if there are uncommitted changes
    -Todays Charges tab - directions pop up near button when there are uncommited changes, saying "Rows in PINK are uncommitted. Click 'Update Charges' to commit."
    -Add Entry - directions pop up at the top when there are uncommited changes, saying "WARNING! You have uncommitted changes. Please go to the 'Today's Charges' tab and click the 'Update Charges' button. If you proceed with Adding a new Entry, your changes will be lost."
    -Add Entry - Made it so no one can add '.', '-', or any Non numbers to the database.
    -Upgraded to new React Native and New Expo
    -It loads now when adding new charge
    -TodaysCharges - selects entire field on focus
    -TodaysCharges - prevent people from adding non-Numbers, non-divisers of 0.5, and automatically rounds number to closest 0.5
    -TodaysCharges - Update Charges button is hidden until there are charges needed to commit
    -Basically done todays charges



TODO:
  -On "Add Entry", go back and reset variables

// BUG:
*paste Russian characters into username/password in login, throws error
*Bosses Problem
How to reproduce the problem:
1.       Start fresh
2.       Select recent
3.       Check the first two jobs
4.       Add Selected
5.       Enter some hours for the first pink job but don’t update charges
6.       Select recent
7.       Check the first three jobs
8.       Add Selected
9.       Message box says they’re all duplicates.  In reality, 2 are duplicates and 1 is new.  The underlying logic behaves correctly, just the msgbox math has an error.

*If change to float first time, it doesnt snap
*TodaysCharges - can update to floats
*TodaysCharges - 1.2 does NOT snap to 0.5

What He Needs to Fix:
  -RecentJobs needs hours field with default of 0 (cant do empty)
