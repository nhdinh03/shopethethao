import BaseApi from "api/global/baseApi";

class DetailedInvoicesAPI extends BaseApi {
  constructor() {
    super("detailedInvoices");
  }
}

const detailedInvoicesAPI = new DetailedInvoicesAPI();
export default detailedInvoicesAPI;
