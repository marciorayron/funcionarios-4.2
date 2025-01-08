// src/config/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const dbSetup = require('./dbSetup');
const db = require('./database');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const funcionarioRoutes = require('../routes/funcionarioRoutes');
const apiPopularDados = require('../services/apiPopularDados'); // Importa a rota de opções

// Carregar variáveis de ambiente
dotenv.config();

// Criar servidor Express
const app = express();

// Middleware
app.use(cors()); // Habilitar CORS
app.use(express.json()); // Parse de JSON
app.use(helmet());
app.use(morgan('combined')); // Log completo de requisições

// Limitação de requisições
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Limite de 100 requisições por IP
});
app.use(limiter);

// Chama a função setup do dbSetup para garantir que o banco de dados e tabelas sejam criados
dbSetup.setup().then(() => {
  console.log('Banco de dados e tabelas configurados com sucesso!');
}).catch(err => {
  console.error('Erro ao configurar o banco de dados:', err);
});

// Testar a conexão com o banco de dados
db.query('SELECT 1')
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
  })
  .catch((err) => {
    console.error('Erro ao conectar com o banco de dados:', err);
  });

// Rota de exemplo
app.get('/', (req, res) => {
  res.send('Servidor rodando!');
});

// Definir as rotas
app.use('/api', funcionarioRoutes);
app.use('/api', apiPopularDados.apiPopularDados);   // Usa a rota de opções

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
