import { observable, computed } from 'mobx';
import base64 from 'base-64';
import ApiUtils from '../components/ApiUtils'; // checks for errors in Fetches

class RecentJobsStore {
   @observable recentJobs = null;

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

	@computed get isEmpty() {
    	return this.recentJobs.length <= 0;
  	}
}

const recentJobsStore = new RecentJobsStore();
export default recentJobsStore;
