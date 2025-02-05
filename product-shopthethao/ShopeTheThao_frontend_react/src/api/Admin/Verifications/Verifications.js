import BaseApi from "api/global/baseApi";

class Verifications extends BaseApi {
  constructor() {
    super("verifications");
  }
}

const verifications = new Verifications();
export default verifications;
