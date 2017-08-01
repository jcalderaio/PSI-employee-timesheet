import { Alert } from 'react-native';
import { observable, action, computed } from 'mobx';
import base64 from 'base-64';
import { sum, map, filter } from 'lodash';  // Import ONLY used functions from Lodash
import ApiUtils from '../components/ApiUtils'; // checks for errors in Fetches

class UserStore {
   @observable windowsId = null;
   @observable password = null;
   @observable employeeInfo = null;
   @observable loggedIn = false;

   @observable ptoFlexInfo = null;
   @observable loading = false;

   @action fetchPtoFlexInfo() {
		fetch(`http://psitime.psnet.com/Api/Summary?Employee_Id=${this.employeeInfo.Employee_No}`, {
            method: 'GET',
            headers: {
              'Authorization': 'Basic ' + base64.encode(`${this.windowsId}:${this.password}`)
            }
        })
        .then(ApiUtils.checkStatus)
        .then(response => response.json())
        .then(responseData => {
          this.ptoFlexInfo = responseData;
          console.log('\'ptoFlexInfo\' response successful: ', responseData);
        })
        .catch(e => {
          this.todaysJobs = [];
          console.log('\'Fetch ptoFlexInfo\' response NOT successful: ', e.response);
              alert('PUT ERROR');
        });
   }
}

const userStore = new UserStore();
export default userStore;
