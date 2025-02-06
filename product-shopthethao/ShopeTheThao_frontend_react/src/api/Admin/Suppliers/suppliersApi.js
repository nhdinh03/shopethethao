import BaseApi from "api/global/baseApi";

class Suppliers  extends BaseApi {
  constructor() {
    super("suppliers");
  }
}

const suppliersApi  = new Suppliers ();
export default suppliersApi;
