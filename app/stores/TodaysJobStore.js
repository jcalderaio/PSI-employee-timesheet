import { Alert } from 'react-native';
import { observable, computed, action, autorun } from 'mobx';
import base64 from 'base-64';
import { sum, map, filter } from 'lodash';  // Import ONLY used functions from Lodash
import ApiUtils from '../components/ApiUtils'; // checks for errors in Fetches

//MobX
import userStore from './UserStore';  // Need user/pass

class TodaysJobStore {
   @observable todaysJobs = null;
   @observable errorMessage = null;
   @observable loading = false;

   /*
   constructor() {
      autorun(() =>
         console.log(this.todaysJobs)
      );
   } */

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
        const arr = map(this.todaysJobs, 'Hours');
        return sum(arr);
     }
   }

   @action updateEntry(navigate) {
      this.loading = true;

      const tempPUT = filter(this.todaysJobs, { 'Status': 1 });
      const tempPOST = filter(this.todaysJobs, { 'Status': 2 });
      const tempDELETE = filter(this.todaysJobs, { 'Status': 3 });

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
      navigate('TodaysCharges');
      Alert.alert(
         'Charges Updated!',
          ' '
      );
   }

   // Retrieve jobs from the server EVERY TIME RECENT JOBS BUTTON IS PRESSED!!!
   @action fetchTodaysJobs() {
		fetch(`http://psitime.psnet.com/Api/Timesheet?Employee_Id=${userStore.employeeInfo.Employee_No}`, {
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
