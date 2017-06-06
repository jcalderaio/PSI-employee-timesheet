import { observable, computed } from 'mobx';
import base64 from 'base-64';
import ApiUtils from '../components/ApiUtils'; // checks for errors in Fetches

class RecentJobsStore {
	@observable recentJobs = [];

    /**
   * Start upate loops.
   * @constructor
   */
    constructor() {
       this.fetchRecentJobs();
    }

    @function
	fetchRecentJobs() {
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
          console.log(`Error Retreiving Recent Jobs: ${e}`);
          this.recentJobs = [];
        });
    }
}

const recentJobsStore = new RecentJobsStore();
export default recentJobsStore;
