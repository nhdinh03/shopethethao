import BaseApi from "api/global/baseApi";


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

 async getProductDetails(productsId) {
    try {
      const response = await this.getById(productsId);  
      return response.data;  
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
      return null;
    }
  }

  
}

const productsApi = new ProductsApi();
export default productsApi;
