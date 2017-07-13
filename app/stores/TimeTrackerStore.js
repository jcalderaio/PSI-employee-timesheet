import { observable, computed, action } from 'mobx';
import { Alert } from 'react-native';
import base64 from 'base-64';
import { map, filter, some } from 'lodash';
import ApiUtils from '../components/ApiUtils'; // checks for errors in Fetches

//MobX
import userStore from './UserStore';  // Need user/pass
//import todaysJobStore from './TodaysJobStore';

class TimeTrackerStore {
   @observable timeTrackerList = null;
   @observable tempTimeTrackerList = null;
   @observable inTime = null;
   @observable outTime = null;
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

   }

   @action updateTimeTracker() {

   }
}

const timeTrackerStore = new TimeTrackerStore();
export default timeTrackerStore;
