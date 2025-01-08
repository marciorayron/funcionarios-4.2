// src/config/dbSetup.js
const pool = require('./database');

const createDatabase = async () => {
  const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};`;

  try {
    const connection = await pool.getConnection();
    await connection.query(createDatabaseQuery);
    console.log(`Banco de dados ${process.env.DB_NAME} criado com sucesso!`);
    connection.release();
  } catch (err) {
    console.error('Erro ao criar o banco de dados:', err.message);
  }
};

const createTables = async () => {
  const queries = [
    `CREATE TABLE IF NOT EXISTS projeto (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(50) NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS linha (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(50) NOT NULL,
      projeto_id INT,
      FOREIGN KEY (projeto_id) REFERENCES projeto(id)
    );`,
    `CREATE TABLE IF NOT EXISTS cargo (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(50) NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS funcao (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(50) NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS turno (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(50) NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS funcionario (
      id INT AUTO_INCREMENT PRIMARY KEY,
      matricula VARCHAR(50) NOT NULL,
      nome VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      whatsapp VARCHAR(15) NOT NULL,
      telefone VARCHAR(15) NOT NULL,
      data_admissao DATE NOT NULL,
      onibus VARCHAR(50) NOT NULL,
      ponto_referencia VARCHAR(255) NOT NULL,
      cep VARCHAR(8) NOT NULL,
      logradouro VARCHAR(255) NOT NULL,
      numero VARCHAR(10) NOT NULL,
      bairro VARCHAR(100) NOT NULL,
      cidade VARCHAR(100) NOT NULL,
      estado VARCHAR(2) NOT NULL,
      projeto VARCHAR(25) NOT NULL,
      linha VARCHAR(25) NOT NULL,
      cargo VARCHAR(25) NOT NULL,
      funcao VARCHAR(25) NOT NULL,
      turno VARCHAR(25) NOT NULL
    );`
  ];

  try {
    const connection = await pool.getConnection();
    for (const query of queries) {
      await connection.query(query);
    }
    console.log('Tabelas criadas com sucesso!');
    connection.release();
  } catch (err) {
    console.error('Erro ao criar as tabelas:', err.message);
  }
};

// const insertData = async () => {
//   const projetos = ['GEM', 'SPIN', 'VS30', 'BMW - SEAT', 'BMW - WIRE', 'RENAULT'];
//   const linhas = {
//     GEM: ['IP1', 'IP2', 'IP3', 'BODY1', 'BODY2', 'BODY3', 'BODY4', 'ENGINE1', 'ENGINE2', 'SMALLS'],
//     SPIN: ['IP', 'BODY', 'ENGINE', 'SMALLS'],
//     VS30: ['VORNE']
//   };
//   const cargos = ['Lider', 'Operador', 'Supervisor', 'Mult 1', 'Mult 2', 'Inspetor de Qualidade'];
//   const funcoes = ['Acabamento', 'Conectagem - GTI', 'Conectagem Rack', 'Conectagem Roteamento', 'MTE', 'MTC', 'MTEst', 'Care', 'Embalagem', 'Enrolado', 'EPC', 'N/A'];
//   const turnos = ['1º Turno', '2º Turno', '3º Turno', 'Comercial'];

//   const connection = await pool.getConnection();
//   try {
//     // Iniciar uma transação
//     await connection.beginTransaction();

//     // Inserir projetos
//     for (const projeto of projetos) {
//       console.log(`Inserindo projeto: ${projeto}`);
//       await connection.query('INSERT INTO projeto (nome) VALUES (?)', [projeto]);
//     }

//     // Inserir linhas
//     for (const [projeto, linhasProjeto] of Object.entries(linhas)) {
//       for (const linha of linhasProjeto) {
//         // Consultar o id do projeto
//         const [projetoIdQuery] = await connection.query('SELECT id FROM projeto WHERE nome = ?', [projeto]);
//         const projetoId = projetoIdQuery[0]?.id;

//         if (projetoId) {
//           console.log(`Inserindo linha: ${linha} com projeto_id: ${projetoId}`);
//           await connection.query('INSERT INTO linha (nome, projeto_id) VALUES (?, ?)', [linha, projetoId]);
//         } else {
//           console.error(`Erro: Projeto ${projeto} não encontrado ao tentar inserir a linha ${linha}`);
//         }
//       }
//     }

//     // Inserir cargos
//     for (const cargo of cargos) {
//       console.log(`Inserindo cargo: ${cargo}`);
//       await connection.query('INSERT INTO cargo (nome) VALUES (?)', [cargo]);
//     }

//     // Inserir funções
//     for (const funcao of funcoes) {
//       console.log(`Inserindo função: ${funcao}`);
//       await connection.query('INSERT INTO funcao (nome) VALUES (?)', [funcao]);
//     }

//     // Inserir turnos
//     for (const turno of turnos) {
//       console.log(`Inserindo turno: ${turno}`);
//       await connection.query('INSERT INTO turno (nome) VALUES (?)', [turno]);
//     }

//     // Commit da transação
//     await connection.commit();

//     console.log('Dados inseridos com sucesso!');
//   } catch (err) {
//     // Em caso de erro, desfaz a transação
//     await connection.rollback();
//     console.error('Erro ao inserir os dados:', err.message);
//   } finally {
//     connection.release();
//   }
// };

const setup = async () => {
  await createDatabase(); // Criar o banco de dados
  await createTables(); // Criar as tabelas
 // await insertData(); // Inserir os dados
};

module.exports = { setup };
