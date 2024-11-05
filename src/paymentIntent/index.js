// Importa a chave da API de configuração
const { keyAPI } = require('../config')

// Importa a biblioteca Stripe
const Stripe = require('stripe');
const stripe = Stripe(keyAPI);

// Função para criar uma intenção de pagamento
async function createPaymentIntent(req, res) {
  try {
    // Extrai o valor do corpo da requisição
    const { amount } = req.body;

    let convertedvalue = parseFloat(amount.replace(",", ""));
    console.log(convertedvalue)

    // Verifica se o valor é válido
    if (!convertedvalue || convertedvalue <= 0) {
      return res.status(400).send({ error: "Invalid amount" });
    }

    // Define os dados do usuário logado
    const payload = {
      email: req.dados.email,
      id: req.dados.id
    };

    // Cria uma intenção de pagamento associada ao usuário logado
    const paymentIntent = await stripe.paymentIntents.create({
      amount: convertedvalue, // Valor em centavos (ex: $20.00 seria 2000 centavos)
      currency: 'brl', // Moeda
      payment_method_types: ['card'], // Métodos de pagamento aceitos
      description: 'Pedido de exemplo', // Descrição do pagamento
      customer: payload.id, // ID do cliente associado ao pagamento
    });

    res.redirect('/payment'); // Redireciona para a rota '/payment' após a criação da intenção de pagamento
  } catch (error) {
    console.error('Erro ao criar PaymentIntent:', error);
    res.status(500).send({ error: 'Erro ao criar PaymentIntent' }); // Envie um erro de volta para o cliente em caso de falha na criação da intenção de pagamento
  }
}

// Função para listar todas as intenções de pagamento
async function listAllPaymentIntents(req, res) {
  try {
    // Lista todas as intenções de pagamento usando a API do Stripe
    const paymentIntents = await stripe.paymentIntents.list();
    res.send(paymentIntents); // Retorna a lista de intenções de pagamento
  } catch (error) {
    console.error('Erro ao listar PaymentIntents:', error);
    res.status(500).send({ error: 'Erro ao listar PaymentIntents' }); // Envie um erro de volta para o cliente em caso de falha na listagem
  }
}

// Função para cancelar uma intenção de pagamento
async function cancelPaymentIntent(req, res) {
  const { paymentIntentId } = req.params;

  try {
    // Cancela a intenção de pagamento especificada
    const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);

    // Verifica se o status do PaymentIntent é "canceled" antes de enviar uma resposta
    if (paymentIntent.status === "canceled") {
      return res.send({ success: "PaymentIntent cancelled successfully." }); // Retorna sucesso se o pagamento for cancelado com sucesso
    } else {
      return res.status(400).send({ error: "Unable to cancel PaymentIntent." }); // Retorna erro se não for possível cancelar o pagamento
    }
  } catch (error) {
    console.error('Erro ao cancelar PaymentIntent:', error);
    if (error.raw && error.raw.payment_intent) {
      const { status } = error.raw.payment_intent;
      if (status === "canceled") {
        return res.status(400).send({ error: "You cannot cancel this PaymentIntent because it has a status of canceled." }); // Retorna erro se a intenção de pagamento já estiver cancelada
      } else if (status === "succeeded") {
        return res.status(400).send({ error: "You cannot cancel this PaymentIntent because it has a status of succeeded." }); // Retorna erro se a intenção de pagamento já estiver concluída com sucesso
      }
    }
    res.status(500).send({ error: 'Erro ao cancelar PaymentIntent' }); // Envie um erro de volta para o cliente em caso de falha no cancelamento
  }
}

// Exporta as funções para serem utilizadas em outros arquivos
module.exports = {
  createPaymentIntent,
  listAllPaymentIntents,
  cancelPaymentIntent
}
