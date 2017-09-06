import { Alert } from 'react-native';
import { observable, computed, action } from 'mobx';
import base64 from 'base-64';
import { sum, map, filter } from 'lodash';  // Import ONLY used functions from Lodash
import ApiUtils from '../components/ApiUtils'; // checks for errors in Fetches

//MobX
import userStore from './UserStore';  // Need user/pass

class TodaysJobStore {
   @observable todaysJobs = null;
   @observable errorMessage = null;
   @observable loading = false;

   @computed get isEmpty() {
      if (this.todaysJobs !== null) {
         return !this.todaysJobs.length;
     } else {
         return true;
     }
   }

   @computed get size() {
      if (this.todaysJobs === null) {
         return 0;
     } else {
         return this.todaysJobs.length;
     }
   }

   // Lets us know whether or not there are any uncommited charges
   @computed get hasUncommitted() {
       // If todaysJobs null, impossible to have non-Status: 0 jobs
       if (this.todaysJobs === null) {
           return false;
       } else {
           // If found jobs with Status !== 0, then there are uncommitted
           const temp = filter(this.todaysJobs, (item) =>
             item.Status !== 0
           );

           return (temp.length > 0);
       }
   }

   @computed get totalHours() {
      if (this.todaysJobs === null) {
         return 0;
     } else {
        //const arr = map(this.todaysJobs, 'Hours');
        //return sum(arr);
        const temp = filter(this.todaysJobs, (p) => p.Hours > 0);
        const arr = map(temp, 'Hours');
        return sum(arr);
     }
   }

