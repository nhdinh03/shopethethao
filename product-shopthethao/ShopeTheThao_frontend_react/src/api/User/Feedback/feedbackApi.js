import axiosClient from "api/global/axiosClient";
import BaseApi from "api/global/baseApi";

class Feedback extends BaseApi {
  constructor() {
    super("feedback");
    this.cachedHeaders = null;
  }

  getHeaders() {
    if (!this.cachedHeaders) {
      const token = localStorage.getItem('token');
      this.cachedHeaders = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
    }
    return this.cachedHeaders;
  }

  async create(data) {
    return axiosClient.post(`${this.uri}/submit`, data, {
      headers: this.getHeaders(),
      timeout: 2000 // Giảm xuống 2 giây
    });
  }

  clearCache() {
    this.cachedHeaders = null;
  }
}

const feedbackApi = new Feedback();
export default feedbackApi;
