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

      const tempPUT = filter(this.todaysJobs, { 'Status': 1, 'Job_Id': !13 && !11344 });
      const tempPOST = filter(this.todaysJobs, { 'Status': 2, 'Job_Id': !13 && !11344 });
      const tempDELETE = filter(this.todaysJobs, { 'Status': 3, 'Job_Id': !13 && !11344 });
      const tempPTO = filter(this.todaysJobs, { 'Job_Id': 13 });
      const tempFlex = filter(this.todaysJobs, { 'Job_Id': 11344 });

      // PTO
      map(tempPTO, (item) => {
         if (!isNaN(item.Hours) && (item.Hours !== 0) && (item.Hours % 0.5 === 0) && (item.Hours !== '') && !(item.Hours < 0)) {
            const maxHours = userStore.ptoFlexInfo.PTO_Balance + 40;
            if (item.Hours > maxHours) {
              Alert.alert('PTO balance is insufficient for this charge. Setting value to max available PTO');
              item.Hours = userStore.ptoFlexInfo.PTO_Balance + 40;
              if (item.Hours % 0.5 !== 0) {
                  item.hours = Math.floor(item.Hours * 2) / 2;
                  if (item.Hours === 0) {
                      alert('PTO balance is insufficient for this charge.');
                      this.loading = false;
                      return;
                  }
              }
            }
            fetch(`http://psitime.psnet.com/Api/Timesheet?Employee_Id=${userStore.employeeInfo.Employee_No}&Timesheet_Id=${item.Timesheet_Id}&Hours=${item.Hours}&Status=1`, {
                   method: 'PUT',
                   headers: {
                     'Authorization': 'Basic ' + base64.encode(`${userStore.windowsId}:${userStore.password}`)
                   }
               })
               .then(ApiUtils.checkStatus)
               .then(response => {
                   // Response successful
                   console.log('\'PUT PTO Charge\' response successful: ', response);
               })
               .catch(e => {
                  console.log('\'PUT PTO Charge\' response NOT successful: ', e.response);
                  alert('PUT ERROR');
                  this.loading = false;
                  return;
               });
         }
      });

      // Flex
      map(tempFlex, (item) => {
         if (!isNaN(item.Hours) && (item.Hours !== 0) && (item.Hours % 0.5 === 0) && (item.Hours !== '')) {
            if (item.Hours < 0) {
               if (userStore.negFlex > 0) {  // Checks to see if I have ANY negative flex time
                  const typedPosHours = Math.abs(item.Hours);
                  // Max hours is QTD_Sum - QTD_Required (negFlex)
                  // Check if max hours is 80 OR negFlex
                  let max = typedPosHours;
                  if (typedPosHours > userStore.negFlex) {
                     max = Math.floor(userStore.negFlex * 2) / 2;
                     Alert.alert(
                        'This entry would exceed the flex time limit. Setting value to max possible flex time.',
                        ' '
                     );
                  } else if (typedPosHours > userStore.ptoFlexInfo.Flex_Limit) {
                     max = Math.floor(userStore.ptoFlexInfo.Flex_Limit * 2) / 2;
                     Alert.alert(
                        'This entry would exceed the flex time limit. Setting value to max possible flex time.',
                        ' '
                     );
                  }
                  item.Hours = -1 * max;
                  fetch(`http://psitime.psnet.com/Api/Timesheet?Employee_Id=${userStore.employeeInfo.Employee_No}&Timesheet_Id=${item.Timesheet_Id}&Hours=${item.Hours}&Status=1`, {
                         method: 'PUT',
                         headers: {
                           'Authorization': 'Basic ' + base64.encode(`${userStore.windowsId}:${userStore.password}`)
                         }
                     })
                     .then(ApiUtils.checkStatus)
                     .then(response => {
                         // Response successful
                         console.log('\'PUT Flex Charge\' response successful: ', response);
                     })
                     .catch(e => {
                        console.log('\'PUT Flex Charge\' response NOT successful: ', e.response);
                        alert('PUT ERROR');
                        this.loading = false;
                        return;
                     });
               } else {
                  Alert.alert(
                     'This entry would cause the flex time balance to go negative. Hours are being set to their previously submitted value',
                     ' '
                  );
                  return;
               }
            } else if (item.Hours > 0) {
               const flexBalance = userStore.ptoFlexInfo.Flex_Balance;
               if (item.Hours > flexBalance) {
                  item.Hours = Math.floor(flexBalance * 2) / 2;
                  Alert.alert(
                     'Not enough flex hours in balance. Set to greatest value!',
                     ' '
                  );
               }
               fetch(`http://psitime.psnet.com/Api/Timesheet?Employee_Id=${userStore.employeeInfo.Employee_No}&Timesheet_Id=${item.Timesheet_Id}&Hours=${item.Hours}&Status=1`, {
                      method: 'PUT',
                      headers: {
                        'Authorization': 'Basic ' + base64.encode(`${userStore.windowsId}:${userStore.password}`)
                      }
                  })
                  .then(ApiUtils.checkStatus)
                  .then(response => {
                      // Response successful
                      console.log('\'PUT Flex + Charge\' response successful: ', response);
                  })
                  .catch(e => {
                     console.log('\'PUT Flex + Charge\' response NOT successful: ', e.response);
                     alert('PUT ERROR');
                     this.loading = false;
                     return;
                  });
            }
         }
      });

      // PUT
      map(tempPUT, (item) => {
         if (!isNaN(item.Hours) && (item.Hours !== 0) && (item.Hours % 0.5 === 0) && (item.Hours !== '') && !(item.Hours < 0)) {
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
         if (!isNaN(item.Hours) && (item.Hours !== 0) && (item.Hours % 0.5 === 0) && (item.Hours !== '') && !(item.Hours < 0)) {
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
      userStore.fetchPtoFlexInfo(); // Fetch main screen info again
      this.loading = false;
      //navigate('TodaysCharges');
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
