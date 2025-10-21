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
        userName.textContent = 'Olá, Visitante';
    }
}

// Atualizar contador do carrinho
function atualizarCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const totalItens = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
    document.getElementById('cartCount').textContent = totalItens;
}

// Inicializar mapa do Google Maps (se a API estiver carregada)
function initMap() {
    if (!isGoogleMapsLoaded()) {
        console.log('Google Maps API não carregada');
        return;
    }
    
    // Localização da empresa (exemplo)
    const empresaLocation = { lat: -23.5505, lng: -46.6333 };
    
    // Criar mapa
    const map = new google.maps.Map(document.getElementById('map'), {
        center: empresaLocation,
        zoom: 16,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true
    });
    
    // Adicionar marcador
    const marker = new google.maps.Marker({
        position: empresaLocation,
        map: map,
        title: 'Carvão Especial Dois Irmãos',
        animation: google.maps.Animation.DROP
    });
    
    // Adicionar janela de informações
    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div style="padding: 10px;">
                <h3 style="color: #ff6b35; margin-bottom: 10px;">Carvão Especial Dois Irmãos</h3>
                <p><strong>Endereço:</strong> Rua dos Churrasqueiros, 123</p>
                <p><strong>Bairro:</strong> Centro - São Paulo, SP</p>
                <p><strong>CEP:</strong> 01000-000</p>
                <p><strong>Telefone:</strong> (11) 1234-5678</p>
                <p><strong>Horário:</strong> Seg-Sex: 8h às 18h | Sáb: 8h às 14h</p>
            </div>
        `
    });
    
    // Abrir janela de informações ao clicar no marcador
    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });
    
    // Abrir janela de informações automaticamente
    infoWindow.open(map, marker);
    
    // Remover placeholder
    const mapElement = document.getElementById('map');
    mapElement.classList.remove('map-placeholder');
    mapElement.innerHTML = '';
}

// Inicializar página
window.addEventListener('load', () => {
    verificarUsuario();
    atualizarCarrinho();
    
    // Tentar inicializar mapa se a API estiver carregada
    if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
        initMap();
    }
});

