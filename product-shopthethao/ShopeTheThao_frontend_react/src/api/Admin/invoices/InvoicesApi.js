import BaseApi from "api/global/baseApi";
import axiosClient from "api/global/axiosClient";


class InvoicesApi extends BaseApi {
  constructor() {
    super("invoice");
  }
  async getById(id) {
    return axiosClient.get(`${this.uri}/get/${id}`);
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

  async updateStatus(id, { status, cancelReasonId, note }) {
    if (!status) {
      throw new Error('Status is required');
    }
    return this.update(`${id}/status`, { status, cancelReasonId, note });
  }
}

const invoicesApi = new InvoicesApi();
export default invoicesApi;
