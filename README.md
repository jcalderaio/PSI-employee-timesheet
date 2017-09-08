## Table of Contents

This app allows an employee to manipulate their current work "charges" (Client, Task, Description, Date, Hours Worked, etc) by Adding, Deleting, or Updating them.

Functionality includes a user authentication screen (in which a user logs in with their Windows ID and password), a main screen to display Name, Date, and number of hours logged today, an "Add Entry" screen to select a new project for time charges, a "Select Recent" form which gives faster access to projects charged recently, and a Timesheet screen to show a list of todays charges (consisting of hours worked, client, task, and sub-task).

The app needs to reach both Android and iOS users. Since our user base is ~80% Android, development for Android should take priority over iOS in the event problems arise using React Native.
Expo will be used as the demonstration platform when appropriate.

## Login Screen:
Given a login name, the login form will need to authenticate the user and retrieve their legal name and employee number.
User authentication against Active Directory is expected to wait until next work package, as this needs support from PSI I.T.
PSI has set up a SQL user for the API to use. For this work package, the API test login PSI IT supplies will be used as the test account.
It does not need a list of all employees, nor does it need to give access to "employee information" cards. It should show the company logo, provide text boxes for login and password, and relevant buttons to process the login or quit the app.
It should store the login used the last time the app was used and reuse it on subsequent launches.

## Main Screen:
It needs to show the user's name, today's date, and a running total of hours charged for the day.
It should warn the user if the total number of hours for the day is excessive.
It needs to provide access to the "add entry" form, and "select recent" form.
The user should receive confirmation that the new values are committed before the app closes.

## Add Entry Screen:
This form will provide the user with a list of projects to which they can create a new charge.
It will filter active projects by client and by task, and allow the user to select a sub task to charge.
It needs to allow the user to add hours to the selected project.
It needs to allow the user to dismiss the form without making a charge.
It needs to apply the same data validation events as the main form (no negative charges other than flex time, all multiples of 0.5 hours).
It needs to show the job number of the selected task.
It does not need to filter projects by discipline.
It does not need to show the job description field.
It does not need to provide access to a searchable list of all active jobs (this is the function of the "View Jobs" button).

## Select Recent Screen:
This form will provide the user with a list of recently charged jobs.
Jobs need to be verified to still be active before they are added to this list.
The user needs to be able to select a subset of jobs and add them to the list of entries for the day. After adding these entries, they assign the hours to them on the main form.
The user needs to be able to add all listed jobs to the previous form.

## Timesheet Screen:
This form will display a status of the user's charges for the current day. Each displayed "charge" comprises a job number, a client name, a job title, and a quantity of hours. The record created in the database comprises a job id (linked to the job number via the Jobs table), a client id (linked to the client name via the Clients table), the user id (retrieved by the login form from the Employees table), and a decimal number of hours.
Entries for the number of hours need to be restricted to multiples of 0.5 hours.
Entries on the "Flex Time" job may be negative, but all other charges must be positive numbers.
The user needs to be able to remove or zero out errant entries.
