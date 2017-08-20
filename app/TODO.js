What I Did:
    -Android: clears data when goBack button from AddEntry and SelectRecent

To Do:
    -SSL
    -Fix pull down to reload on todaysJobs
    -MAIN: on Android, make it so no scroll.
    -auto pick job if 1 option
    -Can update to letters on updateEntry
    -.apk + .iphone

Bugs:

-package.json
"test": "node node_modules/jest/bin/jest.js --watch"

-
"import/no-extraneous-dependencies": ["error", {"devDependencies": true, "optionalDependencies": false, "peerDependencies": false}]

Are your test files under a the "test" folder? make sure jest is install properly and listed on your package.json and under scripts have:

"test": "jest --coverage",
you can run the script with npm test
