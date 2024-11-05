const { keyAPI } = require('../config') // Importa a chave da API do Stripe a partir do arquivo de configuração
const cookie = require('cookie'); // Importa a biblioteca 'cookie' para manipulação de cookies

const Stripe = require('stripe'); // Importa a biblioteca do Stripe
const stripe = Stripe(keyAPI); // Inicializa o Stripe com a chave da API

const paymentCreateToken = async (req, res) => { // Define a função assíncrona paymentCreateToken
    const { tokenCard } = req.body // Extrai o token do cartão que foi registrado e assim criar unm metodo de pagamento com token
    console.log(tokenCard, "passou por aqui ???")

    // esse cookie é criado para ter expiração do token de pagamento
    const cookies = cookie.serialize('token-payment', tokenCard, { // Serializa o cookie com o nome 'token-payment' e o token
        expires: new Date(Date.now() + 900000), // Define a data de expiração do cookie (aqui 15 minutos)
        path: '/confirm-payment', // Define o caminho do cookie (aqui '/confirm-payment')
        // domain: 'seusite.com' // Define o domínio do cookie (opcional)
    });

    // Define o cabeçalho 'Set-Cookie' na resposta HTTP
    res.setHeader('Set-Cookie', cookies); // Adiciona o cookie ao cabeçalho da resposta
    
    const paymentMethod = await stripe.paymentMethods.create({ // Cria um método de pagamento no Stripe
        type: 'card', // Define o tipo como 'card'
        card: {
            token: tokenCard, // Usa o token fornecido
        },
    });

    const payload = { // Define o payload com email e id do cliente
        email: req.dados.email, // Obtém o email do cliente dos dados da requisição
        id: req.dados.id // Obtém o id do cliente dos dados da requisição
    }

    const paymentIntents = await stripe.paymentIntents.list({ // Lista os intentos de pagamento do cliente no Stripe
        customer: payload.id, // Filtra pelo id do cliente
        limit: 1, // Limita o resultado a 1 intento de pagamento
    });

    const paymentIntentID = paymentIntents.data.map(data => { // Mapeia os dados dos intenção de pagamento
        return data.id // Retorna o id do intento de pagamento
    });

    await stripe.paymentIntents.update(paymentIntentID[0], { // Atualiza o intento de pagamento com o método de pagamento criado
        payment_method: paymentMethod.id, // Define o id do método de pagamento
    });

    res.redirect('/confirm-payment'); // Redireciona para a página de confirmação de pagamento
}

module.exports = { // Exporta a função paymentCreateToken para que possa ser utilizada em outros arquivos
    paymentCreateToken
}
