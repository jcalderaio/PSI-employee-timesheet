//iPhone button hex = #0x007aff

For the PINK uncommited changes:

var object = [
{
"Timesheet_Id": 542177,
"Date": "2017-06-27T00:00:00",
"Job_Id": 11378,
"Job_Number": "17100-C-010-D",
"Client_Name": "Pratt & Whitney",
"Task": "F999 Inlet Redesign",
"Sub_Task": "Case - Systems Engineer",
"Hours": 1.5,
"Status": 0,
"Commited": true
},
{
"Timesheet_Id": 542178,
"Date": "2017-06-27T00:00:00",
"Job_Id": 11429,
"Job_Number": "17101-K-070-N",
"Client_Name": "Pratt & Whitney",
"Task": "F999 Compressor",
"Sub_Task": "V3 - Product Definition",
"Hours": 5,
"Status": 0
},
{
"Timesheet_Id": 542179,
"Date": "2017-06-27T00:00:00",
"Job_Id": 11446,
"Job_Number": "17103-H-010",
"Client_Name": "PW Power Systems",
"Task": "FT9000 Exhaust Collector",
"Sub_Task": "Structural Analysis",
"Hours": 0.5,
"Status": 0,
"Commited": true
}
];

object.map(item => {
  if(item.Commited) {
    console.log(item.Job_Number);
  }
});


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
