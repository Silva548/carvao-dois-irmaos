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
        alert('Você precisa estar logado para ver seus pedidos!');
        window.location.href = 'index.html';
    }
}

// Atualizar contador do carrinho
function atualizarCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const totalItens = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
    document.getElementById('cartCount').textContent = totalItens;
}

// Carregar pedidos do usuário
async function carregarPedidos() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const pedidosContainer = document.getElementById('pedidosContainer');
    
    try {
        // Tentar buscar da API
        const response = await listarPedidos();
        let pedidos = response.pedidos;
        
        // Filtrar pedidos do usuário atual
        if (currentUser && currentUser.email) {
            pedidos = pedidos.filter(p => p.cliente.email === currentUser.email);
        }
        
        renderizarPedidos(pedidos);
    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        // Fallback para localStorage
        const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
        const pedidosUsuario = currentUser && currentUser.email 
            ? pedidos.filter(p => p.cliente.email === currentUser.email)
            : pedidos;
        renderizarPedidos(pedidosUsuario);
    }
}

function renderizarPedidos(pedidos) {
    const pedidosContainer = document.getElementById('pedidosContainer');
    pedidosContainer.innerHTML = '';
    
    if (pedidos.length === 0) {
        pedidosContainer.innerHTML = `
            <div class="empty-state">
                <h2>📦 Você ainda não tem pedidos</h2>
                <p>Faça seu primeiro pedido e acompanhe aqui!</p>
                <a href="produtos.html">Ver Produtos</a>
            </div>
        `;
        return;
    }
    
    // Ordenar pedidos por data (mais recente primeiro)
    pedidos.sort((a, b) => new Date(b.data) - new Date(a.data));
    
    pedidos.forEach(pedido => {
        const pedidoCard = criarCardPedido(pedido);
        pedidosContainer.appendChild(pedidoCard);
    });
}

function criarCardPedido(pedido) {
    const card = document.createElement('div');
    card.className = 'pedido-card';
    
    const data = new Date(pedido.data).toLocaleString('pt-BR');
    const statusClass = `status-${pedido.status.toLowerCase().replace(/\s/g, '-')}`;
    
    // Verificar se o pedido pode ser cancelado
    const podeCancelar = !['Concluído', 'Cancelado'].includes(pedido.status);
    
    // Criar lista de itens
    let itensHTML = '';
    pedido.itens.forEach(item => {
        const preco = item.tipoCompra === 'entrega' ? item.precoEntrega :  item.tipoCompra === 'carga fechada' ? item.precocargafechada : item.precoRetirada;
        const subtotal = preco * item.quantidade;
        itensHTML += `
            <li>
                <span>${item.quantidade}x ${item.nome} (${item.tipoCompra === 'entrega' ? 'Entrega' : item.tipoCompra === 'carga fechada' ? 'carga fechada' : 'Retirada'})</span>
                <span>R$ ${subtotal.toFixed(2)}</span>
            </li>
        `;
    });
    
    // Motivo de espera (se houver)
    let motivoEsperaHTML = '';
    if (pedido.status === 'Em Espera' && pedido.motivoEspera) {
        motivoEsperaHTML = `
            <div class="motivo-espera">
                <h4>⚠️ Motivo da Espera:</h4>
                <p>${pedido.motivoEspera}</p>
            </div>
        `;
    }
    
    // Agendamento (se houver)
    let agendamentoHTML = '';
    if (pedido.agendamento && pedido.agendamento.data) {
        agendamentoHTML = `
            <div class="info-item">
                <span class="info-label">Agendamento:</span>
                <span class="info-value">${pedido.agendamento.data} às ${pedido.agendamento.hora}</span>
            </div>
        `;
    }
    
    card.innerHTML = `
        <div class="pedido-header">
            <div class="pedido-id">Pedido #${pedido.id}</div>
            <div class="pedido-status ${statusClass}">${pedido.status}</div>
        </div>
        
        ${motivoEsperaHTML}
        
        <div class="pedido-info">
            <div class="info-item">
                <span class="info-label">Data do Pedido:</span>
                <span class="info-value">${data}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Forma de Pagamento:</span>
                <span class="info-value">${getPaymentMethodName(pedido.formaPagamento)}</span>
            </div>
            ${agendamentoHTML}
        </div>
        
        <div class="pedido-itens">
            <h4>Itens do Pedido:</h4>
            <ul class="item-lista">
                ${itensHTML}
            </ul>
        </div>
        
        <div class="pedido-total">
            <span class="total-label">Total:</span>
            <span class="total-value">R$ ${pedido.total.toFixed(2)}</span>
        </div>
        
        <div class="pedido-actions">
            <button class="btn btn-danger" onclick="cancelarPedidoConfirm(${pedido.id})" ${!podeCancelar ? 'disabled' : ''}>
                ${podeCancelar ? ' Cancelar Pedido' : ' Não é possível cancelar'}
            </button>
        </div>
    `;
    
    return card;
}

// Cancelar pedido
async function cancelarPedidoConfirm(id) {
    if (!confirm('Tem certeza que deseja cancelar este pedido?')) {
        return;
    }
    
    try {
        await cancelarPedido(id);
        alert('Pedido cancelado com sucesso!');
        carregarPedidos();
    } catch (error) {
        console.error('Erro ao cancelar pedido:', error);
        alert('Erro ao cancelar pedido. Tente novamente.');
    }
}

// Função auxiliar para obter nome da forma de pagamento
function getPaymentMethodName(method) {
    const names = {
        'pix': 'PIX',
        'cartao': 'Cartão de Crédito',
        'boleto': 'Boleto Bancário',
        'dinheiro': 'Dinheiro'
    };
    return names[method] || method;
}

// Inicializar página
window.addEventListener('load', () => {
    verificarUsuario();
    atualizarCarrinho();
    carregarPedidos();
});

