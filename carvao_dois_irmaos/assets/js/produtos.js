// Dados dos produtos
const produtos = [
    {
        id: 1,
        nome: 'Carvão Premium 5kg',
        descricao: 'Carvão vegetal premium de alta qualidade, ideal para churrascos especiais.',
        imagem: '../assets/images/carvao_premium_5kg.jpg',
        precoRetirada: 17.00,
        precocargafechada: 18.00,
        precoEntrega: 20.00,
        peso: '5kg',
        categoria: 'premium'
    },
    {
        id: 2,
        nome: 'Carvão Premium 3kg',
        descricao: 'Carvão vegetal premium em embalagem de 3kg, perfeito para churrascos menores.',
        imagem: '../assets/images/carvao_premium_3kg.jpg',
        precoRetirada: 10.00,
        precocargafechada:10.50,
        precoEntrega: 11.50,
        peso: '3kg',
        categoria: 'premium'
    },
    {
        id: 3,
        nome: 'Carvão Básico 5kg',
        descricao: 'Carvão vegetal básico de qualidade, excelente custo-benefício.',
        imagem: '../assets/images/carvao_basico_5kg.jpg',
        precoRetirada: 15.00,
        precocargafechada:15.50,
        precoEntrega: 16.00,
        peso: '5kg',
        categoria: 'basico'
    }
];

// Inicializar localStorage com produtos se não existir
if (!localStorage.getItem('produtos')) {
    localStorage.setItem('produtos', JSON.stringify(produtos));
}

// Verificar usuário logado
function verificarUsuario() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userName = document.getElementById('userName');
    
    if (currentUser) {
        if (currentUser.type === 'guest') {
            userName.textContent = 'Olá, Visitante';
        } else {
            userName.textContent = `Olá, ${currentUser.name}`;
        }
    } else {
        // Se não estiver logado, redirecionar para login
        window.location.href = 'index.html';
    }
}

// Carregar produtos na página
function carregarProdutos() {
    const productsGrid = document.getElementById('productsGrid');
    const produtosStorage = JSON.parse(localStorage.getItem('produtos'));
    
    productsGrid.innerHTML = '';
    
    produtosStorage.forEach(produto => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${produto.nome}</h3>
                <p class="product-description">${produto.descricao}</p>
                <div class="product-prices">
                    <div class="price-option">
                        <span class="price-label">Retirada:</span>
                        <span class="price-value">R$ ${produto.precoRetirada.toFixed(2)}</span>
                    </div>
                    <div class="price-option">
                        <span class="price-label">Entrega:</span>
                        <span class="price-value">R$ ${produto.precoEntrega.toFixed(2)}</span>
                    </div>
                </div>
                <div class="product-actions">
                    <button class="btn btn-secondary" onclick="verDetalhes(${produto.id})">Ver Detalhes</button>
                    <button class="btn btn-primary" onclick="adicionarAoCarrinho(${produto.id}, 'retirada')">Adicionar ao Carrinho</button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Ver detalhes do produto
function verDetalhes(produtoId) {
    window.location.href = `detalhes.html?id=${produtoId}`;
}

// Adicionar produto ao carrinho
function adicionarAoCarrinho(produtoId, tipoCompra = 'retirada') {
    const produtosStorage = JSON.parse(localStorage.getItem('produtos'));
    const produto = produtosStorage.find(p => p.id === produtoId);
    
    if (!produto) {
        alert('Produto não encontrado!');
        return;
    }
    
    // Buscar carrinho do localStorage
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    // Verificar se o produto já está no carrinho
    const itemExistente = carrinho.find(item => item.id === produtoId && item.tipoCompra === tipoCompra);
    
    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({
            id: produto.id,
            nome: produto.nome,
            imagem: produto.imagem,
            precoRetirada: produto.precoRetirada,
            precocargafechada: produto.precocargafechada,
            precoEntrega: produto.precoEntrega,
            tipoCompra: tipoCompra,
            quantidade: 1
        });
    }
    
    // Salvar carrinho no localStorage
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    
    // Atualizar contador do carrinho
    atualizarContadorCarrinho();
    
    alert('Produto adicionado ao carrinho!');
}

// Atualizar contador do carrinho
function atualizarContadorCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const cartCount = document.getElementById('cartCount');
    
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    cartCount.textContent = totalItens;
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
});

// Busca de produtos
document.getElementById('searchBtn').addEventListener('click', () => {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const produtosStorage = JSON.parse(localStorage.getItem('produtos'));
    const productsGrid = document.getElementById('productsGrid');
    
    productsGrid.innerHTML = '';
    
    const produtosFiltrados = produtosStorage.filter(produto => 
        produto.nome.toLowerCase().includes(searchTerm) || 
        produto.descricao.toLowerCase().includes(searchTerm)
    );
    
    if (produtosFiltrados.length === 0) {
        productsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Nenhum produto encontrado.</p>';
        return;
    }
    
    produtosFiltrados.forEach(produto => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${produto.nome}</h3>
                <p class="product-description">${produto.descricao}</p>
                <div class="product-prices">
                    <div class="price-option">
                        <span class="price-label">Retirada:</span>
                        <span class="price-value">R$ ${produto.precoRetirada.toFixed(2)}</span>
                    </div>
                    <div class="price-option">
                        <span class="price-label">Entrega:</span>
                        <span class="price-value">R$ ${produto.precoEntrega.toFixed(2)}</span>
                    </div>
                </div>
                <div class="product-actions">
                    <button class="btn btn-secondary" onclick="verDetalhes(${produto.id})">Ver Detalhes</button>
                    <button class="btn btn-primary" onclick="adicionarAoCarrinho(${produto.id}, 'retirada')">Adicionar ao Carrinho</button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
});

// Enter para buscar
document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('searchBtn').click();
    }
});

// Inicializar página
window.addEventListener('load', () => {
    verificarUsuario();
    carregarProdutos();
    atualizarContadorCarrinho();
});

