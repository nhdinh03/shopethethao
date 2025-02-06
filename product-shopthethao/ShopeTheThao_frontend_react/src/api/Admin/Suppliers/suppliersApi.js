import BaseApi from "api/global/baseApi";

class Suppliers  extends BaseApi {
  constructor() {
    super("supplier");
  }
}

const suppliersApi  = new Suppliers ();
export default suppliersApi;
