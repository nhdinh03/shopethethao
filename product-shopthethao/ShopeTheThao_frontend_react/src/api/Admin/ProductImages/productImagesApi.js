import BaseApi from "api/global/baseApi";

class ProductImages extends BaseApi {
  constructor() {
    super("productimages");
  }
}

const productImagesApi = new ProductImages();
export default productImagesApi;
