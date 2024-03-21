const express = require('express');
const path = require('path')
const app = express()

const Stripe = require('stripe');
const stripe = Stripe('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');


app.use(express.json());

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
app.post('/intencao-pagamento', async (req, res) => {

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 100, // Valor em centavos (ex: $20.00 seria 2000 centavos)
    currency: 'brl', // Moeda
    payment_method_types: ['card'], // Métodos de pagamento aceitos
    description: 'Pedido de exemplo', // Descrição do pagamento
  });

  console.log(paymentIntent)
})

// // Definindo a diretiva Content-Security-Policy
// app.use((req, res, next) => {
//   res.setHeader(
//     'Content-Security-Policy',
//     "connect-src 'self' https://api.stripe.com https://errors.stripe.com https://r.stripe.com https://ppm.stripe.com"
//   );
//   next();
// });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

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

  await stripe.paymentIntents.confirm(
    'pi_3OwWDCKntidoJfpr121LC9Yk',
    {
      payment_method: 'card',
      return_url: 'https://www.example.com',
    }
  ).then(response  => {
    console.log(response)
  })

})


app.listen(3000, () => {
  console.log('listening on port 3000')
})