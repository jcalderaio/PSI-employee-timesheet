import { Alert } from 'react-native';
import { observable, computed, action } from 'mobx';
import base64 from 'base-64';
import { map, uniq, filter } from 'lodash';  // Import ONLY used functions from Lodash
import ApiUtils from '../components/ApiUtils'; // checks for errors in Fetches
import userStore from './UserStore';

class AuthorizedJobStore {
   @observable authorizedJobs = null;

   // Use these filters to compute the other arrays
   @observable clientFilter = null;
   @observable taskFilter = null;
   @observable subTaskFilter = null;

   @observable jobNumber = null;
   @observable hours = null;

   @computed get isEmpty() {
       if (this.authorizedJobs !== null) {
           return !this.authorizedJobs.length;
       } else {
          return true;
       }
   }

   @computed get jobNumberSize() {
       if (this.jobNumber !== null) {
           return this.jobNumber.length;
       } else {
          return 0;
       }
   }

   // Retrieves an array of Client_Names without duplicates
   @computed get clientNamesWithoutDupes() {
      if (this.authorizedJobs !== null) {
         return uniq(map(this.authorizedJobs, 'Client_Name'));
      }
   }

   // Retrieves an array of Tasks without duplicates
   @computed get tasksWithoutDupes() {
      if (this.authorizedJobs !== null && this.clientFilter !== null) {
         const temp = filter(this.authorizedJobs, { 'Client_Name': this.clientFilter });
         return uniq(map(temp, 'Task'));
      }
   }

   // Retrieves an array of Tasks without duplicates
   @computed get subTasksWithoutDupes() {
      if (this.authorizedJobs !== null && this.clientFilter !== null && this.taskFilter !== null) {
         const temp = filter(this.authorizedJobs, { 'Client_Name': this.clientFilter, 'Task': this.taskFilter });
         return uniq(map(temp, 'Sub_Task'));
      }
   }

   // Retrieves an array of Job Number's without duplicates
   @computed get jobNumberWithoutDupes() {
      if (this.authorizedJobs !== null && this.clientFilter !== null && this.taskFilter !== null && this.subTaskFilter !== null) {
         const temp = filter(this.authorizedJobs, { 'Client_Name': this.clientFilter, 'Task': this.taskFilter, 'Sub_Task': this.subTaskFilter });
         return uniq(map(temp, 'Job_Number'));
      }
   }

   @action setClientFilter(value) {
      this.clientFilter = value;
   }

   @action setTaskFilter(value) {
      this.taskFilter = value;
   }

   @action setSubTaskFilter(value) {
      this.subTaskFilter = value;
   }

   @action setJobNumber(value) {
       this.jobNumber = value;
   }

   @action setHours(value) {
      this.hours = value;
   }

   @action clearAll() {
       this.clientFilter = null;
       this.taskFilter = null;
       this.subTaskFilter = null;
       this.jobNumber = null;
       this.hours = null;
   }

   @action fetchAuthorizedJobs() {
		fetch(`http://psitime.psnet.com/Api/AuthorizedJobs?Employee_ID=${userStore.employeeInfo.Employee_No}`, {
            method: 'GET',
            headers: {
              'Authorization': 'Basic ' + base64.encode(`${userStore.windowsId}:${userStore.password}`)
            }
        })
        .then(ApiUtils.checkStatus)
        .then(response => response.json())
        .then(responseData => {
          this.authorizedJobs = responseData;
        })
        .catch(e => {
          this.authorizedJobs = [];
          this.errorMessage = `Error Retreiving Authorized Jobs: ${e}`;
        });
    }

   @action addEntry(navigate) {
         // Compares to string version of '0'
      if (this.hours == 0) {
          alert('You cannot enter \'0\' for hours');
          return;
      } else if (this.hours % 0.5 !== 0) {
          alert('You must enter hours in denominations of 0.5');
          return;
      } else {
         this.hours = Number(this.hours);

         //Do Stuff

         Alert.alert(
            'Charge Added!',
            ' '
         );
         this.clearAll();
         navigate('TodaysCharges');
      }
   }
}

const authorizedJobStore = new AuthorizedJobStore();
export default authorizedJobStore;
