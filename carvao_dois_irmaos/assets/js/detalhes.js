// Obter ID do produto da URL
const urlParams = new URLSearchParams(window.location.search);
const produtoId = parseInt(urlParams.get('id'));

let quantidade = 1;
let tipoCompra = 'retirada';

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
        window.location.href = 'index.html';
    }
}

// Carregar detalhes do produto
function carregarDetalhes() {
    const produtos = JSON.parse(localStorage.getItem('produtos'));
    const produto = produtos.find(p => p.id === produtoId);
    
    if (!produto) {
        alert('Produto não encontrado!');
        window.location.href = 'produtos.html';
        return;
    }
    
    // Atualizar breadcrumb
    document.getElementById('breadcrumbProduct').textContent = produto.nome;
    
    // Renderizar detalhes do produto
    const productDetails = document.getElementById('productDetails');
    productDetails.innerHTML = `
        <div class="product-content">
            <div class="product-gallery">
                <img src="${produto.imagem}" alt="${produto.nome}" class="main-image">
            </div>
            
            <div class="product-info-section">
                <h1 class="product-name">${produto.nome}</h1>
                <p class="product-description">${produto.descricao}</p>
                
                <div class="product-features">
                    <h3>Características</h3>
                    <ul>
                        <li><strong>Peso:</strong> ${produto.peso}</li>
                        <li><strong>Categoria:</strong> ${produto.categoria === 'premium' ? 'Premium' : 'Básico'}</li>
                        <li><strong>Tipo:</strong> Carvão Vegetal</li>
                        <li><strong>Uso recomendado:</strong> Churrascos e grelhados</li>
                        <li><strong>Disponibilidade:</strong> Em estoque</li>
                    </ul>
                </div>
                
                <div class="product-prices">
                    <h3>Preços</h3>
                    <div class="price-option">
                        <span class="price-label">Retirada no Local:</span>
                        <span class="price-value">R$ ${produto.precoRetirada.toFixed(2)}</span>
                    </div>
                    <div class="price-option">
                        <span class="price-label">Entrega em Casa:</span>
                        <span class="price-value">R$ ${produto.precoEntrega.toFixed(2)}</span>
                    </div>
                </div>
                
                <div class="purchase-options">
                    <h3>Opções de Compra</h3>
                    
                    <div class="option-group">
                        <label>Tipo de Compra:</label>
                        <div class="radio-group">
                            <div class="radio-option">
                                <input type="radio" id="retirada" name="tipoCompra" value="retirada" checked>
                                <label for="retirada">Retirada no Local</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" id="entrega" name="tipoCompra" value="entrega">
                                <label for="entrega">Entrega em Casa</label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="option-group">
                        <label>Quantidade:</label>
                        <div class="quantity-selector">
                            <button class="quantity-btn" id="decreaseBtn">-</button>
                            <input type="number" class="quantity-input" id="quantityInput" value="1" min="1" max="999">
                            <button class="quantity-btn" id="increaseBtn">+</button>
                        </div>
                    </div>
                </div>
                
                <div class="action-buttons">
                    <button class="btn btn-secondary" onclick="voltarProdutos()">Voltar</button>
                    <button class="btn btn-primary" onclick="adicionarAoCarrinho()">Adicionar ao Carrinho</button>
                </div>
            </div>
        </div>
    `;
    
    // Adicionar event listeners
    document.querySelectorAll('input[name="tipoCompra"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            tipoCompra = e.target.value;
        });
    });
    
    const quantityInput = document.getElementById('quantityInput');
    const decreaseBtn = document.getElementById('decreaseBtn');
    const increaseBtn = document.getElementById('increaseBtn');
    
    // Atualizar quantidade quando o usuário digitar
    quantityInput.addEventListener('input', () => {
        let value = parseInt(quantityInput.value);
        if (isNaN(value) || value < 1) {
            value = 1;
        } else if (value > 999) {
            value = 999;
        }
        quantidade = value;
        quantityInput.value = value;
    });
    
    // Função para diminuir quantidade
    function decreaseQuantity() {
        if (quantidade > 1) {
            quantidade--;
            quantityInput.value = quantidade;
        }
    }
    
    // Função para aumentar quantidade
    function increaseQuantity() {
        if (quantidade < 999) {
            quantidade++;
            quantityInput.value = quantidade;
        }
    }
    
    // Click simples
    decreaseBtn.addEventListener('click', decreaseQuantity);
    increaseBtn.addEventListener('click', increaseQuantity);
    
    // Clique contínuo (mousedown)
    let intervalId = null;
    
    decreaseBtn.addEventListener('mousedown', () => {
        intervalId = setInterval(decreaseQuantity, 150);
    });
    
    increaseBtn.addEventListener('mousedown', () => {
        intervalId = setInterval(increaseQuantity, 150);
    });
    
    // Parar clique contínuo
    ['mouseup', 'mouseleave'].forEach(event => {
        decreaseBtn.addEventListener(event, () => {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        });
        
        increaseBtn.addEventListener(event, () => {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        });
    });
}

// Carregar produtos relacionados
function carregarProdutosRelacionados() {
    const produtos = JSON.parse(localStorage.getItem('produtos'));
    const produtosRelacionados = produtos.filter(p => p.id !== produtoId);
    
    const relatedProducts = document.getElementById('relatedProducts');
    relatedProducts.innerHTML = '';
    
    produtosRelacionados.forEach(produto => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}" class="product-image">
            <div class="product-card-info">
                <h3 class="product-card-name">${produto.nome}</h3>
                <p class="product-card-price">A partir de R$ ${produto.precoRetirada.toFixed(2)}</p>
                <button class="btn btn-primary" onclick="verDetalhes(${produto.id})">Ver Detalhes</button>
            </div>
        `;
        relatedProducts.appendChild(productCard);
    });
}

// Ver detalhes de outro produto
function verDetalhes(id) {
    window.location.href = `detalhes.html?id=${id}`;
}

// Voltar para produtos
function voltarProdutos() {
    window.location.href = 'produtos.html';
}

// Adicionar ao carrinho
function adicionarAoCarrinho() {
    const produtos = JSON.parse(localStorage.getItem('produtos'));
    const produto = produtos.find(p => p.id === produtoId);
    
    if (!produto) {
        alert('Produto não encontrado!');
        return;
    }
    
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    const itemExistente = carrinho.find(item => item.id === produtoId && item.tipoCompra === tipoCompra);
    
    if (itemExistente) {
        itemExistente.quantidade += quantidade;
    } else {
        carrinho.push({
            id: produto.id,
            nome: produto.nome,
            imagem: produto.imagem,
            precoRetirada: produto.precoRetirada,
            precoEntrega: produto.precoEntrega,
            tipoCompra: tipoCompra,
            quantidade: quantidade
        });
    }
    
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarContadorCarrinho();
    
    alert(`${quantidade} unidade(s) de ${produto.nome} adicionada(s) ao carrinho!`);
    
    // Resetar quantidade
    quantidade = 1;
    document.getElementById('quantityDisplay').textContent = quantidade;
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

// Inicializar página
window.addEventListener('load', () => {
    verificarUsuario();
    carregarDetalhes();
    carregarProdutosRelacionados();
    atualizarContadorCarrinho();
});

