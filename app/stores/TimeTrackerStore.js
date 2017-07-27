import React from 'react';
import { observable, computed, action } from 'mobx';
import { Alert, AsyncStorage } from 'react-native';
import base64 from 'base-64';
import { map, filter, some } from 'lodash';
import ApiUtils from '../components/ApiUtils'; // checks for errors in Fetches

//MobX
import userStore from './UserStore';  // Need user/pass

class TimeTrackerStore {
   @observable timeTrackerList = null;
   @observable tempTimeTrackerList = null;
   @observable inTime = null;
   @observable outTime = null;
   @observable inTimeDisplay = null;
   @observable outTimeDisplay = null;
   @observable loading = false;

   @action getHours(hours) {
       if (hours === 0) {
         return '12 am';
       } else if (hours <= 11) {
         return hours % 12 + ' am';
       } else if (hours === 12) {
         return '12 pm';
       } else {
         return hours % 12 + ' pm';
       }
   }

   @computed get size() {
      if (this.timeTrackerList === null) {
         return 0;
     } else {
         return this.timeTrackerList.length;
     }
   }

   @computed get hasUncommitted() {
       // If todaysJobs null, impossible to have non-Status: 0 jobs
       if (this.timeTrackerList === null) {
           return false;
       } else {
           // If found jobs with Status !== 0, then there are uncommitted
           const temp = filter(this.timeTrackerList, (item) =>
             item.Status !== 0
           );

           return (temp.length > 0);
       }
   }

   @computed get isEmpty() {
       if (this.timeTrackerList !== null) {
           return !this.timeTrackerList.length;
       } else {
           return true;
       }
   }

   @action clearAll() {
      this.inTime = null;
      this.outTime = null;
      this.inTimeDisplay = null;
      this.outTimeDisplay = null;
   }

   @action getTime(hours, minutes) {
      if (hours === 0) {
        return `12:${minutes} am`;
      } else if (hours <= 11) {
        return `${hours % 12}:${minutes} am`;
      } else if (hours === 12) {
        return `12:${minutes} pm`;
      } else {
        return `${hours % 12}:${minutes} pm`;
      }
	}

   @action parseTime(str) {
      const afterT = str.substr(str.indexOf('T') + 4);
      const hours = afterT.substr(0, 1);
      const minutes = afterT.substr(3, 4);
      this.getTime(hours, minutes);
   }

   @action fetchTimeTracker() {
       fetch(`http://psitime.psnet.com/Api/TimeTracker?Employee_Id=${userStore.employeeInfo.Employee_No}`, {
           method: 'GET',
           headers: {
             'Authorization': 'Basic ' + base64.encode(`${userStore.windowsId}:${userStore.password}`)
           }
       })
       .then(ApiUtils.checkStatus)
       .then(response => response.json())
       .then(responseData => {
         this.timeTrackerList = responseData;
       })
       .catch(e => {
         this.timeTrackerList = [];
         this.errorMessage = `Error Retreiving Recent Jobs: ${e}`;
       });
   }

   @action resetAll() {
      // delete all
   }

   @action deleteRow(Tracker_Id) {
      this.loading = true;

      fetch(`http://psitime.psnet.com/Api/TimeTracker?Employee_Id=${userStore.employeeInfo.Employee_No}&Status=3&Tracker_Id=${Tracker_Id}`, {
                method: 'PUT',
                headers: {
                  'Authorization': 'Basic ' + base64.encode(`${userStore.windowsId}:${userStore.password}`)
                }
            })
            .then(ApiUtils.checkStatus)
            .then(response => {
                // Response successful
                console.log('\'TimeTracker Row\' successfully deleted: ', response);
            })
            .catch(e => {
               console.log('\'Insert TimeTracker Row\' response NOT successful: ', e.response);
               this.loading = false;
               return;
            });

      this.fetchTimeTracker();
      this.loading = false;
   }

