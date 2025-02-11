import BaseApi from "api/global/baseApi";

class LockReasonsAPI extends BaseApi {
  constructor() {
    super("lockreasons");
  }
}

const lockreasonsApi = new LockReasonsAPI();
export default lockreasonsApi;
