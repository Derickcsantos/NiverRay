const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Configuração da conexão com o PostgreSQL
const pool = new Pool({
    connectionString: 'sua_url_do_elephant_sql', // Substitua pela sua URL do ElephantSQL
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Criar tabela para armazenar a cor, se não existir
pool.query(`
    CREATE TABLE IF NOT EXISTS colors (
        id SERIAL PRIMARY KEY,
        color VARCHAR(7) NOT NULL
    );
`).catch(err => console.error('Erro ao criar a tabela:', err));

// Endpoint para salvar a cor
app.post('/api/save-color', async (req, res) => {
    const { color } = req.body;

    try {
        // Verifica se já existe uma cor salva
        const result = await pool.query('SELECT * FROM colors LIMIT 1');
        if (result.rows.length > 0) {
            // Atualiza a cor existente
            await pool.query('UPDATE colors SET color = $1 WHERE id = $2', [color, result.rows[0].id]);
        } else {
            // Insere uma nova cor
            await pool.query('INSERT INTO colors (color) VALUES ($1)', [color]);
        }
        res.json({ success: true, color });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Endpoint para obter a cor
app.get('/api/get-color', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM colors LIMIT 1');
        const colorData = result.rows[0];
        res.json(colorData || { color: '#ff0000' }); // Retorna uma cor padrão se não houver cor salva
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
