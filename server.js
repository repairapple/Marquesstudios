const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve arquivos estáticos da raiz do projeto
app.use(express.static(path.join(__dirname)));

// Rota raiz — serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Arquivo de dados
const DATA_FILE = path.join(__dirname, 'data', 'agendamentos.json');

// Garante que a pasta data e o arquivo existam
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

// ==================== API ====================

// GET - Listar agendamentos (protegido por senha via query)
app.get('/api/agendamentos', (req, res) => {
  const { senha } = req.query;
  if (senha !== 'essence2026') {
    return res.status(401).json({ erro: 'Senha inválida' });
  }
  try {
    const dados = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    // Ordena por data (mais recentes primeiro)
    dados.sort((a, b) => new Date(b.data_criacao) - new Date(a.data_criacao));
    res.json(dados);
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao ler agendamentos' });
  }
});

// POST - Criar agendamento
app.post('/api/agendamentos', (req, res) => {
  try {
    const { nome, whatsapp, procedimento, data, horario, observacoes } = req.body;

    if (!nome || !whatsapp || !procedimento || !data || !horario) {
      return res.status(400).json({ erro: 'Campos obrigatórios: nome, whatsapp, procedimento, data, horario' });
    }

    const dados = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

    const novoAgendamento = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      nome,
      whatsapp,
      procedimento,
      data,
      horario,
      observacoes: observacoes || '',
      status: 'pendente', // pendente, confirmado, cancelado, concluido
      data_criacao: new Date().toISOString()
    };

    dados.push(novoAgendamento);
    fs.writeFileSync(DATA_FILE, JSON.stringify(dados, null, 2));

    res.status(201).json({ sucesso: true, agendamento: novoAgendamento });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao salvar agendamento' });
  }
});

// PUT - Atualizar status do agendamento
app.put('/api/agendamentos/:id', (req, res) => {
  const { senha } = req.query;
  if (senha !== 'essence2026') {
    return res.status(401).json({ erro: 'Senha inválida' });
  }
  try {
    const { status } = req.body;
    const dados = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    const index = dados.findIndex(a => a.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ erro: 'Agendamento não encontrado' });
    }

    dados[index].status = status;
    fs.writeFileSync(DATA_FILE, JSON.stringify(dados, null, 2));
    res.json({ sucesso: true, agendamento: dados[index] });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao atualizar' });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`\n✨ Servidor Essence Studio rodando em: http://localhost:${PORT}`);
  console.log(`🔗 Painel Admin: http://localhost:${PORT}/admin.html`);
  console.log(`📋 API Agendamentos: http://localhost:${PORT}/api/agendamentos?senha=essence2026\n`);
});