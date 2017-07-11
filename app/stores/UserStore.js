import { observable } from 'mobx';

class UserStore {
   @observable windowsId = null;
   @observable password = null;
   @observable employeeInfo = null;
   @observable loggedIn = false;
}

const userStore = new UserStore();
export default userStore;
