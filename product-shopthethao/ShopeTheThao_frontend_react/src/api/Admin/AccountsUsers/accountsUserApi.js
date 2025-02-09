import BaseApi from "api/global/baseApi";

class AccountsUser extends BaseApi {
  constructor() {
    super("accounts");
  }

  // async signup(data) {
  //   return this.post("Usersignup", data);
  // }

}

const accountsUserApi = new AccountsUser();
export default accountsUserApi;
