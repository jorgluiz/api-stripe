const { keyAPI } = require('../config');  // Importa a chave da API do Stripe a partir do arquivo de configuração
const firebaseFunctions = require('../configdb');  // Importa as funções do Firebase a partir do arquivo de configuração do banco de dados

const Stripe = require('stripe');  // Importa a biblioteca do Stripe
const stripe = Stripe(keyAPI);  // Inicializa o Stripe com a chave da API

function createCustomer(req, res) {
    const { name, email } = req.body;  // Extrai o nome e o email do corpo da requisição

    // Cria um novo cliente no Stripe usando o nome e o email fornecidos
    return stripe.customers.create({
        name: name,
        email: email,
    }).then((response) => {
        // Se o cliente for criado com sucesso, salva os dados no banco de dados do Firebase
        firebaseFunctions.salvarDadosNoDatabase({email: response.email});
        res.redirect('/login');  // Redireciona o usuário para a página de login
    }).catch(error => {
        // Se houver algum erro, imprime no console e envia uma resposta de erro
        res.status(500).send('Erro ao criar cliente no Stripe', error);
    });
}

module.exports = {
    createCustomer  // Exporta a função createCustomer para que possa ser utilizada em outros arquivos
}


// salvando os dados fireBase 

// const { keyAPI } = require('../config');  // Importa a chave da API do Stripe a partir do arquivo de configuração
// const firebaseFunctions = require('../configdb');  // Importa as funções do Firebase a partir do arquivo de configuração do banco de dados

// const Stripe = require('stripe');  // Importa a biblioteca do Stripe
// const stripe = Stripe(keyAPI);  // Inicializa o Stripe com a chave da API

// function createCustomer(req, res) {
//     const { name, email } = req.body;  // Extrai o nome e o email do corpo da requisição

//     // Cria um novo cliente no Stripe usando o nome e o email fornecidos
//     return stripe.customers.create({
//         name: name,
//         email: email,
//     }).then((response) => {
//         // Se o cliente for criado com sucesso, salva os dados no banco de dados do Firebase
//         firebaseFunctions.salvarDadosNoDatabase({email: response.email});
//         res.redirect('/login');  // Redireciona o usuário para a página de login
//     }).catch(error => {
//         // Se houver algum erro, imprime no console e envia uma resposta de erro
//         res.status(500).send('Erro ao criar cliente no Stripe', error);
//     });
// }

// module.exports = {
//     createCustomer  // Exporta a função createCustomer para que possa ser utilizada em outros arquivos
// }
