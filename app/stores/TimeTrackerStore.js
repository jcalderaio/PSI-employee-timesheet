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

   @action clear() {
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

   @action insertRow() {
      this.loading = true;

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

      this.fetchTimeTracker();
      this.loading = false;
   }
}

const timeTrackerStore = new TimeTrackerStore();
export default timeTrackerStore;
