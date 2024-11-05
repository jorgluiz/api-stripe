const jwt = require('jsonwebtoken'); // Importa o módulo 'jsonwebtoken' para lidar com tokens JWT
const cookie = require('cookie'); // Importa o módulo 'cookie' para manipulação de cookies
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

// Função middleware assíncrona para autenticar o usuário
const authenticated = async (req, res, next) => {

  // Verifica se não há dados de usuário na requisição
  if (!req.dados) {
    return res.status(404).json({ error: 'Email not found' }); // Retorna um erro informando que o e-mail não foi encontrado
  }

  // Cria um payload com os dados do usuário
  const payload = {
    email: req.dados.email,
    id: req.dados.id
  };

  // Gera um token de acesso usando o JWT com o payload, a chave secreta e um tempo de expiração de 10 minutos
  const accessToken = jwt.sign({ payload }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });

  // Define o cookie de acesso com o token gerado
  const cookies = cookie.serialize('accessToken', accessToken, {
    path: '/', // Define o caminho do cookie como a raiz do domínio
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // Define a data de expiração do cookie para 24 horas a partir do momento atual
    sameSite: 'none', // Permite que o cookie seja enviado em solicitações cross-site
    secure: true // Garante que o cookie só seja enviado em conexões HTTPS
  });

  // Define o cabeçalho 'Set-Cookie' na resposta HTTP com o cookie criado
  res.setHeader('Set-Cookie', cookies);
  res.redirect('/home'); // Redireciona o usuário para a página '/home'
}

module.exports = {
  authenticated // Exporta a função 'authenticated' para ser utilizada em outros arquivos
}

// expiresIn ao criar um token JWT:
// 15m: 15 minutos
// 1h: 1 hora
// 1d: 1 dia
// 7d: 7 dias
// intervalos de tempo personalizados de acordo com suas necessidades, combinando diferentes unidades de tempo
//  30s: 30 segundos
//  2h30m: 2 horas e 30 minutos
//  14d6h: 14 dias e 6 horas