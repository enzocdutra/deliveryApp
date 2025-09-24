import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // ⚡ carrega .env antes de usar pool

// Configuração da pool com SSL obrigatório para Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Função para criar tabelas
export async function setupDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS produtos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        descricao TEXT NOT NULL,
        preco DECIMAL(10,2) NOT NULL,
        categoria VARCHAR(100) NOT NULL,
        imagem TEXT
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      )
    `);

    console.log('✅ Tabelas criadas/verificadas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error);
  }
}

// Teste de conexão
pool.connect()
  .then(() => console.log('✅ Conectado ao PostgreSQL Neon com sucesso!'))
  .catch(err => console.error('❌ Erro ao conectar no PostgreSQL:', err));

export default pool;
