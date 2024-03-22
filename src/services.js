const express = require('express');
const path = require('path')
const app = express()

const createPaymentIntent = require('./payment-intent/paymentIntents-create')


app.use(express.json());

// Configuração para servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'views', 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views', 'index.html'));
});

app.post('/pagar', async (req, res) => {

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'brl',
          product_data: {
            name: 'Produto',
            description: 'Descrição do produto',
          },
          unit_amount: 100, // Valor em centavos (ex: $20.00 seria 2000 centavos)
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'https://www.youtube.com.br',
    cancel_url: 'https://www.youtube.com.br',
  })
    .then(data => {
      res.send(data.url)
    })
})

// seguir fluxo para intenção de pagamento
app.post('/intencao-pagamento', createPaymentIntent)

// // Definindo a diretiva Content-Security-Policy
// app.use((req, res, next) => {
//   res.setHeader(
//     'Content-Security-Policy',
//     "connect-src 'self' https://api.stripe.com https://errors.stripe.com https://r.stripe.com https://ppm.stripe.com"
//   );
//   next();
// });


app.post('/process_payment', async (req, res) => {
  const id = req.body
  console.log(id)

  // const paymentMethod = await stripe.paymentMethods.create({
  //   type: 'card',
  //   card: {
  //     number: paymentDetails.cardNumber,
  //     exp_month: paymentDetails.expMonth,
  //     exp_year: paymentDetails.expYear,
  //     cvc: paymentDetails.cvc,
  //   },
  // });

  // console.log(paymentMethod)
})

app.post('/confirmar-interncao-pagamento', async (req, res) => {

  // Use o método confirm da API do Stripe para confirmar e pagar a intenção de pagamento
  stripe.paymentIntents.confirm('pi_3OwWDCKntidoJfpr121LC9Yk', { return_url: 'https://www.google.com.br' })
    .then(paymentIntent => {
      // A intenção de pagamento foi confirmada e o pagamento foi processado com sucesso
      console.log('Pagamento confirmado:', paymentIntent);
    })
    .catch(error => {
      // Ocorreu um erro ao confirmar a intenção de pagamento
      console.error('Erro ao confirmar pagamento:', error);
    });

})


app.post('/adicionar_cartao', async (req, res) => {
  const token = req.body.token;
  console.log(token)

  try {
      // Crie um método de pagamento usando o token do cartão
      const paymentMethod = await stripe.paymentMethods.create({
          type: 'card',
          card: {
              token: token,
          },
      });

      // Use o ID do método de pagamento para associá-lo à intenção de pagamento
      const paymentIntentId = 'pi_3OwWDCKntidoJfpr121LC9Yk'; // Substitua pelo ID da intenção de pagamento
      const updatedPaymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
          payment_method: paymentMethod.id,
      });

      res.json({ message: 'Cartão adicionado com sucesso!' });
  } catch (error) {
      console.error('Erro ao adicionar cartão:', error);
      res.status(500).json({ error: 'Erro ao adicionar cartão' });
  }
});


app.listen(3000, () => {
  console.log('listening on port 3000')
})