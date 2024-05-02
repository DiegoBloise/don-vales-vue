/* import jwt from 'jsonwebtoken';

// Função para decodificar o token JWT e extrair o papel do usuário
export function getUserRoleFromToken(token) {
  try {
    // Decodifica o token JWT para obter o payload (conteúdo)
    const decodedToken = jwt.decode(token);

    // Verifica se o token foi decodificado com sucesso e se contém a reivindicação 'role'
    if (decodedToken && decodedToken.role) {
      return decodedToken.role; // Retorna o papel do usuário
    } else {
      return null; // Retorna null se o token não contiver o papel
    }
  } catch (error) {
    console.error('Erro ao decodificar o token JWT:', error);
    return null; // Retorna null em caso de erro na decodificação
  }
}

// Função para verificar se o usuário é administrador
export function isAdminUser(token) {
  const userRole = getUserRoleFromToken(token);
  return userRole === 'admin';
}
 */




// @ts-check
//import { defineStore, acceptHMRUpdate } from 'pinia'

/**
 * Simulate a login
 */
//function apiLogin(a: string, p: string) {
//  if (a === 'ed' && p === 'ed') return Promise.resolve({ isAdmin: true })
//  if (p === 'ed') return Promise.resolve({ isAdmin: false })
//  return Promise.reject(new Error('invalid credentials'))
//}

//export const useUserStore = defineStore({
//  id: 'user',
//  state: () => ({
//    name: 'Eduardo',
//    isAdmin: true,
//  }),

//  actions: {
//    logout() {
//      this.$patch({
//        name: '',
//        isAdmin: false,
 //     })

      // we could do other stuff like redirecting the user
   // },

    /**
     * Attempt to login a user
     */
 //   async login(user: string, password: string) {
 //     const userData = await apiLogin(user, password)

   //   this.$patch({
     //   name: user,
       // ...userData,
 //     })
   // },
 // },
//})

//if (import.meta.hot) {
//  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
//}