import axiosClient from "api/global/axiosClient";
import funcUtils from "utils/funcUtils";

const url = 'upload';
const baseUrl = process.env.REACT_APP_ShopeTheThao_PRODUCTION_REST_API;
const headers = {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
};

const uploadApi = {
    // getActor: async () => {},
    post: async (originFileObj) => {
        var formData = new FormData();
        formData.append('file_to_upload', originFileObj);
        const dataUpload = await axiosClient.post(url, formData, headers);
        const imageName = dataUpload.data.fieldName;
        console.log(dataUpload);
        if (dataUpload.data.error) {
            funcUtils.notify(dataUpload.data.error, 'error');
            return null;
        }

        return imageName;
    },

    put: async (imgName, originFileObj) => {
        var formData = new FormData();
        formData.append('file_to_upload', originFileObj);
        const dataUpload = await axiosClient.put(url + '/' + imgName, formData, headers);
        if (dataUpload.data.error) {
            funcUtils.notify(dataUpload.data.error, 'error');
            return null;
        }

        const imageName = dataUpload.data.fieldName;
        return imageName;
    },
    get: (imageName) => {
        return baseUrl + 'upload/' + imageName;
    },

    delete: async (nameImage) => {
        return axiosClient.delete(url + '/' + nameImage);
    },
};

export default uploadApi;
