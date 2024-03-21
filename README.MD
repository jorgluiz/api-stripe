# Payment Intent

Uma promessa de pagamento (Payment Intent) no contexto do Stripe é uma representação do compromisso do cliente em pagar uma quantia especificada pela sua empresa. Isso é útil em casos em que você deseja garantir fundos antes de finalizar a transação, como em pedidos de produtos sob demanda, reservas de hotéis ou aluguéis de carros.

# 1. Criar a Intenção de Pagamento

const paymentIntent = await stripe.paymentIntents.create({
  amount: 2000, // Valor em centavos (ex: $20.00 seria 2000 centavos)
  currency: 'usd', // Moeda
  payment_method_types: ['card'], // Métodos de pagamento aceitos
  description: 'Pedido de exemplo', // Descrição do pagamento
});

// Exiba o ID da promessa de pagamento
console.log(paymentIntent.id);

# 2. Exibir o Formulário de Pagamento para o Cliente (neste exemplo, suponha que o cliente tenha preenchido o formulário e os detalhes do pagamento foram enviados)

# - enderize um formulário de pagamento na sua página web e colete os detalhes do cliente

# - Suponha que os detalhes do pagamento foram coletados do formulário e armazenados em um objeto chamado paymentDetails

# 3. Enviar os Detalhes do Pagamento ao Stripe

const paymentMethod = await stripe.paymentMethods.create({
  type: 'card',
  card: {
    number: paymentDetails.cardNumber,
    exp_month: paymentDetails.expMonth,
    exp_year: paymentDetails.expYear,
    cvc: paymentDetails.cvc,
  },
});


# Agora você pode prosseguir para o passo 4 para confirmar a intenção de pagamento 

// Suponha que você tenha obtido o ID da intenção de pagamento
const paymentIntentId = 'pi_3OwWDCKntidoJfpr121LC9Yk';

 const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);