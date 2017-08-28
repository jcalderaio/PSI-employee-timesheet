What I Did:
    -Added something that records errors from all users anytime a user gets one
    -Android: clears data when goBack button from AddEntry and SelectRecent
    -Text: made it so that on every iPhone and Android screen size, the text resizes accordingly
    -Fixed border on tables
    -Got rid of border on trashcan icon in time tracker
    -Prevent people from entering letters/non-wanted characters in AddEntry and todaysJobs
    -Pull to refresh updates todaysCharges table
    -MAIN: on Android, make it so no scroll.
    -auto pick job if 1 option

To Do:
    -.apk + .iphone
    -SSL

Bugs:

-package.json
"test": "node node_modules/jest/bin/jest.js --watch"

-
"import/no-extraneous-dependencies": ["error", {"devDependencies": true, "optionalDependencies": false, "peerDependencies": false}]

Are your test files under a the "test" folder? make sure jest is install properly and listed on your package.json and under scripts have:

"test": "jest --coverage",
you can run the script with npm test
