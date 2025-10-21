// Elementos do DOM
const loginSection = document.getElementById('loginSection');
const registerSection = document.getElementById('registerSection');
const showRegisterBtn = document.getElementById('showRegisterBtn');
const showLoginBtn = document.getElementById('showLoginBtn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const guestForm = document.getElementById('guestForm');

// Alternar entre Login e Cadastro
showRegisterBtn.addEventListener('click', () => {
    loginSection.classList.add('hidden');
    registerSection.classList.remove('hidden');
});

showLoginBtn.addEventListener('click', () => {
    registerSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
});

// Processar Login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Buscar usuários do localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Verificar credenciais
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Salvar usuário logado
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert('Login realizado com sucesso!');
        
        // Redirecionar para a página de produtos
        window.location.href = 'produtos.html';
    } else {
        alert('E-mail ou senha incorretos!');
    }
});

// Processar Cadastro
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const phone = document.getElementById('registerPhone').value;
    const address = document.getElementById('registerAddress').value;
    const cep = document.getElementById('registerCEP').value;
    
    // Buscar usuários do localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Verificar se o e-mail já existe
    if (users.some(u => u.email === email)) {
        alert('Este e-mail já está cadastrado!');
        return;
    }
    
    // Criar novo usuário
    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        phone,
        address,
        cep,
        type: 'cliente'
    };
    
    // Adicionar ao array de usuários
    users.push(newUser);
    
    // Salvar no localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('Cadastro realizado com sucesso! Faça login para continuar.');
    
    // Limpar formulário e voltar para login
    registerForm.reset();
    registerSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
});

// Processar Convidado
guestForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const location = document.getElementById('guestCEP').value;
    
    // Salvar localização do convidado
    const guestData = {
        type: 'guest',
        location: location
    };
    
    localStorage.setItem('currentUser', JSON.stringify(guestData));
    
    alert('Localização confirmada! Bem-vindo!');
    
    // Redirecionar para a página de produtos
    window.location.href = 'produtos.html';
});

// Verificar se já está logado
window.addEventListener('load', () => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        // Se já estiver logado, redirecionar para produtos
        window.location.href = 'produtos.html';
    }
});

