const jwt = require('jsonwebtoken'); // Importa o módulo 'jsonwebtoken' para lidar com tokens JWT
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

// Middleware para verificar se o token expirou
const checkTokenExpirationMiddleware = (req, res, next) => {
    // Obtém o token do cabeçalho 'Authorization' da requisição
    const tokenHeader = req.headers['authorization'];
    const token = tokenHeader && tokenHeader.split(' ')[1]; // Extrai o token da string "Bearer <token>"

    // Verifica se o token existe
    if (!token) return res.status(401).json({ error: 'Restricted access' }); // Retorna um erro de acesso restrito caso não haja token

    try {
        // Verifica se o token está expirado
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (decodedToken.exp > decodedToken.iat) {
            req.decodedToken = decodedToken; // Adiciona os dados decodificados do token ao objeto de requisição para uso posterior
            return next(); // Chama a próxima função de middleware na cadeia de middleware
        } else {
            return res.status(401).json({ redirectTo: '/login' }); // Token expirado, redireciona para a página de login
        }
       
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            // Se o erro for de token expirado, redireciona para a página de login
            return res.status(401).json({ redirectTo: '/login' });
        } 
        // else {
        //     return res.status(500).json({ redirectTo: '/login' });
        // }
    }
};

module.exports = {
    checkTokenExpirationMiddleware // Exporta o middleware 'checkTokenExpirationMiddleware' para ser utilizado em outros arquivos
};
