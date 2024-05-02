import jwt from 'jsonwebtoken';
import { defineStore } from 'pinia';
import { computed } from 'vue';


export const useAuthStore = defineStore('auth', () => {

    const token = computed(() => localStorage.getItem("token"))

    function logout() {
        this.$patch({
            token: null
        })
    }

    function isAdmin() {
        const decodedToken = jwt.decode(state.token);

        if (decodedToken && decodedToken.role) {
            var userRole = decodedToken.role;
            return userRole === 'ADMIN';
        } else {
            return false;
        }
    }

    function getTokenObject() {
        const decodedToken = jwt.decode(state.token);

        if (decodedToken) {
            console.log("DECODED: " + decodedToken)
            return decodedToken;
        }
    }


    return {
        token,
        logout,
        isAdmin,
        getTokenObject
    }
})