import * as SQLite from 'expo-sqlite';

// Abre (ou cria) o banco de dados de forma síncrona/bloqueante (nova API do SDK 54)
const db = SQLite.openDatabaseSync('mycar.db');

export const initDatabase = () => {
    try {
        db.execSync(`
      CREATE TABLE IF NOT EXISTS veiculos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        placa TEXT NOT NULL,
        ano TEXT,
        marca TEXT,
        modelo TEXT
      );
    `);

        db.execSync(`
      CREATE TABLE IF NOT EXISTS manutencoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        data TEXT,
        tipo TEXT,
        oficina TEXT,
        custo REAL,
        materiais TEXT,
        km INTEGER,
        veiculo_id INTEGER,
        avista INTEGER,
        parcelado INTEGER,
        valorParcela REAL,
        qtdParcelas INTEGER,
        FOREIGN KEY (veiculo_id) REFERENCES veiculos (id)
      );
    `);

        console.log('Banco de dados inicializado com sucesso!');
    } catch (error) {
        console.error('Erro ao inicializar banco de dados:', error);
    }
};

export default db;
