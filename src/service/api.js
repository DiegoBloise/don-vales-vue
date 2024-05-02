import axios from 'axios';
import { useAuthStore } from '@/store/AuthStore';

const auth = useAuthStore();

const api = axios.create({
    baseURL: 'http://localhost:8080/api/',
    headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + auth.token
    }
});

export default api;
