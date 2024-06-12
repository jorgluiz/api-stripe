const express = require('express')
const app = express()
const path = require('path')
const cookie = require('cookie')
const cookieParser = require('cookie-parser'); // Importe o pacote cookie-parser
const firebaseFunctions = require('./configdb')

// // Chamar a função para salvar dados no Realtime Database
// firebaseFunctions.salvarDadosNoDatabase(dados);
// firebaseFunctions.obterDados()

// Importação das funções dos outros módulos
const { createCustomer } = require('./createCustomers')
const { createPaymentIntent, listAllPaymentIntents, cancelPaymentIntent } = require('./paymentIntent')
const { loginClient } = require('./login')
const { paymentCreateToken } = require('./payment')
const { confirmPayment } = require('./confirmPayment')

const { authenticated } = require('./authenticateUser')
const { verifyToken } = require('./checkerToken')
const { checkTokenExpirationMiddleware } = require('./checkTokenExpiration ')

// Configuração dos middlewares globais
app.use(express.json()); // Middleware para análise de solicitações JSON
app.use(express.urlencoded({ extended: true })); // Middleware para análise de solicitações codificadas de formulário
app.use(cookieParser()); // Middleware para análise de cookies

// Middleware para analisar cookies
app.use((req, res, next) => {
  req.cookies = cookie.parse(req.headers.cookie || '');
  next();
});


// Configuração para servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, '../src')));

// Definição das rotas para servir arquivos HTML das páginas

app.get('/create-customers', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/createCustomers', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/login', 'index.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/home', 'index.html'));
});

app.get('/payment-intent', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/paymentIntent', 'index.html'));
});

app.get('/payment', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/payment', 'index.html'));
});

app.get('/confirm-payment', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/confirmPayment', 'index.html'));
});

app.get('/pagamento-realizado-com-sucesso', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/pagamentoRealizadoComSucesso', 'index.html'));
});
// __ views __

// Definição das rotas para manipular diferentes tipos de solicitações POST e GET
app.post('/verifyToken', verifyToken, (req, res) => {
  res.send('user authenticated');
})

app.post('/register-client', createCustomer)
app.post('/login-client', loginClient, authenticated)

app.post('/payment-intent', verifyToken, checkTokenExpirationMiddleware, createPaymentIntent)

app.post('/payment', verifyToken, checkTokenExpirationMiddleware, paymentCreateToken)

app.post('/confirm-payment', verifyToken, checkTokenExpirationMiddleware, confirmPayment)

app.get('/list-all-paymentIntents', listAllPaymentIntents)
app.post('/cancel-payment-intent', cancelPaymentIntent)

const { keyAPI } = require('./config')
const Stripe = require('stripe');
const stripe = Stripe(keyAPI);

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

module.exports = app