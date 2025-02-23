import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true; 

// No need to manually include "Authorization: Bearer token" in headers, the browser will send the token automatically

// ✅ Register a New User
export const register = async (username: string, email: string, password: string) => {
    return axios.post(`${API_BASE_URL}/accounts/register/`, { 
        username, 
        email, 
        password 
    });
};

// ✅ Login (Stores JWT in HTTP-Only Cookies)
export const login = async (username: string, password: string) => {
    return axios.post(`${API_BASE_URL}/accounts/login/`, { username, password }, { withCredentials: true });
};

// ✅ Logout (Clears HTTP-Only Cookies)
export const logout = async () => {
    return axios.post(`${API_BASE_URL}/accounts/logout/`, {
        withCredentials: true,
    });
};

// ✅ Get User Profile (Uses JWT from Cookies)
export const getProfile = async () => {
    return axios.get(`${API_BASE_URL}/accounts/profile/`, {
        withCredentials: true,
    });
};