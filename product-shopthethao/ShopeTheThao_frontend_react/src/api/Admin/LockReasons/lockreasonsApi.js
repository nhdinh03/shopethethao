import axiosClient from "api/global/axiosClient";
import BaseApi from "api/global/baseApi";

class LockReasonsAPI extends BaseApi {
  constructor() {
    super("lockreasons");
  }

   async unlockAccount(id, data) {
          return axiosClient.put(`${this.uri}/unlock/${id}`, data);
      }
}

const lockreasonsApi = new LockReasonsAPI();
export default lockreasonsApi;
