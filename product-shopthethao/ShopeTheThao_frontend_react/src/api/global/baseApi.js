import axiosClient from './axiosClient';

class BaseApi {
    constructor(uri) {
        this.uri = uri;
    }

    async getById(id) {
        return axiosClient.get(`${this.uri}/${id}`);
    }

    async getAll() {
        return axiosClient.get(this.uri + '/get/all');
    }

    async create(data) {
        return axiosClient.post(this.uri, data);
    }

    async update(id, data) {
        return axiosClient.put(`${this.uri}/${id}`, data);
    }

    async delete(id) {
        return axiosClient.delete(`${this.uri}/${id}`);
    }

    async getByPage(page = 1, limit = 10, search = '') {
        const params = {
            page,
            limit,
            search,
        };
        const res = await axiosClient.get(this.uri, { params });
        return res.data;
    }

}

export default BaseApi;
