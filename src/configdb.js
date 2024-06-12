// Importar o Firebase Admin SDK
var admin = require("firebase-admin");

// Importar o arquivo de chave de serviço
var serviceAccount = require("./serviceAccountKey.json");

// Inicializar o Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://stripe-898e6-default-rtdb.firebaseio.com'
});

// Função para salvar dados no Realtime Database
function salvarDadosNoDatabase(dados) {
  // Obter uma referência para o Realtime Database
  var db = admin.database();

  // Salvar os dados em uma referência específica
  var ref = db.ref("restricted_access/secret_document");
  ref.push(dados);
}

function obterDados(emailClient) {
  return new Promise((resolve, reject) => {
    // Obter uma referência para o banco de dados
    var db = admin.database();

    // Referência para o local no banco de dados que você deseja pesquisar
    var ref = db.ref("restricted_access/secret_document");

    // Executar a consulta para encontrar o email com o nome específico
    ref.orderByChild("email").equalTo(emailClient).once("value", function (snapshot) {
      // Verificar se há dados retornados pela consulta
      if (snapshot.exists()) {
        // Iterar sobre os resultados da consulta 
        snapshot.forEach(function (childSnapshot) {
          var email = childSnapshot.val().email; // Recuperar o email específico
          if(email === emailClient) {
            resolve(email)
          }
        });
      } else {
        reject(false); // Rejeitar a promessa se nenhum usuário for encontrado
      }
    }, function (error) {
      reject("Erro ao pesquisar dados: " + error); // Rejeitar a promessa em caso de erro
    });
  })
}

module.exports = {
  salvarDadosNoDatabase,
  obterDados
};
