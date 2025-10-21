const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../')));
app.use('/admin', express.static(path.join(__dirname, '../admin')));

// Banco de dados em memória (simulação)
let usuarios = [];

// Administradores fixos
let administradores = [
    {
        id: 548,
        name: 'Admin548',
        email: 'admin548@gmail.com',
        password: 'admin548',
        type: 'admin'
    }
];

let produtos = [
    {
        id: 1,
        nome: 'Carvão Premium 5kg',
        descricao: 'Carvão vegetal premium de alta qualidade, ideal para churrascos especiais.',
        imagem: '/assets/images/carvao_premium_5kg.jpg',
        precoRetirada: 17.00,
        precocargafechada: 18.00,
        precoEntrega: 20.00,
        peso: '5kg',
        categoria: 'premium',
        estoque: 100
    },
    {
        id: 2,
        nome: 'Carvão Premium 3kg',
        descricao: 'Carvão vegetal premium em embalagem de 3kg, perfeito para churrascos menores.',
        imagem: '/assets/images/carvao_premium_3kg.jpg',
        precoRetirada: 10.00,
        precocargafechada: 10.50,
        precoEntrega: 11.50,
        peso: '3kg',
        categoria: 'premium',
        estoque: 150
    },
    {
        id: 3,
        nome: 'Carvão Básico 5kg',
        descricao: 'Carvão vegetal básico de qualidade, excelente custo-benefício.',
        imagem: '/assets/images/carvao_basico_5kg.jpg',
        precoRetirada: 15.00,
        precocargafechada: 15.50,
        precoEntrega: 16.00,
        peso: '5kg',
        categoria: 'basico',
        estoque: 200
    }
];
let pedidos = [];

// ==================== ROTAS DE USUÁRIOS ====================

// Registrar usuário
app.post('/api/usuarios/registrar', (req, res) => {
    const { name, email, password, phone, address, cep } = req.body;
    
    // Verificar se o e-mail já existe
    if (usuarios.find(u => u.email === email)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Este e-mail já está cadastrado!' 
        });
    }
    
    const novoUsuario = {
        id: Date.now(),
        name,
        email,
        password,
        phone,
        address,
        cep,
        type: 'cliente',
        dataCadastro: new Date().toISOString()
    };
    
    usuarios.push(novoUsuario);
    
    res.json({ 
        success: true, 
        message: 'Cadastro realizado com sucesso!',
        usuario: { ...novoUsuario, password: undefined }
    });
});

// Login de usuário
app.post('/api/usuarios/login', (req, res) => {
    const { email, password } = req.body;
    
    // Verificar se é administrador
    const admin = administradores.find(u => a.email === email && a.password === password );
    if (admin) {
        return res.json({ 
            success: true, 
            message: 'Login de administrador realizado com sucesso!',
           
        });
    }
    
    // Verificar se é usuário comum
    const usuario = usuarios.find(u => u.email === email && u.password === password);
    
    if (usuario) {
        res.json({ 
            success: true, 
            message: 'Login realizado com sucesso!',
            usuario: { ...usuario, password: undefined }
        });
    } else {
        res.status(401).json({ 
            success: false, 
            message: 'E-mail ou senha incorretos!' 
        });
    }
});

// ==================== ROTAS DE PRODUTOS ====================

// Listar todos os produtos
app.get('/api/produtos', (req, res) => {
    res.json({ 
        success: true, 
        produtos 
    });
});

// Buscar produto por ID
app.get('/api/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const produto = produtos.find(p => p.id === id);
    
    if (produto) {
        res.json({ 
            success: true, 
            produto 
        });
    } else {
        res.status(404).json({ 
            success: false, 
            message: 'Produto não encontrado!' 
        });
    }
});

// Criar produto (Admin)
app.post('/api/produtos', (req, res) => {
    const { nome, descricao, imagem, precoRetirada, precocargafechada, precoEntrega, peso, categoria, estoque } = req.body;
    
    const novoProduto = {
        id: Date.now(),
        nome,
        descricao,
        imagem,
        precoRetirada: parseFloat(precoRetirada),
        precocargafechada: parseFloat(precocargafechada),
        precoEntrega: parseFloat(precoEntrega),
        peso,
        categoria,
        estoque: parseInt(estoque)
    };
    
    produtos.push(novoProduto);
    
    res.json({ 
        success: true, 
        message: 'Produto criado com sucesso!',
        produto: novoProduto 
    });
});

