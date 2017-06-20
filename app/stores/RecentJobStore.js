import { observable, computed, action } from 'mobx';
import { Alert } from 'react-native';
import base64 from 'base-64';
import { map } from 'lodash';
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

   @action clearChecks() {
       if (this.recentJobs !== null) {
           map(this.recentJobs, (item) => {
               item.Is_Checked = false;
           });
       }
   }

   @action addRecent(flag, navigate) {
      if (flag === 'Selected') {
         let count = 0;
         map(this.recentJobs, (item) => {
             if (item.Is_Checked) {
                 ++count;
             }
         });
         Alert.alert(`${count} Charges Added!`, ' ');
      } else {
         Alert.alert('All Charges Added!', ' ');
      }
      // Do stuff
      this.clearChecks();
      navigate('TodaysCharges');
   }
}

const recentJobStore = new RecentJobStore();
export default recentJobStore;
