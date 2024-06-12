const jwt = require('jsonwebtoken'); // Importa o módulo 'jsonwebtoken' para lidar com tokens JWT
const { TokenExpiredError } = require('jsonwebtoken'); // Importa o erro específico 'TokenExpiredError' do módulo 'jsonwebtoken'

require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

// Função middleware para verificar se o token é válido
const verifyToken = (req, res, next) => {

    // Obtém o token do cabeçalho 'Authorization' da requisição
    const tokenHeader = req.headers['authorization'];
    const token = tokenHeader && tokenHeader.split(' ')[1]; // Extrai o token da string "Bearer <token>"
    console.log(token, 'checkerToken'); // Exibe o token no console para fins de debug

    // Verifica se o token existe
    if (!token) return res.status(401).json({ error: 'Restricted access' }); // Retorna um erro de acesso restrito caso não haja token

    try {
        // Verifica se o token é válido utilizando a chave secreta definida no arquivo .env
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log(decoded, "jwt.verify"); // Exibe os dados decodificados do token no console para fins de debug

        // Define os dados do usuário presentes no token na requisição para uso posterior
        req.dados = {
            email: decoded.payload.email,
            id: decoded.payload.id,
        };
        next(); // Chama a próxima função middleware na cadeia de solicitações
    } catch (error) {
        console.log(error.name); // Exibe o nome do erro no console para fins de debug
        if (error.name === 'TokenExpiredError') {
            // Se o erro for de token expirado, redireciona para a página de login
            return res.status(401).json({ redirectTo: '/login' });
        }
    }
}

module.exports = {
    verifyToken // Exporta a função 'verifyToken' para ser utilizada em outros arquivos
}
