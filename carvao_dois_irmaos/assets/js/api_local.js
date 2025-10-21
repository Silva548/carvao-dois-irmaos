// API Local - Funciona completamente com localStorage, sem backend

// Inicializar dados no localStorage se não existirem
function inicializarDados() {
    // Produtos padrão
    if (!localStorage.getItem('produtos')) {
        const produtosPadrao = [
            {
                id: 1,
                nome: 'Carvão Premium 5kg',
                descricao: 'Carvão vegetal premium de alta qualidade, ideal para churrascos. Produzido com madeira selecionada, garante longa duração e baixa produção de fumaça.',
                categoria: 'premium',
                peso: '5kg',
                precoRetirada: 17.00,
                precocargafechada:18.00,
                precoEntrega: 20.00,
                estoque: 100,
                imagem: '../assets/images/carvao_premium_5kg.jpg'
            },
            {
                id: 2,
                nome: 'Carvão Premium 3kg',
                descricao: 'Carvão vegetal premium de alta qualidade em embalagem menor. Perfeito para churrascos menores ou para quem tem pouco espaço de armazenamento.',
                categoria: 'premium',
                peso: '3kg',
                precoRetirada: 10.00,
                precocargafechada: 10.50,
                precoEntrega: 11.50,
                estoque: 150,
                imagem: '../assets/images/carvao_premium_3kg.jpg'
            },
            {
                id: 3,
                nome: 'Carvão Básico 5kg',
                descricao: 'Carvão vegetal de qualidade básica, excelente custo-benefício. Ideal para uso diário e churrascos casuais.',
                categoria: 'basico',
                peso: '5kg',
                precoRetirada: 15.00,
                precocargafechada: 15.50,
                precoEntrega: 16.00,
                estoque: 200,
                imagem: '../assets/images/carvao_basico_5kg.jpg'
            }
        ];
        localStorage.setItem('produtos', JSON.stringify(produtosPadrao));
    }
    
    // Administradores padrão
    if (!localStorage.getItem('administradores')) {
        const adminsPadrao = [
            {
                id: 1,
                name: 'Admin 1',
                email: 'admin1@carvaodoisirmaos.com',
                password: 'admin123',
                type: 'admin'
            },
            {
                id: 2,
                name: 'Admin 2',
                email: 'admin2@carvaodoisirmaos.com',
                password: 'admin123',
                type: 'admin'
            },
            {
                id: 3,
                name: 'Admin 3',
                email: 'admin3@carvaodoisirmaos.com',
                password: 'admin123',
                type: 'admin'
            }
        ];
        localStorage.setItem('administradores', JSON.stringify(adminsPadrao));
    }
    
    // Usuários
    if (!localStorage.getItem('usuarios')) {
        localStorage.setItem('usuarios', JSON.stringify([]));
    }
    
    // Pedidos
    if (!localStorage.getItem('pedidos')) {
        localStorage.setItem('pedidos', JSON.stringify([]));
    }
}

// Inicializar dados ao carregar o script
inicializarDados();

// ==================== FUNÇÕES DE USUÁRIOS ====================

async function cadastrarUsuario(userData) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    // Verificar se o email já existe
    if (usuarios.find(u => u.email === userData.email)) {
        throw new Error('E-mail já cadastrado!');
    }
    
    const novoUsuario = {
        id: Date.now(),
        ...userData,
        type: 'client'
    };
    
    usuarios.push(novoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    return {
        success: true,
        message: 'Usuário cadastrado com sucesso!',
        usuario: { ...novoUsuario, password: undefined }
    };
}

async function loginUsuario(email, password) {
    // Verificar se é administrador
    const administradores = JSON.parse(localStorage.getItem('administradores')) || [];
    const admin = administradores.find(a => a.email === email && a.password === password);
    
    if (admin) {
        return {
            success: true,
            message: 'Login de administrador realizado com sucesso!',
            usuario: { ...admin, password: undefined }
        };
    }
    
    // Verificar se é usuário comum
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuario = usuarios.find(u => u.email === email && u.password === password);
    
    if (usuario) {
        return {
            success: true,
            message: 'Login realizado com sucesso!',
            usuario: { ...usuario, password: undefined }
        };
    }
    
    throw new Error('E-mail ou senha incorretos!');
}

