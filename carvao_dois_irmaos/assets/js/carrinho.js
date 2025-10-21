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

// Carregar itens do carrinho
function carregarCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const cartItems = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    
    if (carrinho.length === 0) {
        cartItems.innerHTML = '';
        emptyCart.classList.remove('hidden');
        atualizarResumo();
        return;
    }
    
    emptyCart.classList.add('hidden');
    cartItems.innerHTML = '';
    
    carrinho.forEach((item, index) => {
        const preco = item.tipoCompra === 'entrega' ? item.precoEntrega : item.precoRetirada;
        const subtotalItem = preco * item.quantidade;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.imagem}" alt="${item.nome}" class="item-image">
            
            <div class="item-details">
                <h3 class="item-name">${item.nome}</h3>
                <p class="item-type">${item.tipoCompra === 'entrega' ? '🚚 Entrega' : '🏪 Retirada no Local'}</p>
                <p class="item-price">R$ ${preco.toFixed(2)} x ${item.quantidade} = R$ ${subtotalItem.toFixed(2)}</p>
            </div>
            
            <div class="item-actions">
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="alterarQuantidade(${index}, -1)">-</button>
                    <span class="quantity-value">${item.quantidade}</span>
                    <button class="quantity-btn" onclick="alterarQuantidade(${index}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removerItem(${index})">🗑️ Remover</button>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    atualizarResumo();
}

// Alterar quantidade de um item
function alterarQuantidade(index, delta) {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    if (carrinho[index]) {
        carrinho[index].quantidade += delta;
        
        if (carrinho[index].quantidade <= 0) {
            carrinho.splice(index, 1);
        }
        
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        carregarCarrinho();
    }
}

// Remover item do carrinho
function removerItem(index) {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    if (confirm('Deseja realmente remover este item do carrinho?')) {
        carrinho.splice(index, 1);
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        carregarCarrinho();
    }
}

// Atualizar resumo do pedido
function atualizarResumo() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    let subtotal = 0;
    let custoEntrega = 0;
    
    carrinho.forEach(item => {
        const preco = item.tipoCompra === 'entrega' ? item.precoEntrega : item.precoRetirada;
        subtotal += preco * item.quantidade;
        
        // Calcular custo adicional da entrega
        if (item.tipoCompra === 'entrega') {
            custoEntrega += (item.precoEntrega - item.precoRetirada) * item.quantidade;
        }
    });
    
    const total = subtotal;
    
    document.getElementById('subtotal').textContent = `R$ ${subtotal.toFixed(2)}`;
    document.getElementById('custoEntrega').textContent = custoEntrega > 0 ? `R$ ${custoEntrega.toFixed(2)}` : 'Grátis';
    document.getElementById('total').textContent = `R$ ${total.toFixed(2)}`;
}

// Continuar comprando
function continuarComprando() {
    window.location.href = 'produtos.html';
}

// Finalizar pedido
function finalizarPedido() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    window.location.href = 'checkout.html';
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
});

// Inicializar página
window.addEventListener('load', () => {
    verificarUsuario();
    carregarCarrinho();
});

