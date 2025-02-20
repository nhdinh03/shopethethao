import BaseApi from "api/global/baseApi";
import axiosClient from "api/global/axiosClient";

class InvoicesApi extends BaseApi {
  constructor() {
    super("invoice");
  }
  async getById(id) {
    return axiosClient.get(`${this.uri}/get/${id}`);
  }

  async getPending(page = 1, limit = 5) {
    const params = { page, limit };
    try {
      const response = await axiosClient.get(`${this.uri}/pending`, { params });
      return {
        data: response.data?.data || [],
        totalItems: response.data?.totalItems || 0,
        totalPages: response.data?.totalPages || 0,
      };
    } catch (error) {
      console.error("Error fetching pending invoices:", error);
      return { data: [], totalItems: 0, totalPages: 0 };
    }
  }

  async getShipping(page = 1, limit = 5) {
    const params = {
      page,
      limit,
    };
    try {
      const response = await axiosClient.get(`${this.uri}/shipping`, {
        params,
      });

      return {
        data: response.data?.data || [],
        totalItems: response.data?.totalItems || 0,
        totalPages: response.data?.totalPages || 0,
      };
    } catch (error) {
      console.error("Error fetching shipping invoices:", error);
      return { data: [], totalItems: 0, totalPages: 0 };
    }
  }

  async getDelivered(page = 1, limit = 5) {
    const params = {
      page,
      limit,
    };
    try {
      const response = await axiosClient.get(`${this.uri}/delivered`, {
        params,
      });
      return {
        data: response.data?.data || [],
        totalItems: response.data?.totalItems || 0,
        totalPages: response.data?.totalPages || 0,
      };
    } catch (error) {
      console.error("Error fetching delivered invoices:", error);
      return { data: [], totalItems: 0, totalPages: 0 };
    }
  }

  async getCancelled(page = 1, limit = 5) {
    const params = {
      page,
      limit,
    };
    try {
      const response = await axiosClient.get(`${this.uri}/cancelled`, {
        params,
      });
      return {
        data: response.data?.data || [],
        totalItems: response.data?.totalItems || 0,
        totalPages: response.data?.totalPages || 0,
      };
    } catch (error) {
      console.error("Error fetching cancelled invoices:", error);
      return { data: [], totalItems: 0, totalPages: 0 };
    }
  }

  async updateStatus(id, { status, cancelReasonId, note }) {
    if (!status) {
      throw new Error("Status is required");
    }
    return this.update(`${id}/status`, { status, cancelReasonId, note });
  }
}

const invoicesApi = new InvoicesApi();
export default invoicesApi;

