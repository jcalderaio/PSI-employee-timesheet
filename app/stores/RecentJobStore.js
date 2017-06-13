import { observable, computed, action } from 'mobx';
import base64 from 'base-64';
import ApiUtils from '../components/ApiUtils'; // checks for errors in Fetches
import userStore from './UserStore';

class RecentJobStore {
   @observable recentJobs = null;
   @observable errorMessage = null;

   @computed get isEmpty() {
       if (this.recentJobs !== null) {
           return !this.recentJobs.length;
       }
   }

   @action fetchRecentJobs() {
		fetch(`http://psitime.psnet.com/Api/RecentJobs?Employee_ID=${userStore.employeeInfo.Employee_No}`, {
            method: 'GET',
            headers: {
              'Authorization': 'Basic ' + base64.encode(`${userStore.windowsId}:${userStore.password}`)
            }
        })
        .then(ApiUtils.checkStatus)
        .then(response => response.json())
        .then(responseData => {
          this.recentJobs = responseData;
        })
        .catch(e => {
          this.recentJobs = [];
          this.errorMessage = `Error Retreiving Recent Jobs: ${e}`;
        });
   }
}

const recentJobStore = new RecentJobStore();
export default recentJobStore;
