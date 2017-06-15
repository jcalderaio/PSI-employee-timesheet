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

   @action setJobNumber() {
      if (this.authorizedJobs !== null && this.clientFilter !== null && this.taskFilter !== null && this.subTaskFilter !== null) {
         const temp = filter(this.authorizedJobs, { 'Client_Name': this.clientFilter, 'Task': this.taskFilter, 'Sub_Task': this.subTaskFilter });
         this.jobNumber = uniq(map(temp, 'Job_Number'));
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
}

const authorizedJobStore = new AuthorizedJobStore();
export default authorizedJobStore;
