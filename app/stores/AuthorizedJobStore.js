import { Alert } from 'react-native';
import { observable, computed, action } from 'mobx';
import base64 from 'base-64';
import { map, uniq, filter, some } from 'lodash';  // Import ONLY used functions from Lodash
import ApiUtils from '../components/ApiUtils'; // checks for errors in Fetches

//MobX
import userStore from './UserStore';  // Need user/pass
import todaysJobStore from './TodaysJobStore';

class AuthorizedJobStore {
   @observable authorizedJobs = null;

   // Use these filters to compute the other arrays
   @observable clientFilter = null;
   @observable taskFilter = null;
   @observable subTaskFilter = null;

   @observable jobNumber = null;
   @observable hours = null;

   // Used to Add new Entry
   @observable jobId = null;

   @observable loading = false;

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

   @action setJobId() {
      if (this.authorizedJobs !== null && this.clientFilter !== null && this.taskFilter !== null && this.subTaskFilter !== null && this.jobNumber !== null) {
          const temp = filter(this.authorizedJobs, { 'Job_Number': this.jobNumber });
          this.jobId = uniq(map(temp, 'Job_Id'));
          this.jobId = this.jobId[0];
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

   // Finish
   @action addEntry(navigate) {
      //   Use for debugging
      //console.log('empNo type: ', typeof userStore.employeeInfo.Employee_No, ' ', userStore.employeeInfo.Employee_No, ' ', userStore.employeeInfo.Employee_No.length);
      //console.log('jobid type: ', typeof this.jobId, ' ', this.jobId, ' ', this.jobId.length);
      //console.log('hours type: ', typeof this.hours, ' ', this.hours, ' ', this.hours.length);
      this.loading = true;

      // Run algorithm to retrieve JobId
      this.setJobId();

      // Make sure you are placing in database as a 'Number' object
      this.hours = Number(this.hours);

      if (this.hours === 0) {
          alert('You cannot enter \'0\' for hours');
          this.loading = false;
          return;
      } else if (isNaN(this.hours)) {
          alert('You must enter a Number!');
          this.loading = false;
          return;
      } else if (this.hours % 0.5 !== 0) {
          alert('You must enter hours in denominations of 0.5');
          this.loading = false;
          return;
      } else {
         // If a duplicate is found, then alert the user and return
         if (some(todaysJobStore.todaysJobs, ['Job_Id', this.jobId])) {
            Alert.alert(
               'You cannot add a duplicate! Please edit hours in Today\'s Charges',
               ' '
            );
            this.loading = false;
            return;
         }
         // PTO - Works!!!
         if ((this.jobId !== null) && (this.jobId === 13)) {
            const maxHours = userStore.ptoFlexInfo.PTO_Balance + 40;
            if (this.hours > maxHours) {
               Alert.alert('PTO balance is insufficient for this charge. Setting value to max available PTO');
               this.hours = userStore.ptoFlexInfo.PTO_Balance + 40;
               if (this.hours % 0.5 !== 0) {
                  this.hours = Math.floor(this.hours * 2) / 2;
               }
            }
            fetch(`http://psitime.psnet.com/Api/Timesheet?Employee_Id=${userStore.employeeInfo.Employee_No}&Job_Id=${this.jobId}&Hours=${this.hours}&Status=2`, {
                method: 'PUT',
                headers: {
                  'Authorization': 'Basic ' + base64.encode(`${userStore.windowsId}:${userStore.password}`)
                }
            })
            .then(ApiUtils.checkStatus)
            .then(response => {
                // Response successful
                console.log('\'Add Charge\' response successful: ', response);
                Alert.alert(
                   'Charge Added!',
                   ' '
                );
                this.clearAll();
                // Reload the jobs for today
                todaysJobStore.fetchTodaysJobs();
                userStore.fetchPtoFlexInfo();
                navigate('TodaysCharges');
                this.loading = false;
            })
            .catch(e => {
               console.log('\'Add Charge\' response NOT successful: ', e.response);
               alert(`${e}: Charge NOT added`);
               this.clearAll();
               this.loading = false;
               return;
            });
         } else if (this.jobId !== null) {
            // Add new entry to the database!
            fetch(`http://psitime.psnet.com/Api/Timesheet?Employee_Id=${userStore.employeeInfo.Employee_No}&Job_Id=${this.jobId}&Hours=${this.hours}&Status=2`, {
                method: 'PUT',
                headers: {
                  'Authorization': 'Basic ' + base64.encode(`${userStore.windowsId}:${userStore.password}`)
                }
            })
            .then(ApiUtils.checkStatus)
            .then(response => {
                // Response successful
                console.log('\'Add Charge\' response successful: ', response);
                Alert.alert(
                   'Charge Added!',
                   ' '
                );
                this.clearAll();
                // Reload the jobs for today
                todaysJobStore.fetchTodaysJobs();
                userStore.fetchPtoFlexInfo();
                navigate('TodaysCharges');
                this.loading = false;
            })
            .catch(e => {
               console.log('\'Add Charge\' response NOT successful: ', e.response);
               alert(`${e}: Charge NOT added`);
               this.clearAll();
               this.loading = false;
               return;
            });
         } else {
            alert('No JobId was found for this job!');
            this.clearAll();
            this.loading = false;
            return;
         }
      }
   }
}

const authorizedJobStore = new AuthorizedJobStore();
export default authorizedJobStore;
