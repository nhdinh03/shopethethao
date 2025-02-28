import BaseApi from "api/global/baseApi";

class AccountStaffApi extends BaseApi {
  constructor() {
    super("accountStaff");
  }
}

const accountsstaffApi = new AccountStaffApi();
export default accountsstaffApi;
