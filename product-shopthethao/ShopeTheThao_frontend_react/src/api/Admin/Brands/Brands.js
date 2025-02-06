import BaseApi from "api/global/baseApi";

class Brands extends BaseApi {
  constructor() {
    super("brands");
  }
}

const brandsApi = new Brands();
export default brandsApi;