   @action updateRow(flag, Tracker_Id) {
      this.loading = true;

      if (flag === 'PUT') {
         if (this.inTime !== null && this.outTime === null) {
            fetch(`http://psitime.psnet.com/Api/TimeTracker?Employee_Id=${userStore.employeeInfo.Employee_No}&Status=1&In_Time=${this.inTime}&Tracker_Id=${Tracker_Id}`, {
                      method: 'PUT', //PUT
                      headers: {
                        'Authorization': 'Basic ' + base64.encode(`${userStore.windowsId}:${userStore.password}`)
                      }
                  })
                  .then(ApiUtils.checkStatus)
                  .then(response => {
                      // Response successful
                      console.log('\'PUT inTime Tracker Row\' response successful: ', response);
                  })
                  .catch(e => {
                     console.log('\'PUT inTime Tracker Row\' response NOT successful: ', e.response);
                     this.clearAll();
                     this.loading = false;
                     return;
                  });
         } else if (this.inTime !== null && this.outTime !== null) {
             fetch(`http://psitime.psnet.com/Api/TimeTracker?Employee_Id=${userStore.employeeInfo.Employee_No}&Status=1&In_Time=${this.inTime}&Out_Time=${this.outTime}&Tracker_Id=${Tracker_Id}`, {
                   method: 'PUT', //PUT
                   headers: {
                     'Authorization': 'Basic ' + base64.encode(`${userStore.windowsId}:${userStore.password}`)
                   }
               })
               .then(ApiUtils.checkStatus)
               .then(response => {
                   // Response successful
                   console.log('\'PUT TimeTracker Row\' response successful: ', response);
               })
               .catch(e => {
                  console.log('\'PUT TimeTracker Row\' response NOT successful: ', e.response);
                  this.clearAll();
                  this.loading = false;
                  return;
               });
         } else if (this.inTime === null && this.outTime !== null) {
             fetch(`http://psitime.psnet.com/Api/TimeTracker?Employee_Id=${userStore.employeeInfo.Employee_No}&Status=1&In_Time=${this.inTime}&Out_Time=${this.outTime}&Tracker_Id=${Tracker_Id}`, {
                   method: 'PUT', //PUT
                   headers: {
                     'Authorization': 'Basic ' + base64.encode(`${userStore.windowsId}:${userStore.password}`)
                   }
               })
               .then(ApiUtils.checkStatus)
               .then(response => {
                   // Response successful
                   console.log('\'Insert TimeTracker Row\' response successful: ', response);
               })
               .catch(e => {
                  console.log('\'Insert TimeTracker Row\' response NOT successful: ', e.response);
                  this.clearAll();
                  this.loading = false;
                  return;
               });
         }
      } else if (flag === 'POST') {
         if (this.inTime !== null && this.outTime === null) {
            fetch(`http://psitime.psnet.com/Api/TimeTracker?Employee_Id=${userStore.employeeInfo.Employee_No}&Status=2&In_Time=${this.inTime}`, {
                      method: 'PUT', //POST
                      headers: {
                        'Authorization': 'Basic ' + base64.encode(`${userStore.windowsId}:${userStore.password}`)
                      }
                  })
                  .then(ApiUtils.checkStatus)
                  .then(response => {
                      // Response successful
                      console.log('\'Insert TimeTracker Row\' response successful: ', response);
                  })
                  .catch(e => {
                     console.log('\'Insert TimeTracker Row\' response NOT successful: ', e.response);
                     this.clearAll();
                     this.loading = false;
                     return;
                  });
           } else if (this.inTime !== null && this.outTime !== null) {
             fetch(`http://psitime.psnet.com/Api/TimeTracker?Employee_Id=${userStore.employeeInfo.Employee_No}&Status=2&In_Time=${this.inTime}&Out_Time=${this.outTime}`, {
                        method: 'PUT', //POST
                        headers: {
                          'Authorization': 'Basic ' + base64.encode(`${userStore.windowsId}:${userStore.password}`)
                        }
                    })
                    .then(ApiUtils.checkStatus)
                    .then(response => {
                        // Response successful
                        console.log('\'Insert TimeTracker Row\' response successful: ', response);
                    })
                    .catch(e => {
                       console.log('\'Insert TimeTracker Row\' response NOT successful: ', e.response);
                       this.clearAll();
                       this.loading = false;
                       return;
                    });
            }
      }
      this.fetchTimeTracker();
      this.clearAll();
      this.loading = false;
      }
}


const timeTrackerStore = new TimeTrackerStore();
export default timeTrackerStore;
