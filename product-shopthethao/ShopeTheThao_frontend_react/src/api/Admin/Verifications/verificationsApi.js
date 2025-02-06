import BaseApi from "api/global/baseApi";

class Verifications extends BaseApi {
  constructor() {
    super("verifications");
  }
}

const verificationsApi = new Verifications();
export default verificationsApi;
