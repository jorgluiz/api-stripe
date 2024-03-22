const { stripe } = require('../config')

function createPaymentIntent(req, res) {
    // Acesso ao objeto req e res dentro desta função
    // Faça o que precisar com req e res aqui
    return stripe.paymentIntents.create({
        amount: 100, // Valor em centavos (ex: $20.00 seria 2000 centavos)
        currency: 'brl', // Moeda
        payment_method_types: ['card'], // Métodos de pagamento aceitos
        description: 'Pedido de exemplo', // Descrição do pagamento
    }).then(paymentIntent => {
        // Retorne o PaymentIntent ou faça algo com ele
        res.send(paymentIntent); // Envie a resposta diretamente daqui
    }).catch(error => {
        console.error('Erro ao criar PaymentIntent:', error);
        res.status(500).send('Erro ao criar PaymentIntent'); // Envie um erro de volta para o cliente
    });
}

module.exports = createPaymentIntent
