import axios from 'axios';
import { API_URL } from '@env';

const api = axios.create({
  baseURL: API_URL, // URL base de la API
  timeout: 10000, // tiempo máximo de espera
});

export default api;
