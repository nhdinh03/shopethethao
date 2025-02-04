import BaseApi from "api/global/baseApi";

class SizeApi extends BaseApi {
  constructor() {
    super("size");
  }
}

const sizeApi = new SizeApi();
export default sizeApi;