// Atualizar produto (Admin)
app.put('/api/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = produtos.findIndex(p => p.id === id);
    
    if (index !== -1) {
        const { nome, descricao, imagem, precoRetirada, precocargafechada,precoEntrega, peso, categoria, estoque } = req.body;
        
        produtos[index] = {
            ...produtos[index],
            nome: nome || produtos[index].nome,
            descricao: descricao || produtos[index].descricao,
            imagem: imagem || produtos[index].imagem,
            precoRetirada: precoRetirada !== undefined ? parseFloat(precoRetirada) : produtos[index].precoRetirada,
             precocargafechada: precocargafechada !== undefined ? parseFloat(precocargafechada) : produtos[index].precocargafechada,
            precoEntrega: precoEntrega !== undefined ? parseFloat(precoEntrega) : produtos[index].precoEntrega,
            peso: peso || produtos[index].peso,
            categoria: categoria || produtos[index].categoria,
            estoque: estoque !== undefined ? parseInt(estoque) : produtos[index].estoque
        };
        
        res.json({ 
            success: true, 
            message: 'Produto atualizado com sucesso!',
            produto: produtos[index] 
        });
    } else {
        res.status(404).json({ 
            success: false, 
            message: 'Produto não encontrado!' 
        });
    }
});

// Deletar produto (Admin)
app.delete('/api/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = produtos.findIndex(p => p.id === id);
    
    if (index !== -1) {
        produtos.splice(index, 1);
        res.json({ 
            success: true, 
            message: 'Produto deletado com sucesso!' 
        });
    } else {
        res.status(404).json({ 
            success: false, 
            message: 'Produto não encontrado!' 
        });
    }
});

// ==================== ROTAS DE PEDIDOS ====================

// Criar pedido
app.post('/api/pedidos', (req, res) => {
    const { cliente, itens, subtotal, custocargafechada, custoEntrega, desconto, total, formaPagamento, agendamento } = req.body;
    
    // Verificar estoque
    for (let item of itens) {
        const produto = produtos.find(p => p.id === item.id);
        if (!produto) {
            return res.status(404).json({ 
                success: false, 
                message: `Produto ${item.nome} não encontrado!` 
            });
        }
        if (produto.estoque < item.quantidade) {
            return res.status(400).json({ 
                success: false, 
                message: `Estoque insuficiente para ${produto.nome}!` 
            });
        }
    }
    
    // Atualizar estoque
    for (let item of itens) {
        const produto = produtos.find(p => p.id === item.id);
        produto.estoque -= item.quantidade;
    }
    
    const novoPedido = {
        id: Date.now(),
        data: new Date().toISOString(),
        cliente,
        itens,
        subtotal: parseFloat(subtotal),
        custoEntrega: parseFloat(custoEntrega),
        desconto: parseFloat(desconto),
        total: parseFloat(total),
        formaPagamento,
        agendamento,
        status: 'Pendente',
        motivoEspera: '',
        observacoes: ''
    };
    
    pedidos.push(novoPedido);
    
    res.json({ 
        success: true, 
        message: 'Pedido criado com sucesso!',
        pedido: novoPedido 
    });
});

// Listar todos os pedidos (Admin)
app.get('/api/pedidos', (req, res) => {
    res.json({ 
        success: true, 
        pedidos 
    });
});

// Buscar pedido por ID
app.get('/api/pedidos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pedido = pedidos.find(p => p.id === id);
    
    if (pedido) {
        res.json({ 
            success: true, 
            pedido 
        });
    } else {
        res.status(404).json({ 
            success: false, 
            message: 'Pedido não encontrado!' 
        });
    }
});

// Atualizar status do pedido (Admin)
app.put('/api/pedidos/:id/status', (req, res) => {
    const id = parseInt(req.params.id);
    const { status, motivoEspera, observacoes } = req.body;
    const index = pedidos.findIndex(p => p.id === id);
    
    if (index !== -1) {
        pedidos[index].status = status;
        if (motivoEspera !== undefined) {
            pedidos[index].motivoEspera = motivoEspera;
        }
        if (observacoes !== undefined) {
            pedidos[index].observacoes = observacoes;
        }
        res.json({ 
            success: true, 
            message: 'Status do pedido atualizado com sucesso!',
            pedido: pedidos[index] 
        });
    } else {
        res.status(404).json({ 
            success: false, 
            message: 'Pedido não encontrado!' 
        });
    }
});

// Cancelar pedido (Cliente)
app.put('/api/pedidos/:id/cancelar', (req, res) => {
    const id = parseInt(req.params.id);
    const index = pedidos.findIndex(p => p.id === id);
    
    if (index !== -1) {
        if (pedidos[index].status === 'Concluído') {
            return res.status(400).json({ 
                success: false, 
                message: 'Não é possível cancelar um pedido já concluído!' 
            });
        }
        
        // Devolver estoque
        for (let item of pedidos[index].itens) {
            const produto = produtos.find(p => p.id === item.id);
            if (produto) {
                produto.estoque += item.quantidade;
            }
        }
        
        pedidos[index].status = 'Cancelado';
        res.json({ 
            success: true, 
            message: 'Pedido cancelado com sucesso!',
            pedido: pedidos[index] 
        });
    } else {
        res.status(404).json({ 
            success: false, 
            message: 'Pedido não encontrado!' 
        });
    }
});

// ==================== ROTA RAIZ ====================

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../cliente/index.html'));
});

// ==================== INICIAR SERVIDOR ====================

app.listen(PORT, () => {
    console.log(`🔥 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📦 Backend da Carvão Especial Dois Irmãos`);
});

