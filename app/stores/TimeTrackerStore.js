import React from 'react';
import { observable, computed, action } from 'mobx';
import { Alert } from 'react-native';
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

   @computed get isEmpty() {
       if (this.timeTrackerList !== null) {
           return !this.timeTrackerList.length;
       } else {
           return true;
       }
   }

   @computed get timeTrackerSize() {
       if (this.timeTrackerList !== null) {
           return this.timeTrackerList.length;
       } else {
          return 0;
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

   @action clearInfo() {
      this.timeTrackerList = null;
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

   @action clearAll() {
      this.timeTrackerList = null;
      this.tempTimeTrackerList = null;
      this.inTime = null;
      this.outTime = null;
      this.inTimeDisplay = null;
      this.outTimeDisplay = null;
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

   @action updateRow() {
      this.loading = true;

      // If only inTime then post new thing
      if (flag === 'POST') {
         if (this.inTime !== null && this.outTime === null) {
            fetch(`http://psitime.psnet.com/Api/TimeTracker?Employee_Id=${userStore.employeeInfo.Employee_No}&Status=2&In_Time=${this.inTime}`, {
                      method: 'PUT',
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
                     this.loading = false;
                     return;
                  });
         } else if (this.inTime !== null && this.outTime !== null) {
            fetch(`http://psitime.psnet.com/Api/TimeTracker?Employee_Id=${userStore.employeeInfo.Employee_No}&Status=2&In_Time=${this.inTime}&Out_Time=${this.outTime}`, {
                      method: 'PUT',
                      headers: {
                        'Authorization': 'Basic ' + base64.encode(`${userStore.windowsId}:${userStore.password}`)
                      }
                  })
                  .then(ApiUtils.checkStatus)
                  .then(response => {
                      // Response successful
                      this.clearAll();
                      console.log('\'Insert TimeTracker Row\' response successful: ', response);
                  })
                  .catch(e => {
                     console.log('\'Insert TimeTracker Row\' response NOT successful: ', e.response);
                     this.loading = false;
                     return;
                  });
         } else {
            this.loading = false;
            return;
         }
      }

      this.fetchTimeTracker();
      this.loading = false;

/*
      // PUT
      map(tempPUT, (item) => {
         if (!isNaN(item.Hours) && (item.Hours !== 0) && (item.Hours % 0.5 === 0) && (item.Hours !== '')) {
            fetch(`http://psitime.psnet.com/Api/Timesheet?Employee_Id=${userStore.employeeInfo.Employee_No}&Timesheet_Id=${item.Timesheet_Id}&Hours=${item.Hours}&Status=1`, {
                   method: 'PUT',
                   headers: {
                     'Authorization': 'Basic ' + base64.encode(`${userStore.windowsId}:${userStore.password}`)
                   }
               })
               .then(ApiUtils.checkStatus)
               .then(response => {
                   // Response successful
                   console.log('\'PUT Charge\' response successful: ', response);
               })
               .catch(e => {
                  console.log('\'PUT Charge\' response NOT successful: ', e.response);
                  alert('PUT ERROR');
                  this.loading = false;
                  return;
               });
         }
      });

      // POST
      map(tempPOST, (item) => {
         if (!isNaN(item.Hours) && (item.Hours !== 0) && (item.Hours % 0.5 === 0) && (item.Hours !== '')) {
            fetch(`http://psitime.psnet.com/Api/Timesheet?Employee_Id=${userStore.employeeInfo.Employee_No}&Job_Id=${item.Job_Id}&Hours=${item.Hours}&Status=2`, {
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
                  this.loading = false;
                  return;
               });
         }
      });

      // DELETE
      map(tempDELETE, (item) => {
         if (item.Hours === 0) {
            fetch(`http://psitime.psnet.com/Api/Timesheet?Employee_Id=${userStore.employeeInfo.Employee_No}&Timesheet_Id=${item.Timesheet_Id}&Status=3`, {
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
      this.loading = false;
      //navigate('TodaysCharges');
      Alert.alert(
         'Charges Updated!',
          ' '
      ); */
   }


}

const timeTrackerStore = new TimeTrackerStore();
export default timeTrackerStore;
