import BaseApi from "api/global/baseApi";

class StockReceipts  extends BaseApi {
  constructor() {
    super("stockReceipts");
  }
}

const stock_ReceiptsAPi  = new StockReceipts ();
export default stock_ReceiptsAPi;
