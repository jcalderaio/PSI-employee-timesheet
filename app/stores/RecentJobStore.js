import { observable, computed, action } from 'mobx';
import { Alert } from 'react-native';
import base64 from 'base-64';
import { map, filter, some, concat } from 'lodash';
import ApiUtils from '../components/ApiUtils'; // checks for errors in Fetches
import userStore from './UserStore';

//MobX
import todaysJobStore from '../stores/TodaysJobStore';

class RecentJobStore {
   @observable recentJobs = null;
   @observable errorMessage = null;

   @computed get isEmpty() {
       if (this.recentJobs !== null) {
           return !this.recentJobs.length;
       } else {
           return true;
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
      if (this.isEmpty) {
         Alert.alert('No recent charges available!', ' ');
         return;
      }

      if (flag === 'Selected') {
         let count = 0;
         map(this.recentJobs, (item) => {
             if (item.Is_Checked) {
                 ++count;
             }
         });
         // If no charges selected, do nothing & exit function
         if (count === 0) {
            Alert.alert('No charges selected!', ' ');
            return;
         } else {
            // Todays jobs empty, so just return all recentJobs
            if (todaysJobStore.isEmpty) {
               //Initialize todaysJobs array
               todaysJobStore.todaysJobs = filter(this.recentJobs, { 'Is_Checked': true });
            } else {
               const tempRecent = filter(this.recentJobs, { 'Is_Checked': true });
               map(tempRecent, e => todaysJobStore.todaysJobs.push(e));
            }
            Alert.alert('Selected Charges Added!', ' ');
         }
      } else {
         map(this.recentJobs, e => todaysJobStore.todaysJobs.push(e));
         Alert.alert('All Charges Added!', ' ');
      }

      this.clearChecks();
      navigate('TodaysCharges');
   }
}

const recentJobStore = new RecentJobStore();
export default recentJobStore;
