import BaseApi from "api/global/baseApi";
import axiosClient from "api/global/axiosClient";

class CancelReasonApi extends BaseApi {
  constructor() {
    super("cancel-reason");
  }

  async getList() {
    return axiosClient.get(`${this.uri}/list`);
  }
}

const cancelReasonApi = new CancelReasonApi();
export default cancelReasonApi;
