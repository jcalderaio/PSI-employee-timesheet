import { observable, computed, action } from 'mobx';
import { Alert } from 'react-native';
import base64 from 'base-64';
import { map, filter, some } from 'lodash';
import ApiUtils from '../components/ApiUtils'; // checks for errors in Fetches

//MobX
import userStore from './UserStore';  // Need user/pass
import todaysJobStore from './TodaysJobStore';

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
       fetch(`https://psitime.psnet.com/Api/RecentJobs?Employee_ID=${userStore.employeeInfo.Employee_No}`, {
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
      let dupeFlag = false;
      let dupeCount = 0;
      let count = 0;

      if (flag === 'Selected') {
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
               count = 0;
               //Put all checked rows into one array
               const tempRecent = filter(this.recentJobs, { 'Is_Checked': true });
               //Iterate through all in array
               map(tempRecent, e => {
                  // If JobId not found in TodaysJobs
                  if (!some(todaysJobStore.todaysJobs, ['Job_Id', e.Job_Id])) {
                      // Add to todays jobs
                     todaysJobStore.todaysJobs.push(e);
                     ++count;
                  } else {
                      // Else increase duplicate count
                     ++dupeCount;
                     dupeFlag = true;
                  }
               });
            }
            if (count === 0) {
               Alert.alert('No Charges Added! All duplicates!', ' ');
            } else if (dupeFlag) {
               Alert.alert(`${count} Charges Added!`, `${dupeCount} duplicates NOT added.`);
            } else {
               Alert.alert(`${count} Charges Added!`, ' ');
            }
         }
         //Flag == Add All
      } else {
         map(this.recentJobs, e => {
            //Only add rows if not found in TodaysJobs (no duplicates)
            if (!some(todaysJobStore.todaysJobs, ['Job_Id', e.Job_Id])) {
               todaysJobStore.todaysJobs.push(e);
               ++count;
            } else {
               ++dupeCount;
               dupeFlag = true;
            }
         });
         if (count === 0) {
            Alert.alert('No Charges Added! All duplicates!', ' ');
         } else if (dupeFlag) {
            Alert.alert(`All Charges (Except for ${dupeCount} duplicates) Added!`, ' ');
         } else {
            Alert.alert('All Charges Added!', ' ');
         }
      }

      this.clearChecks();
      navigate('TodaysCharges');
   }
}

const recentJobStore = new RecentJobStore();
export default recentJobStore;
