import axiosClient from "api/global/axiosClient";
import BaseApi from "api/global/baseApi";

class UserHistoryAPI extends BaseApi {
  constructor() {
    super("userhistory");
  }

  async getAllauthactivities() {
    return axiosClient.get(this.uri + "/auth-activities");
  }
  
  async getAlladminactivities() {
    return axiosClient.get(this.uri + "/admin-activities");
  }
}

const userHistoryApi = new UserHistoryAPI();
export default userHistoryApi;
