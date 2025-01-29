
import BaseApi from "../../global/baseApi";

class CategoriesApi extends BaseApi {
  constructor() {
    super("categories");
  }

}

const categoriesApi = new CategoriesApi();
export default categoriesApi;
