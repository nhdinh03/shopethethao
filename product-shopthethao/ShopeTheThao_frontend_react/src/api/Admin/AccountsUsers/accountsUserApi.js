import BaseApi from "api/global/baseApi";

class AccountsUser extends BaseApi {
  constructor() {
    super("accounts");
  }



}

const accountsUserApi = new AccountsUser();
export default accountsUserApi;
