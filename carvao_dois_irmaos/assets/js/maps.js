// Integração com Google Maps
// NOTA: Para usar este arquivo, você precisa adicionar sua chave de API do Google Maps
// Adicione no HTML: <script src="https://maps.googleapis.com/maps/api/js?key=SUA_CHAVE_API&libraries=places"></script>

let map;
let geocoder;
let autocomplete;

// Inicializar Google Maps
function initMap() {
    // Localização padrão (São Paulo - Centro)
    const defaultLocation = { lat: -23.5505, lng: -46.6333 };
    
    // Criar mapa
    map = new google.maps.Map(document.getElementById('map'), {
        center: defaultLocation,
        zoom: 15
    });
    
    // Inicializar Geocoder
    geocoder = new google.maps.Geocoder();
    
    // Adicionar marcador
    const marker = new google.maps.Marker({
        position: defaultLocation,
        map: map,
        title: 'Carvão Especial Dois Irmãos'
    });
}

// Buscar endereço por CEP
async function buscarEnderecoPorCEP(cep) {
    try {
        // Remover caracteres não numéricos
        cep = cep.replace(/\D/g, '');
        
        if (cep.length !== 8) {
            throw new Error('CEP inválido');
        }
        
        // Buscar CEP na API ViaCEP
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (data.erro) {
            throw new Error('CEP não encontrado');
        }
        
        return {
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf,
            cep: data.cep
        };
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        throw error;
    }
}

// Geocodificar endereço (converter endereço em coordenadas)
function geocodificarEndereco(endereco) {
    return new Promise((resolve, reject) => {
        if (!geocoder) {
            reject(new Error('Geocoder não inicializado'));
            return;
        }
        
        geocoder.geocode({ address: endereco }, (results, status) => {
            if (status === 'OK') {
                const location = results[0].geometry.location;
                resolve({
                    lat: location.lat(),
                    lng: location.lng(),
                    enderecoFormatado: results[0].formatted_address
                });
            } else {
                reject(new Error('Geocodificação falhou: ' + status));
            }
        });
    });
}

// Calcular distância entre dois pontos
function calcularDistancia(origem, destino) {
    return new Promise((resolve, reject) => {
        const service = new google.maps.DistanceMatrixService();
        
        service.getDistanceMatrix({
            origins: [origem],
            destinations: [destino],
            travelMode: 'DRIVING',
            unitSystem: google.maps.UnitSystem.METRIC
        }, (response, status) => {
            if (status === 'OK') {
                const result = response.rows[0].elements[0];
                if (result.status === 'OK') {
                    resolve({
                        distancia: result.distance.value, // em metros
                        distanciaTexto: result.distance.text,
                        duracao: result.duration.value, // em segundos
                        duracaoTexto: result.duration.text
                    });
                } else {
                    reject(new Error('Não foi possível calcular a distância'));
                }
            } else {
                reject(new Error('Erro no serviço de distância: ' + status));
            }
        });
    });
}



// Inicializar autocomplete para campo de endereço
function initAutocomplete(inputId) {
    const input = document.getElementById(inputId);
    
    if (!input) {
        console.error('Campo de input não encontrado:', inputId);
        return;
    }
    
    autocomplete = new google.maps.places.Autocomplete(input, {
        types: ['address'],
        componentRestrictions: { country: 'br' }
    });
    
    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        
        if (!place.geometry) {
            console.error('Nenhum detalhe disponível para o endereço selecionado');
            return;
        }
        
        // Preencher campos com informações do endereço
        const addressComponents = place.address_components;
        let endereco = {
            logradouro: '',
            numero: '',
            bairro: '',
            cidade: '',
            estado: '',
            cep: ''
        };
        
        for (let component of addressComponents) {
            const types = component.types;
            
            if (types.includes('street_number')) {
                endereco.numero = component.long_name;
            } else if (types.includes('route')) {
                endereco.logradouro = component.long_name;
            } else if (types.includes('sublocality_level_1') || types.includes('neighborhood')) {
                endereco.bairro = component.long_name;
            } else if (types.includes('administrative_area_level_2')) {
                endereco.cidade = component.long_name;
            } else if (types.includes('administrative_area_level_1')) {
                endereco.estado = component.short_name;
            } else if (types.includes('postal_code')) {
                endereco.cep = component.long_name;
            }
        }
        
        // Disparar evento customizado com os dados do endereço
        const event = new CustomEvent('enderecoSelecionado', { detail: endereco });
        input.dispatchEvent(event);
    });
}

// Validar se o Google Maps está carregado
function isGoogleMapsLoaded() {
    return typeof google !== 'undefined' && typeof google.maps !== 'undefined';
}