// ==================== FUNÇÕES DE PRODUTOS ====================

async function listarProdutos() {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    return {
        success: true,
        produtos: produtos
    };
}

async function buscarProduto(id) {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const produto = produtos.find(p => p.id === parseInt(id));
    
    if (produto) {
        return {
            success: true,
            produto: produto
        };
    }
    
    throw new Error('Produto não encontrado!');
}

async function criarProduto(produtoData) {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    
    const novoProduto = {
        id: Date.now(),
        ...produtoData
    };
    
    produtos.push(novoProduto);
    localStorage.setItem('produtos', JSON.stringify(produtos));
    
    return {
        success: true,
        message: 'Produto criado com sucesso!',
        produto: novoProduto
    };
}

async function atualizarProduto(id, produtoData) {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const index = produtos.findIndex(p => p.id === parseInt(id));
    
    if (index !== -1) {
        produtos[index] = { ...produtos[index], ...produtoData };
        localStorage.setItem('produtos', JSON.stringify(produtos));
        
        return {
            success: true,
            message: 'Produto atualizado com sucesso!',
            produto: produtos[index]
        };
    }
    
    throw new Error('Produto não encontrado!');
}

async function deletarProduto(id) {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const index = produtos.findIndex(p => p.id === parseInt(id));
    
    if (index !== -1) {
        produtos.splice(index, 1);
        localStorage.setItem('produtos', JSON.stringify(produtos));
        
        return {
            success: true,
            message: 'Produto deletado com sucesso!'
        };
    }
    
    throw new Error('Produto não encontrado!');
}

// ==================== FUNÇÕES DE PEDIDOS ====================

async function criarPedido(pedidoData) {
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    
    // Atualizar estoque
    for (let item of pedidoData.itens) {
        const produto = produtos.find(p => p.id === item.id);
        if (produto) {
            produto.estoque -= item.quantidade;
        }
    }
    localStorage.setItem('produtos', JSON.stringify(produtos));
    
    const novoPedido = {
        id: Date.now(),
        data: new Date().toISOString(),
        ...pedidoData,
        status: 'Pendente',
        motivoEspera: '',
        observacoes: ''
    };
    
    pedidos.push(novoPedido);
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    
    return {
        success: true,
        message: 'Pedido criado com sucesso!',
        pedido: novoPedido
    };
}

async function listarPedidos() {
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    return {
        success: true,
        pedidos: pedidos
    };
}

async function buscarPedido(id) {
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    const pedido = pedidos.find(p => p.id === parseInt(id));
    
    if (pedido) {
        return {
            success: true,
            pedido: pedido
        };
    }
    
    throw new Error('Pedido não encontrado!');
}

async function atualizarStatusPedido(id, status, motivoEspera = '', observacoes = '') {
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    const index = pedidos.findIndex(p => p.id === parseInt(id));
    
    if (index !== -1) {
        pedidos[index].status = status;
        if (motivoEspera !== undefined) {
            pedidos[index].motivoEspera = motivoEspera;
        }
        if (observacoes !== undefined) {
            pedidos[index].observacoes = observacoes;
        }
        localStorage.setItem('pedidos', JSON.stringify(pedidos));
        
        return {
            success: true,
            message: 'Status do pedido atualizado com sucesso!',
            pedido: pedidos[index]
        };
    }
    
    throw new Error('Pedido não encontrado!');
}

async function cancelarPedido(id) {
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const index = pedidos.findIndex(p => p.id === parseInt(id));
    
    if (index !== -1) {
        if (pedidos[index].status === 'Concluído') {
            throw new Error('Não é possível cancelar um pedido já concluído!');
        }
        
        // Devolver estoque
        for (let item of pedidos[index].itens) {
            const produto = produtos.find(p => p.id === item.id);
            if (produto) {
                produto.estoque += item.quantidade;
            }
        }
        localStorage.setItem('produtos', JSON.stringify(produtos));
        
        pedidos[index].status = 'Cancelado';
        localStorage.setItem('pedidos', JSON.stringify(pedidos));
        
        return {
            success: true,
            message: 'Pedido cancelado com sucesso!',
            pedido: pedidos[index]
        };
    }
    
    throw new Error('Pedido não encontrado!');
}

