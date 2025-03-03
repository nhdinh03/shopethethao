import axiosClient from "api/global/axiosClient";
import BaseApi from "api/global/baseApi";

class UserHistoryAPI extends BaseApi {
  constructor() {
    super("userhistory-sse");
  }

  async getAllauthactivities() {
    return axiosClient.get(this.uri + "/auth-activities");
  }

  async getAlladminactivities() {
    return axiosClient.get(this.uri + "/admin-activities");
  }

  async markAsRead(historyId) {
    return axiosClient.post(`${this.uri}/${historyId}/mark-as-read`);
  }

  async markAllAuthAsRead() {
    return axiosClient.post(`${this.uri}/mark-all-auth-as-read`);
  }

  async markAllAdminAsRead() {
    return axiosClient.post(`${this.uri}/mark-all-admin-as-read`);
  }

  async getUnreadCount() {
    return axiosClient.get(`${this.uri}/unread-count`);
  }

  async getActivityDetails(historyId) {
    return axiosClient.get(`${this.uri}/${historyId}`);
  }

  async getAll() {
    return axiosClient.get("/api/user-history");
  }
  async updateReadStatu(id) {
    return axiosClient.put(`/api/user-history/${id}/read-status`);
  }
}

const userHistoryApi = new UserHistoryAPI();
export default userHistoryApi;
