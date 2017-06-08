import { observable, computed, action } from 'mobx';
import base64 from 'base-64';
import ApiUtils from '../components/ApiUtils'; // checks for errors in Fetches

class RecentJobStore {
   @observable recentJobs = null;
   @observable errorMessage = null;

   @computed get isEmpty() {
       return !this.recentJobs.length;
   }

   /*DELETE - FOR TESTING*/
   addJob = () => {
       this.recentJobs.push({
           'Job_Id': 777,
           'Job_Number': '777',
           'Client_Name': 'John Inc.',
           'Task': 'Have fun!',
           'Sub_Task': 'Awesometime'
       });
   }
   /*END DELETE - FOR TESTING*/

   // Retrieve jobs from the server EVERY TIME RECENT JOBS BUTTON IS PRESSED!!!
   @action fetchRecentJobs() {
		fetch(`http://psitime.psnet.com/Api/RecentJobs?Employee_ID=${global.employeeInfo.Employee_No}`, {
            method: 'GET',
            headers: {
              'Authorization': 'Basic ' + base64.encode(`${global.windowsId}:${global.password}`)
            }
        })
        .then(ApiUtils.checkStatus)
        .then(response => response.json())
        .then(responseData => {
          this.recentJobs = responseData;
        })
        .catch(e => {
          this.errorMessage = `Error Retreiving Recent Jobs: ${e}`;
        });
    }
}

const recentJobStore = new RecentJobStore();
export default recentJobStore;
