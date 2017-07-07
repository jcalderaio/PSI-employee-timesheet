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
    -Bug- AddEntry - when go back to previous option, it resets the option below to 'Tasks', etc.
    -Bug - SelectRecent - Add first 2 then first 3. Now says correct thing.


TODO:
