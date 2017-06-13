import { observable, computed, action } from 'mobx';
import base64 from 'base-64';
import { map, uniq } from 'lodash';
import ApiUtils from '../components/ApiUtils'; // checks for errors in Fetches
import userStore from './UserStore';

class AuthorizedJobStore {
   @observable authorizedJobs = null;
   @observable errorMessage = null;

   // Use these filters to compute the other arrays
   @observable clientFilter;
   @observable taskFilter;
   @observable subTask;
   @observable hours;

   @computed get isEmpty() {
       if (this.authorizedJobs !== null) {
           return !this.authorizedJobs.length;
       } else {
          throw new Error('authorizedJobs is null!');
       }
   }

   @computed get clientNamesWithoutDupes() {
      if (this.authorizedJobs !== null) {
         return uniq(map(this.authorizedJobs, 'Client_Name'));
      } else {
         throw new Error('authorizedJobs is null!');
      }
   }

   @computed get tasksWithoutDupes() {

   }

   @action setClientFilter(filter) {
      this.clientFilter = filter;
   }

   @action setTaskFilter(filter) {
      this.taskFilter = filter;
   }

   @action setSubTask(subTask) {
      this.subTask = subTask;
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
