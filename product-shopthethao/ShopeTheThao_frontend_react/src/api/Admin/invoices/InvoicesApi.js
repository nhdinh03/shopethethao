import axiosClient from "api/global/axiosClient";
import BaseApi from "api/global/baseApi";

class InvoicesApi extends BaseApi {
  constructor() {
    super("invoice");
  }

  async getPending() {
    return axiosClient.get(this.uri + "/pending");
  }
  async getShipping() {
    return axiosClient.get(this.uri + "/shipping");
  }

  async getDelivered() {
    return axiosClient.get(this.uri + "/delivered");
  }

  async getCancelled() {
    return axiosClient.get(this.uri + "/cancelled");
  }

  async updateStatus(id, newStatus) {
    return this.update(`${id}/status`, { status: newStatus });
  }
}

const invoicesApi = new InvoicesApi();
export default invoicesApi;
