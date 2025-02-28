import axiosClient from './axiosClient';

export const userHistoryApi = {
  getAll: () => {
    return axiosClient.get('/api/user-history');
  },
  updateReadStatus: (id) => {
    return axiosClient.put(`/api/user-history/${id}/read-status`);
  },
  markAsRead: (id) => {
    return axiosClient.post(`/api/userhistory-sse/${id}/mark-as-read`);
  }
};