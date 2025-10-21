// Elementos do DOM
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.content-section');
const sectionTitle = document.getElementById('sectionTitle');
const productModal = document.getElementById('productModal');
const productForm = document.getElementById('productForm');
const addProductBtn = document.getElementById('addProductBtn');
const closeModal = document.querySelector('.close');
const cancelBtn = document.getElementById('cancelBtn');

// Navegação entre seções
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const sectionName = link.getAttribute('data-section');
        
        if (!sectionName) return;
        
        e.preventDefault();
        
        // Atualizar links ativos
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Mostrar seção correspondente
        sections.forEach(section => section.classList.remove('active'));
        document.getElementById(`${sectionName}-section`).classList.add('active');
        
        // Atualizar título
        const titles = {
            'produtos': 'Gerenciar Produtos',
            'pedidos': 'Gerenciar Pedidos',
            'estatisticas': 'Estatísticas'
        };
        sectionTitle.textContent = titles[sectionName];
        
        // Carregar dados da seção
        if (sectionName === 'produtos') {
            carregarProdutos();
        } else if (sectionName === 'pedidos') {
            carregarPedidos();
        } else if (sectionName === 'estatisticas') {
            carregarEstatisticas();
        }
    });
});

// ==================== PRODUTOS ====================

// Carregar produtos
async function carregarProdutos() {
    try {
        // Tentar buscar da API
        const response = await listarProdutos();
        const produtos = response.produtos;
        
        const tbody = document.getElementById('productsTableBody');
        tbody.innerHTML = '';
        
        produtos.forEach(produto => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${produto.id}</td>
                <td><img src="${produto.imagem}" alt="${produto.nome}" class="product-img"></td>
                <td>${produto.nome}</td>
                <td>${produto.categoria === 'premium' ? 'Premium' : 'Básico'}</td>
                <td>R$ ${produto.precoRetirada.toFixed(2)}</td>
                <td>R$ ${produto.precocargafechada.toFixed(2)}</td>
                <td>R$ ${produto.precoEntrega.toFixed(2)}</td>
                <td>${produto.estoque}</td>
                <td>
                    <button class="btn btn-secondary btn-small" onclick="editarProduto(${produto.id})"> Editar</button>
                    <button class="btn btn-danger btn-small" onclick="deletarProdutoConfirm(${produto.id})"> Deletar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        // Fallback para localStorage
        const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
        const tbody = document.getElementById('productsTableBody');
        tbody.innerHTML = '';
        
        produtos.forEach(produto => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${produto.id}</td>
                <td><img src="${produto.imagem}" alt="${produto.nome}" class="product-img"></td>
                <td>${produto.nome}</td>
                <td>${produto.categoria === 'premium' ? 'Premium' : 'Básico'}</td>
                <td>R$ ${produto.precoRetirada.toFixed(2)}</td>
                <td>R$ ${produto.precocargafechada.toFixed(2)}</td>
                <td>R$ ${produto.precoEntrega.toFixed(2)}</td>
                <td>${produto.estoque || 0}</td>
                <td>
                    <button class="btn btn-secondary btn-small" onclick="editarProduto(${produto.id})"> Editar</button>
                    <button class="btn btn-danger btn-small" onclick="deletarProdutoConfirm(${produto.id})"> Deletar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

// Abrir modal para adicionar produto
addProductBtn.addEventListener('click', () => {
    document.getElementById('modalTitle').textContent = 'Adicionar Produto';
    productForm.reset();
    document.getElementById('productId').value = '';
    productModal.classList.add('active');
});

// Fechar modal
closeModal.addEventListener('click', () => {
    productModal.classList.remove('active');
});

cancelBtn.addEventListener('click', () => {
    productModal.classList.remove('active');
});

// Salvar produto
productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const produtoData = {
        nome: document.getElementById('productName').value,
        descricao: document.getElementById('productDescription').value,
        imagem: document.getElementById('productImage').value,
        precoRetirada: parseFloat(document.getElementById('productPriceRetirada').value),
        precoEntrega: parseFloat(document.getElementById('productPriceEntrega').value),
        peso: document.getElementById('productWeight').value,
        categoria: document.getElementById('productCategory').value,
        estoque: parseInt(document.getElementById('productStock').value)
    };
    
    const productId = document.getElementById('productId').value;
    
    try {
        if (productId) {
            // Atualizar produto existente
            await atualizarProduto(productId, produtoData);
            alert('Produto atualizado com sucesso!');
        } else {
            // Criar novo produto
            await criarProduto(produtoData);
            alert('Produto criado com sucesso!');
        }
        
        productModal.classList.remove('active');
        carregarProdutos();
    } catch (error) {
        console.error('Erro ao salvar produto:', error);
        alert('Erro ao salvar produto. Tente novamente.');
    }
});

// Editar produto
async function editarProduto(id) {
    try {
        const response = await buscarProduto(id);
        const produto = response.produto;
        
        document.getElementById('modalTitle').textContent = 'Editar Produto';
        document.getElementById('productId').value = produto.id;
        document.getElementById('productName').value = produto.nome;
        document.getElementById('productDescription').value = produto.descricao;
        document.getElementById('productImage').value = produto.imagem;
        document.getElementById('productPriceRetirada').value = produto.precoRetirada;
        document.getElementById('productPricecargafechada').value = produto.precocargafechada;
        document.getElementById('productPriceEntrega').value = produto.precoEntrega;
        document.getElementById('productWeight').value = produto.peso;
        document.getElementById('productCategory').value = produto.categoria;
        document.getElementById('productStock').value = produto.estoque;
        
        productModal.classList.add('active');
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        alert('Erro ao carregar produto. Tente novamente.');
    }
}

// Deletar produto
async function deletarProdutoConfirm(id) {
    if (confirm('Tem certeza que deseja deletar este produto?')) {
        try {
            await deletarProduto(id);
            alert('Produto deletado com sucesso!');
            carregarProdutos();
        } catch (error) {
            console.error('Erro ao deletar produto:', error);
            alert('Erro ao deletar produto. Tente novamente.');
        }
    }
}

// ==================== PEDIDOS ====================

// Carregar pedidos
async function carregarPedidos() {
    try {
        const response = await listarPedidos();
        const pedidos = response.pedidos;
        
        renderizarPedidos(pedidos);
    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        // Fallback para localStorage
        const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
        renderizarPedidos(pedidos);
    }
}

let pedidoAtual = null;

function renderizarPedidos(pedidos) {
    const tbody = document.getElementById('ordersTableBody');
    tbody.innerHTML = '';
    
    if (pedidos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Nenhum pedido encontrado.</td></tr>';
        return;
    }
    
    pedidos.forEach(pedido => {
        const data = new Date(pedido.data).toLocaleDateString('pt-BR');
        const statusClass = `status-${pedido.status.toLowerCase().replace(/\s/g, '-')}`;
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${pedido.id}</td>
            <td>${data}</td>
            <td>${pedido.cliente.nome}</td>
            <td>R$ ${pedido.total.toFixed(2)}</td>
            <td>${getPaymentMethodName(pedido.formaPagamento)}</td>
            <td><span class="status-badge ${statusClass}">${pedido.status}</span></td>
            <td>
                <button class="btn btn-primary btn-small" onclick="abrirModalPedido(${pedido.id})"> Gerenciar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Abrir modal de pedido
async function abrirModalPedido(id) {
    try {
        const response = await buscarPedido(id);
        const pedido = response.pedido;
        pedidoAtual = pedido;
        
        // Preencher informações do cliente
        document.getElementById('orderIdDisplay').textContent = pedido.id;
        document.getElementById('orderClientName').textContent = pedido.cliente.nome;
        document.getElementById('orderClientEmail').textContent = pedido.cliente.email;
        document.getElementById('orderClientPhone').textContent = pedido.cliente.telefone;
        document.getElementById('orderClientPhone').href = `tel:${pedido.cliente.telefone}`;
        document.getElementById('orderClientAddress').textContent = `${pedido.cliente.endereco}, CEP: ${pedido.cliente.cep}`;
        
        // Preencher itens do pedido
        const orderItems = document.getElementById('orderItems');
        orderItems.innerHTML = '';
        pedido.itens.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.style.marginBottom = '10px';
            itemDiv.innerHTML = `<p>${item.quantidade}x ${item.nome} (${item.tipoCompra}) - R$ ${(item.quantidade * (item.tipoCompra === 'entrega' ? item.precoEntrega : item.tipoCompra === 'carga fechada' ? item.precocargafechada : item.precoRetirada)).toFixed(2)}</p>`;
            orderItems.appendChild(itemDiv);
        });
        
        // Preencher informações do pedido
        document.getElementById('orderDate').textContent = new Date(pedido.data).toLocaleString('pt-BR');
        document.getElementById('orderPayment').textContent = getPaymentMethodName(pedido.formaPagamento);
        document.getElementById('orderSubtotal').textContent = pedido.subtotal.toFixed(2);
        document.getElementById('orderDelivery').textContent = pedido.custoEntrega.toFixed(2);
        document.getElementById('orderDiscount').textContent = pedido.desconto.toFixed(2);
        document.getElementById('orderTotal').textContent = pedido.total.toFixed(2);
        
        // Preencher agendamento
        document.getElementById('orderScheduleDate').textContent = pedido.agendamento.data || 'Não informado';
        document.getElementById('orderScheduleTime').textContent = pedido.agendamento.hora || 'Não informado';
        
        // Preencher status e observações
        document.getElementById('orderStatus').value = pedido.status;
        document.getElementById('orderMotivoEspera').value = pedido.motivoEspera || '';
        document.getElementById('orderObservacoes').value = pedido.observacoes || '';
        
        // Mostrar/ocultar campo de motivo de espera
        toggleMotivoEspera();
        
        // Abrir modal
        document.getElementById('orderModal').classList.add('active');
    } catch (error) {
        console.error('Erro ao carregar pedido:', error);
        alert('Erro ao carregar pedido. Tente novamente.');
    }
}

// Fechar modal de pedido
function fecharModalPedido() {
    document.getElementById('orderModal').classList.remove('active');
    pedidoAtual = null;
}

// Salvar alterações do pedido
async function salvarPedido() {
    if (!pedidoAtual) return;
    
    const status = document.getElementById('orderStatus').value;
    const motivoEspera = document.getElementById('orderMotivoEspera').value;
    const observacoes = document.getElementById('orderObservacoes').value;
    
    if (status === 'Em Espera' && !motivoEspera) {
        alert('Por favor, informe o motivo da espera.');
        return;
    }
    
    try {
        await atualizarStatusPedido(pedidoAtual.id, status, motivoEspera, observacoes);
        alert('Pedido atualizado com sucesso!');
        fecharModalPedido();
        carregarPedidos();
    } catch (error) {
        console.error('Erro ao atualizar pedido:', error);
        alert('Erro ao atualizar pedido. Tente novamente.');
    }
}

// Mostrar/ocultar campo de motivo de espera
document.getElementById('orderStatus').addEventListener('change', toggleMotivoEspera);

function toggleMotivoEspera() {
    const status = document.getElementById('orderStatus').value;
    const motivoEsperaGroup = document.getElementById('motivoEsperaGroup');
    
    if (status === 'Em Espera') {
        motivoEsperaGroup.style.display = 'block';
    } else {
        motivoEsperaGroup.style.display = 'none';
    }
}



// Filtrar pedidos por status
document.getElementById('statusFilter').addEventListener('change', async (e) => {
    const statusFiltro = e.target.value;
    
    try {
        const response = await listarPedidos();
        let pedidos = response.pedidos;
        
        if (statusFiltro !== 'todos') {
            pedidos = pedidos.filter(p => p.status === statusFiltro);
        }
        
        renderizarPedidos(pedidos);
    } catch (error) {
        console.error('Erro ao filtrar pedidos:', error);
    }
});

// ==================== ESTATÍSTICAS ====================

async function carregarEstatisticas() {
    try {
        const responsePedidos = await listarPedidos();
        const pedidos = responsePedidos.pedidos;
        
        const responseProdutos = await listarProdutos();
        const produtos = responseProdutos.produtos;
        
        // Total de vendas
        const totalVendas = pedidos.reduce((sum, p) => sum + p.total, 0);
        document.getElementById('totalVendas').textContent = `R$ ${totalVendas.toFixed(2)}`;
        
        // Pedidos hoje
        const hoje = new Date().toDateString();
        const pedidosHoje = pedidos.filter(p => new Date(p.data).toDateString() === hoje).length;
        document.getElementById('pedidosHoje').textContent = pedidosHoje;
        
        // Produtos em estoque
        const produtosEstoque = produtos.reduce((sum, p) => sum + (p.estoque || 0), 0);
        document.getElementById('produtosEstoque').textContent = produtosEstoque;
        
        // Pedidos pendentes
        const pedidosPendentes = pedidos.filter(p => p.status === 'Pendente').length;
        document.getElementById('pedidosPendentes').textContent = pedidosPendentes;
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
    }
}

// Função auxiliar para obter nome da forma de pagamento
function getPaymentMethodName(method) {
    const names = {
        'pix': 'PIX',
        'cartao': 'Cartão',
        'boleto': 'Boleto',
        'dinheiro': 'Dinheiro'
    };
    return names[method] || method;
}

// Inicializar
window.addEventListener('load', () => {
    carregarProdutos();
});

