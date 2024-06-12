const { keyAPI } = require('../config')

const Stripe = require('stripe');
const stripe = Stripe(keyAPI);

const confirmPayment = async (req, res) => {

    const payload = {
        email: req.dados.email,
        id: req.dados.id
    }

    const paymentIntents = await stripe.paymentIntents.list({
        customer: payload.id,
        limit: 1,
    });

    const paymentIntentID = paymentIntents.data.map(data => {
        return data.id
    })


    // Use o método confirm da API do Stripe para confirmar e pagar a intenção de pagamento
    stripe.paymentIntents.confirm(paymentIntentID[0], { return_url: 'http://localhost:3000/pagamento-realizado-com-sucesso' })
        .then(paymentIntent => {
            // A intenção de pagamento foi confirmada e o pagamento foi processado com sucesso
            // console.log('Pagamento confirmado:', paymentIntent);
            res.redirect('/pagamento-realizado-com-sucesso')
        })
        .catch(error => {
            // Ocorreu um erro ao confirmar a intenção de pagamento
            // console.error('Erro ao confirmar pagamento:', error);
        });
}

module.exports = {
    confirmPayment
}