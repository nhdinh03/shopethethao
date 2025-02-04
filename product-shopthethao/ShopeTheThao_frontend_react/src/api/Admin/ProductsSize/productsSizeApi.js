import BaseApi from "api/global/baseApi";

class ProductsSizeApi extends BaseApi {
  constructor() {
    super("productsizes");
  }
}

const productsSizeApi = new ProductsSizeApi();
export default productsSizeApi;
