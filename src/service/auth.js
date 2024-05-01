import jwt from 'jsonwebtoken';

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
