import BaseApi from "api/global/baseApi";

class ProductAttributes extends BaseApi {
  constructor() {
    super("productattributes");
  }
}

const productattributesApi = new ProductAttributes();
export default productattributesApi;
