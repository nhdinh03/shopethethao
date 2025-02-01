import BaseApi from "../../global/baseApi";

class ProductsApi extends BaseApi {
  constructor() {
    super("products");
  }

  async post(data, productsId) {
    try {
      const [product] = await Promise.all([productsApi.getById(productsId)]);
      const values = { ...data, product: product.data };
      console.log("values", values);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    }
  }
}

const productsApi = new ProductsApi();
export default productsApi;
