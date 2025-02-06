import BaseApi from "api/global/baseApi";

class Stock_Receipts  extends BaseApi {
  constructor() {
    super("stockReceipts");
  }
}

const stock_ReceiptsAPi  = new Stock_Receipts ();
export default stock_ReceiptsAPi;
