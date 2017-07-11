import { observable, computed, action } from 'mobx';
import { Alert } from 'react-native';
import base64 from 'base-64';
import { map, filter, some } from 'lodash';
import ApiUtils from '../components/ApiUtils'; // checks for errors in Fetches

//MobX
import userStore from './UserStore';  // Need user/pass
//import todaysJobStore from './TodaysJobStore';

class TimeTrackerStore {
   @observable timerTracker = null;
   @observable loading = false;

   @computed get isEmpty() {
       if (this.timerTracker !== null) {
           return !this.timerTracker.length;
       } else {
           return true;
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
         this.timerTracker = responseData;
       })
       .catch(e => {
         this.timerTracker = [];
         this.errorMessage = `Error Retreiving Recent Jobs: ${e}`;
       });
   }

   @action updateTimeTracker() {

   }

   @action resetAll() {

   }

   @action getCurrentTime() {

   }
}

const timeTrackerStore = new TimeTrackerStore();
export default timeTrackerStore;
