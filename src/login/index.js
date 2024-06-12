// Importa a chave da API do Stripe a partir do arquivo de configuração
const { keyAPI } = require('../config')

// const firebaseFunctions = require('../configdb')

const Stripe = require('stripe'); // Importa a biblioteca do Stripe
const stripe = Stripe(keyAPI); // Inicializa o Stripe com a chave da API

async function loginClient(req, res, next) { // Define a função assíncrona loginClient
    const { email } = req.body // Extrai o email do corpo da requisição

    if (!email) return // Se o email não estiver presente, retorna imediatamente

    const customers = await stripe.customers.list({ // Lista os clientes do Stripe com o email fornecido
        email: email,
        limit: 1, // Limita o resultado a 1 cliente, pois o e-mail deve ser único
    });

    if (customers.data.length === 0) { // Se nenhum cliente for encontrado
        req.dados = null // Define req.dados como null
        return next() // Chama o próximo middleware
    }

    customers.data.map(data => { // Mapeia os dados do cliente encontrado
        req.dados = { // Define req.dados com o email e o id do cliente
            email: data.email,
            id: data.id,
        }
    })

    next() // Chama o próximo middleware
    
    // Chama o próximo middleware
    // firebaseFunctions.obterDados(email)
    //     .then(async (res) => {
    //         req.dados = {
    //             email: res,
    //         }
    //         next()                     
    //     }).catch(err => {
    //         console.log(err)
    //     })
}

module.exports = { // Exporta a função loginClient para que possa ser utilizada em outros arquivos
    loginClient
}
