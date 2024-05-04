/* eslint-disable prettier/prettier */
import { jwtDecode } from "jwt-decode";
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {

    const token = ref(localStorage.getItem("token"));

    function logout() {
        localStorage.removeItem("token");
        token.value = null;
    }

    function isLoggedIn() {
        return typeof token.value === 'string' && token.value.trim() !== '' && !isTokenExpired();
    }

    function isAdmin() {
        const decodedToken = getDecodedToken();
        return decodedToken && decodedToken.role === 'ADMIN';
    }

    function isTokenExpired() {
        const decodedToken = getDecodedToken();
        if (decodedToken && decodedToken.exp) {
            const currentTimeInSeconds = Math.floor(Date.now() / 1000); // Tempo atual em segundos
            return currentTimeInSeconds > decodedToken.exp;
        }
        return false;
    }

    function getDecodedToken() {
        try {
            const tokenValue = token.value;
            if (typeof tokenValue === 'string' && tokenValue.trim() !== '') {
                return jwtDecode(tokenValue);
            }
            return null;
        } catch (error) {
            console.error('Erro ao decodificar o token:', error);
            return null;
        }
    }

    function setToken(newToken) {
        localStorage.setItem("token", newToken);
        token.value = newToken;
    }

    return {
        token,
        logout,
        isAdmin,
        isLoggedIn,
        setToken
    }
});