   @action updateEntry() {
      this.loading = true;

      const tempPUT = filter(this.todaysJobs, { 'Status': 1 });
      const tempPOST = filter(this.todaysJobs, { 'Status': 2 });
      const tempDELETE = filter(this.todaysJobs, { 'Status': 3 });

      // PUT (update)
      map(tempPUT, (item) => {
        console.log('WE ARE IN PUT (UPDATE)!');
         if ((item.Hours !== 0) && (item.Hours % 0.5 === 0) && (item.Hours !== '') && !(isNaN(item.Hours))) {
           console.log('1. WE ARE PAST PUT (UPDATE)S FIRST IF CHECK!');
            // If PTO
            if (item.Job_Id === 13) {
               const maxHours = userStore.ptoFlexInfo.PTO_Balance + item.Old_Hours + 40;
               if (item.Hours < 0) {
                  return;
               } else if (item.Hours > maxHours) {
                  item.Hours = maxHours;
                  if (item.Hours % 0.5 !== 0) {
                     item.Hours = Math.floor(item.Hours * 2) / 2;
                     if (item.Hours === 0) {
                         return;
                     }
                  }
               }

               fetch(`https://psitime.psnet.com/Api/Timesheet?Employee_Id=${userStore.employeeInfo.Employee_No}&Timesheet_Id=${item.Timesheet_Id}&Hours=${item.Hours}&Status=1`, {
                      method: 'PUT',
                      headers: {
                        'Authorization': 'Basic ' + base64.encode(`${userStore.windowsId}:${userStore.password}`)
                      }
                  })
                  .then(ApiUtils.checkStatus)
                  .then(response => {
                      // Response successful
                      console.log('\'PUT Charge (PTO)\' response successful: ', response);
                  })
                  .catch(e => {
                     console.log('\'PUT Charge (PTO)\' response NOT successful: ', e.response);
                     alert('PUT ERROR');
                     return;
                  });
            // If Flex hours
         } else if ((item.Job_Id === 11344) && (userStore.ptoFlexInfo.Flex_Allowed === true)) {
           console.log('2. WE ARE INSIDE PUT (UPDATE)S AND CONFIRMED FLEX');
               if (item.Hours < 0) {
                 console.log('3. WE ARE INSIDE PUT (UPDATE)S AND item.Hours < 0');
                  if (userStore.negFlex > 0) {  // Checks to see if I have ANY negative flex time
                    console.log('4. WE ARE INSIDE PUT (UPDATE)S AND item.Hours < 0');
                    const typedPosHours = Math.abs(item.Hours);
         				    let max = typedPosHours;
         				    // Max hours is QTD_Sum - QTD_Required (negFlex)

                    // Following is for testing ONLY
                    const negFlex = (item.Old_Hours < 0) ? (userStore.negFlex + Math.abs(item.Old_Hours)) : (userStore.negFlex - item.Old_Hours);

                    // For testing
                    console.log('New_Hours: ', item.Hours);
                    console.log('Old_Hours', item.Old_Hours);
                    console.log('Available Flex: ', userStore.negFlex);
         						// If what I typed is greater (or equal) than 80 and pool is greater (or equal) to 80
         						if (typedPosHours >= userStore.ptoFlexInfo.Flex_Limit && negFlex >= userStore.ptoFlexInfo.Flex_Limit) {
         							max = Math.floor(userStore.ptoFlexInfo.Flex_Limit * 2) / 2;
         						// If what I typed is less than than 80
         						} else if (typedPosHours > negFlex) {
         							max = Math.floor(negFlex * 2) / 2;
         						}

         						if (max === 0) {
         							return;
         						}

                     item.Hours = -1 * max;

                     fetch(`https://psitime.psnet.com/Api/Timesheet?Employee_Id=${userStore.employeeInfo.Employee_No}&Timesheet_Id=${item.Timesheet_Id}&Hours=${item.Hours}&Status=1`, {
                            method: 'PUT',
                            headers: {
                              'Authorization': 'Basic ' + base64.encode(`${userStore.windowsId}:${userStore.password}`)
                            }
                        })
                        .then(ApiUtils.checkStatus)
                        .then(response => {
                            // Response successful
                            console.log('\'PUT Charge (neg Flex)\' response successful: ', response);
                        })
                        .catch(e => {
                           console.log('\'PUT Charge (neg Flex)\' response NOT successful: ', e.response);
                           alert('PUT ERROR');
                           return;
                        });
                  } else {
                       // 'This entry would cause the flex time balance to go negative. Hours are being set to their previously submitted value';
                     return;
                  }
               } else if (item.Hours > 0) {
                 console.log('5. WE ARE INSIDE PUT (UPDATE)S AND item.Hours > 0');
                  // TO DO
                  const flexBalance = userStore.ptoFlexInfo.Flex_Balance + item.Old_Hours;
                  if (item.Hours > flexBalance) {
                     item.Hours = Math.floor(flexBalance * 2) / 2;
                     if (item.Hours === 0) {
                         return;
                     }
                  }

                  fetch(`https://psitime.psnet.com/Api/Timesheet?Employee_Id=${userStore.employeeInfo.Employee_No}&Timesheet_Id=${item.Timesheet_Id}&Hours=${item.Hours}&Status=1`, {
                         method: 'PUT',
                         headers: {
                           'Authorization': 'Basic ' + base64.encode(`${userStore.windowsId}:${userStore.password}`)
                         }
                     })
                     .then(ApiUtils.checkStatus)
                     .then(response => {
                         // Response successful
                         console.log('\'PUT Charge (pos Flex)\' response successful: ', response);
                     })
                     .catch(e => {
                        console.log('\'PUT Charge (pos Flex)\' response NOT successful: ', e.response);
                        alert('PUT ERROR');
                        return;
                     });
               }
            // End of Flex Hours
            } else if (item.jobId !== null) {
              console.log('6. WE ARE INSIDE PUT (UPDATE)S but not PTO or Flex Time');
               // Not PTO or Flex Time
               if (item.Hours < 0) {
                  return;
               }

               fetch(`https://psitime.psnet.com/Api/Timesheet?Employee_Id=${userStore.employeeInfo.Employee_No}&Timesheet_Id=${item.Timesheet_Id}&Hours=${item.Hours}&Status=1`, {
                      method: 'PUT',
                      headers: {
                        'Authorization': 'Basic ' + base64.encode(`${userStore.windowsId}:${userStore.password}`)
                      }
                  })
                  .then(ApiUtils.checkStatus)
                  .then(response => {
                      // Response successful
                      console.log('\'PUT Charge (normal)\' response successful: ', response);
                  })
                  .catch(e => {
                     console.log('\'PUT Charge (normal)\' response NOT successful: ', e.response);
                     alert('PUT ERROR');
                     return;
                  });
            }
         }
      });

      // POST (add new)
      map(tempPOST, (item) => {
        console.log('WE ARE IN POST (ADD NEW)!');
         if ((item.Hours !== 0) && (item.Hours % 0.5 === 0) && (item.Hours !== '') && !(isNaN(item.Hours))) {
            // If PTO
            if (item.Job_Id === 13) {
               const maxHours = userStore.ptoFlexInfo.PTO_Balance + 40;
               if (item.Hours < 0) {
                  return;
               } else if (item.Hours > maxHours) {
                  item.Hours = maxHours;
                  if (item.Hours % 0.5 !== 0) {
                     item.Hours = Math.floor(item.Hours * 2) / 2;
                     if (item.Hours === 0) {
                         return;
                     }
                  }
               }

               fetch(`https://psitime.psnet.com/Api/Timesheet?Employee_Id=${userStore.employeeInfo.Employee_No}&Job_Id=${item.Job_Id}&Hours=${item.Hours}&Status=2`, {
                      method: 'PUT',
                      headers: {
                        'Authorization': 'Basic ' + base64.encode(`${userStore.windowsId}:${userStore.password}`)
                      }
                  })
                  .then(ApiUtils.checkStatus)
                  .then(response => {
                      // Response successful
                      console.log('\'POST Charge\' response successful: ', response);
                  })
                  .catch(e => {
                     console.log('\'POST Charge\' response NOT successful: ', e.response);
                     alert('POST ERROR');
                     return;
                  });
            // If Flex hours
         } else if ((item.Job_Id === 11344) && (userStore.ptoFlexInfo.Flex_Allowed === true)) {
               if (item.Hours < 0) {
                  if (userStore.negFlex > 0) {  // Checks to see if I have ANY negative flex time
         						const typedPosHours = Math.abs(item.Hours);
         						let max = typedPosHours;
         						// Max hours is QTD_Sum - QTD_Required (negFlex)
         						// Check if max hours is 80 OR negFlex
         						const negFlex = userStore.negFlex;
         						// If what I typed is greater (or equal) than 80 and pool is greater (or equal) to 80
         						if (typedPosHours >= userStore.ptoFlexInfo.Flex_Limit && negFlex >= userStore.ptoFlexInfo.Flex_Limit) {
         							max = Math.floor(userStore.ptoFlexInfo.Flex_Limit * 2) / 2;
         						// If what I typed is less than than 80
         						} else if (typedPosHours > negFlex) {
         							max = Math.floor(negFlex * 2) / 2;
         						}

         						if (max === 0) {
         							return;
         						}

                     item.Hours = -1 * max;

                     fetch(`https://psitime.psnet.com/Api/Timesheet?Employee_Id=${userStore.employeeInfo.Employee_No}&Job_Id=${item.Job_Id}&Hours=${item.Hours}&Status=2`, {
                            method: 'PUT',
                            headers: {
                              'Authorization': 'Basic ' + base64.encode(`${userStore.windowsId}:${userStore.password}`)
                            }
                        })
                        .then(ApiUtils.checkStatus)
                        .then(response => {
                            // Response successful
                            console.log('\'POST Charge\' response successful: ', response);
                        })
                        .catch(e => {
                           console.log('\'POST Charge\' response NOT successful: ', e.response);
                           alert('POST ERROR');
                           return;
                        });
                  } else {
                       // 'This entry would cause the flex time balance to go negative. Hours are being set to their previously submitted value';
                     return;
                  }
               } else if (item.Hours > 0) {
                  // TO DO
                  const flexBalance = userStore.ptoFlexInfo.Flex_Balance;
                  if (item.Hours > flexBalance) {
                     item.Hours = Math.floor(flexBalance * 2) / 2;
                     if (item.Hours === 0) {
                         return;
                     }
                  }

                  fetch(`https://psitime.psnet.com/Api/Timesheet?Employee_Id=${userStore.employeeInfo.Employee_No}&Job_Id=${item.Job_Id}&Hours=${item.Hours}&Status=2`, {
                         method: 'PUT',
                         headers: {
                           'Authorization': 'Basic ' + base64.encode(`${userStore.windowsId}:${userStore.password}`)
                         }
                     })
                     .then(ApiUtils.checkStatus)
                     .then(response => {
                         // Response successful
                         console.log('\'POST Charge\' response successful: ', response);
                     })
                     .catch(e => {
                        console.log('\'POST Charge\' response NOT successful: ', e.response);
                        alert('POST ERROR');
                        return;
                     });
               }
            // End of Flex Hours
            } else if (item.jobId !== null) {
               // Not PTO or Flex Time
               if (item.Hours < 0) {
                  return;
               }

               fetch(`https://psitime.psnet.com/Api/Timesheet?Employee_Id=${userStore.employeeInfo.Employee_No}&Job_Id=${item.Job_Id}&Hours=${item.Hours}&Status=2`, {
                      method: 'PUT',
                      headers: {
                        'Authorization': 'Basic ' + base64.encode(`${userStore.windowsId}:${userStore.password}`)
                      }
                  })
                  .then(ApiUtils.checkStatus)
                  .then(response => {
                      // Response successful
                      console.log('\'POST Charge\' response successful: ', response);
                  })
                  .catch(e => {
                     console.log('\'POST Charge\' response NOT successful: ', e.response);
                     alert('POST ERROR');
                     return;
                  });
            }
         }
      });

      // DELETE
      map(tempDELETE, (item) => {
         if (item.Hours === 0) {
            fetch(`https://psitime.psnet.com/Api/Timesheet?Employee_Id=${userStore.employeeInfo.Employee_No}&Timesheet_Id=${item.Timesheet_Id}&Status=3`, {
                   method: 'PUT',
                   headers: {
                     'Authorization': 'Basic ' + base64.encode(`${userStore.windowsId}:${userStore.password}`)
                   }
               })
               .then(ApiUtils.checkStatus)
               .then(response => {
                   // Response successful
                   console.log('\'DELETE Charge\' response successful: ', response);
               })
               .catch(e => {
                  console.log('\'DELETE Charge\' response NOT successful: ', e.response);
                  alert('DELETE ERROR');
                  this.loading = false;
                  return;
               });
         }
      });

      this.fetchTodaysJobs();
      userStore.fetchPtoFlexInfo(); // Fetch main screen info again
      this.loading = false;
      Alert.alert(
         'Charges Updated!',
          ' '
      );
   }

   // Retrieve jobs from the server EVERY TIME RECENT JOBS BUTTON IS PRESSED!!!
   @action fetchTodaysJobs() {
		fetch(`https://psitime.psnet.com/Api/Timesheet?Employee_Id=${userStore.employeeInfo.Employee_No}`, {
            method: 'GET',
            headers: {
              'Authorization': 'Basic ' + base64.encode(`${userStore.windowsId}:${userStore.password}`)
            }
        })
        .then(ApiUtils.checkStatus)
        .then(response => response.json())
        .then(responseData => {
          this.todaysJobs = responseData;
        })
        .catch(e => {
          this.todaysJobs = [];
          this.errorMessage = `Error Retreiving Todays Jobs: ${e}`;
        });
   }

}

const todaysJobStore = new TodaysJobStore();
export default todaysJobStore;
