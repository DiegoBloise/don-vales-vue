import { defineStore } from 'pinia'
import jwt from 'jsonwebtoken';


export const useAuthStore = defineStore('auth', {

    state: () => {
        return {
            token: ''
        };
    },

    actions: () => {

    },

    getters: {
        isAdmin: (state) => {
            try {
                const decodedToken = jwt.decode(state.token);

                if (decodedToken && decodedToken.role) {
                    var userRole = decodedToken.role;
                    return userRole === 'ADMIN';
                } else {
                    return null;
                }

            } catch (error) {
                console.error('Erro ao decodificar o token JWT:', error);
                return null;
            }
        }
    }
});