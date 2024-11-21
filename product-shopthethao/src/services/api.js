import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // URL backend của bạn
});

export const getProducts = () => API.get('/products');
export const getCategories = () => API.get('/categories');
export const getAccounts = () => API.get('/accounts');
