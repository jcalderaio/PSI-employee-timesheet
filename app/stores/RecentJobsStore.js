import { observable, computed } from 'mobx';
import base64 from 'base-64';
import ApiUtils from '../components/ApiUtils'; // checks for errors in Fetches

class RecentJobsStore {
   @observable recentJobs = null;

   @computed get isEmpty() {
       return this.recentJobs.length <= 0;
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
   fetchRecentJobs = () => {
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
          console.log(`Just filled recentJobStore with ${responseData}`);
        })
        .catch(e => {
          console.log(`Error Retreiving Recent Jobs: ${e}`);
          this.recentJobs = [];
        });
    }
}

const recentJobsStore = new RecentJobsStore();
export default recentJobsStore;
