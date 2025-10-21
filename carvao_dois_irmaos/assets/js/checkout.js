// Variáveis globais
let subtotal = 0;
let custocargafechada = 0;
let custoEntrega = 0;
let desconto = 0;
let total = 0;
let temEntrega = false;
let temcargafechada = false;
let temRetirada = false;

// Verificar usuário logado
function verificarUsuario() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userName = document.getElementById('userName');
    
    if (currentUser) {
        if (currentUser.type === 'guest') {
            userName.textContent = 'Olá, Visitante';
        } else {
            userName.textContent = `Olá, ${currentUser.name}`;
            // Preencher formulário com dados do usuário
            document.getElementById('customerName').value = currentUser.name || '';
            document.getElementById('customerEmail').value = currentUser.email || '';
            document.getElementById('customerPhone').value = currentUser.phone || '';
            document.getElementById('address').value = currentUser.address || '';
            document.getElementById('cep').value = currentUser.cep || '';
        }
    } else {
        window.location.href = 'index.html';
    }
}

// Carregar resumo do pedido
function carregarResumo() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        window.location.href = 'produtos.html';
        return;
    }
    
    const summaryItems = document.getElementById('summaryItems');
    summaryItems.innerHTML = '';
    
    subtotal = 0;
    custoEntrega = 0;
    temEntrega = false;
    temRetirada = false;
    
    carrinho.forEach(item => {
        const preco = item.tipoCompra === 'entrega' ? item.precoEntrega : item.tipoCompra === 'carga fechada' ? item.precocargafechada : item.precoRetirada;
        const subtotalItem = preco * item.quantidade;
        subtotal += subtotalItem;
        
        if (item.tipoCompra === 'entrega') {
            temEntrega = true;
            custoEntrega += (item.precoEntrega -item,precocargafechada - item.precoRetirada) * item.quantidade;
        } else {
            temRetirada = true;
        }
        
        const summaryItem = document.createElement('div');
        summaryItem.className = 'summary-item';
        summaryItem.innerHTML = `
            <div class="item-info">
                <div class="item-name">${item.nome}</div>
                <div class="item-details">${item.tipoCompra === 'entrega' ? 'Entrega' : item.tipoCompra === 'carga fechada' ? 'carga fechada' : 'Retirada'} - ${item.quantidade}x</div>
            </div>
            <div class="item-price">R$ ${subtotalItem.toFixed(2)}</div>
        `;
        summaryItems.appendChild(summaryItem);
    });
    
    // Mostrar/ocultar seções de agendamento e entrega
    if (temRetirada && !temEntrega) {
        document.getElementById('agendamentoSection').classList.remove('hidden');
         document.getElementById('cargafechadaSection').classList.add('hidden');
        document.getElementById('entregaSection').classList.add('hidden');
        // Tornar campos de agendamento obrigatórios
        document.getElementById('dataRetirada').required = true;
        document.getElementById('horaRetirada').required = true;
    } else if (temEntrega && !temRetirada) {
        document.getElementById('agendamentoSection').classList.add('hidden');
         document.getElementById('cargafechadaSection').classList.remove('hidden');
        document.getElementById('entregaSection').classList.remove('hidden');
        document.getElementById('dataRetirada').required = false;
        document.getElementById('horaRetirada').required = false;
    } else {
        // Ambos os tipos
        document.getElementById('agendamentoSection').classList.remove('hidden');
        document.getElementById('cargafechadaSection').classList.remove('hidden');
        document.getElementById('entregaSection').classList.remove('hidden');
        document.getElementById('dataRetirada').required = true;
        document.getElementById('horaRetirada').required = true;
    }
    
    atualizarTotais();
}

// Atualizar totais
function atualizarTotais() {
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    // Desconto removido
    desconto = 0;
    document.getElementById('discountRow').style.display = 'none';
    
    total = subtotal - desconto;
    
    document.getElementById('summarySubtotal').textContent = `R$ ${subtotal.toFixed(2)}`;
    document.getElementById('summaryCustocargafechada').textContent = custocargafechada > 0 ? `R$ ${custocargafechada.toFixed(2)}` : 'Grátis';
    document.getElementById('summaryCustoEntrega').textContent = custoEntrega > 0 ? `R$ ${custoEntrega.toFixed(2)}` : 'Grátis';
    document.getElementById('summaryDiscount').textContent = `-R$ ${desconto.toFixed(2)}`;
    document.getElementById('summaryTotal').textContent = `R$ ${total.toFixed(2)}`;
}

// Event listener para mudança de forma de pagamento
document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener('change', atualizarTotais);
});

// Voltar ao carrinho
function voltarCarrinho() {
    window.location.href = 'carrinho.html';
}

// Processar checkout
document.getElementById('checkoutForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const customerName = document.getElementById('customerName').value;
    const customerEmail = document.getElementById('customerEmail').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const address = document.getElementById('address').value;
    const cep = document.getElementById('cep').value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    let dataRetirada = '';
    let horaRetirada = '';
    
    if (temRetirada) {
        dataRetirada = document.getElementById('dataRetirada').value;
        horaRetirada = document.getElementById('horaRetirada').value;
        
        if (!dataRetirada || !horaRetirada) {
            alert('Por favor, informe a data e hora para retirada!');
            return;
        }
    }
    
    // Criar objeto do pedido
    const pedido = {
        id: Date.now(),
        data: new Date().toISOString(),
        cliente: {
            nome: customerName,
            email: customerEmail,
            telefone: customerPhone,
            endereco: address,
            cep: cep
        },
        itens: JSON.parse(localStorage.getItem('carrinho')),
        subtotal: subtotal,
        custocargafechada: custocargafechada,
        custoEntrega: custoEntrega,
        desconto: desconto,
        total: total,
        formaPagamento: paymentMethod,
        agendamento: {
            data: dataRetirada,
            hora: horaRetirada
        },
        status: 'Pendente'
    };
    
    // Salvar pedido no localStorage
    let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    pedidos.push(pedido);
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    
    // Limpar carrinho
    localStorage.removeItem('carrinho');
    
    // Exibir mensagem de sucesso
    alert(`Pedido confirmado com sucesso!\n\nNúmero do pedido: #${pedido.id}\nTotal: R$ ${total.toFixed(2)}\nForma de pagamento: ${getPaymentMethodName(paymentMethod)}\n\nVocê receberá um e-mail de confirmação em breve.`);
    
    // Redirecionar para a página de produtos
    window.location.href = 'produtos.html';
});

// Obter nome da forma de pagamento
function getPaymentMethodName(method) {
    const names = {
        'pix': 'PIX',
        'cartao': 'Cartão de Crédito',
        'boleto': 'Boleto Bancário',
        'dinheiro': 'Dinheiro'
    };
    return names[method] || method;
}

// Definir data mínima para agendamento (amanhã)
function setMinDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    document.getElementById('dataRetirada').min = minDate;
}

// Buscar endereço por CEP
document.getElementById('cep').addEventListener('blur', async function() {
    const cep = this.value;
    
    if (cep.length >= 8) {
        try {
            const endereco = await buscarEnderecoPorCEP(cep);
            
            // Preencher campo de endereço
            const enderecoCompleto = `${endereco.logradouro}, ${endereco.bairro}, ${endereco.cidade} - ${endereco.estado}`;
            document.getElementById('address').value = enderecoCompleto;
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            alert('CEP não encontrado. Por favor, verifique e tente novamente.');
        }
    }
});

// Inicializar página
window.addEventListener('load', () => {
    verificarUsuario();
    carregarResumo();
    setMinDate();
});

