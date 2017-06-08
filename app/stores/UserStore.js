import { observable, computed, action } from 'mobx';
import base64 from 'base-64';
import ApiUtils from '../components/ApiUtils'; // checks for errors in Fetches

class UserStore {
   @observable windowsId = null;
   @observable password = null;
   @observable employeeInfo = null;

   @observable loggedIn = false;

}

const userStore = new UserStore();
export default userStore;
