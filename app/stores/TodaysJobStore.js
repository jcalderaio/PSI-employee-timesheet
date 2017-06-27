import { observable, computed, action, autorun } from 'mobx';
import base64 from 'base-64';
import { sum, map } from 'lodash';  // Import ONLY used functions from Lodash
import ApiUtils from '../components/ApiUtils'; // checks for errors in Fetches
import userStore from './UserStore';

class TodaysJobStore {
   @observable todaysJobs = null;
   @observable errorMessage = null;

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

   @computed get totalHours() {
      if (this.todaysJobs === null) {
         return 0;
     } else {
        const arr = map(this.todaysJobs, 'Hours');
        return sum(arr);
     }
   }

   @action updateEntry() {
      // do stuff
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
