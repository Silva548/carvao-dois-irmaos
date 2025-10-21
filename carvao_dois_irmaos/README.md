# Carvão Especial Dois Irmãos - Site de E-commerce

## Descrição

Site completo de e-commerce para venda de carvão vegetal, com funcionalidades de cadastro, login, carrinho de compras, checkout, painel administrativo e integração com Google Maps.

## Estrutura do Projeto

```
carvao_dois_irmaos/
├── admin/                  # Painel administrativo
│   └── index.html
├── assets/                 # Recursos estáticos
│   ├── css/               # Arquivos CSS
│   │   ├── admin.css
│   │   ├── carrinho.css
│   │   ├── checkout.css
│   │   ├── detalhes.css
│   │   ├── login.css
│   │   ├── localizacao.css
│   │   ├── meus_pedidos.css
│   │   └── produtos.css
│   ├── images/            # Imagens dos produtos
│   │   ├── carvao_basico_5kg.jpg
│   │   ├── carvao_premium_3kg.jpg
│   │   └── carvao_premium_5kg.jpg
│   └── js/                # Scripts JavaScript
│       ├── admin.js
│       ├── api.js
│       ├── carrinho.js
│       ├── checkout.js
│       ├── detalhes.js
│       ├── login.js
│       ├── localizacao.js
│       ├── maps.js
│       ├── meus_pedidos.js
│       └── produtos.js
├── backend/               # Backend Node.js
│   ├── server.js
│   ├── package.json
│   └── node_modules/      # Dependências do Node.js (excluídas do ZIP)
├── cliente/               # Páginas do cliente
│   ├── carrinho.html
│   ├── checkout.html
│   ├── detalhes.html
│   ├── index.html
│   ├── localizacao.html
│   ├── meus_pedidos.html
│   └── produtos.html
└── README.md
```

## Funcionalidades

### Cliente
- ✅ Login e Cadastro de usuários
- ✅ Navegação como convidado com localização
- ✅ Listagem de produtos com preços de retirada e entrega
- ✅ Detalhes do produto com opções de compra
- ✅ **Melhoria:** Seletor de quantidade com entrada manual e clique contínuo
- ✅ Carrinho de compras com gerenciamento de itens
- ✅ Checkout com agendamento de retirada
- ✅ Integração com ViaCEP para busca de endereço por CEP
- ✅ Múltiplas formas de pagamento (PIX com 5% desconto, Cartão, Boleto, Dinheiro)
- ✅ **Novo:** Página "Meus Pedidos" para visualizar o histórico de pedidos
- ✅ **Novo:** Funcionalidade de cancelamento de pedidos (com restrições de status)
- ✅ **Novo:** Página de localização da empresa com Google Maps

### Administrador
- ✅ **Novo:** Autenticação de administradores (3 administradores fixos)
- ✅ Painel administrativo completo
- ✅ CRUD de produtos (Criar, Ler, Atualizar, Deletar)
- ✅ Visualização e gerenciamento de pedidos
- ✅ **Melhoria:** Atualização de status de pedidos com motivo de espera e observações
- ✅ Estatísticas de vendas e estoque

### Backend
- ✅ API RESTful com Node.js e Express
- ✅ Endpoints para usuários, produtos e pedidos
- ✅ Controle de estoque
- ✅ CORS habilitado para integração frontend-backend
- ✅ **Novo:** Suporte para administradores e clientes

## Instalação

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm (gerenciador de pacotes do Node.js)

### Passo a Passo

1. **Extrair o projeto**
   ```bash
   unzip carvao_dois_irmaos.zip
   cd carvao_dois_irmaos
   ```

2. **Instalar dependências do backend**
   ```bash
   cd backend
   npm install
   ```

3. **Iniciar o servidor**
   ```bash
   npm start
   ```
   
   O servidor será iniciado em `http://localhost:3000`

4. **Acessar o site**
   - **Cliente:** Abra o navegador e acesse: `http://localhost:3000` (redireciona para `cliente/index.html`)
   - **Administrador:** Abra o navegador e acesse: `http://localhost:3000/admin/index.html`

## Uso

### Para Clientes

1. **Acesso Inicial**
   - Acesse `http://localhost:3000`
   - Faça login, cadastre-se ou continue como convidado

2. **Navegação**
   - Visualize os produtos disponíveis
   - Clique em "Ver Detalhes" para mais informações
   - Adicione produtos ao carrinho (com seletor de quantidade aprimorado)
   - Acesse "Meus Pedidos" para ver o histórico e cancelar pedidos (se permitido)
   - Acesse "Localização" para ver o endereço da empresa no mapa

3. **Finalizar Pedido**
   - Acesse o carrinho de compras
   - Clique em "Finalizar Pedido"
   - Preencha os dados de entrega/retirada (com busca de CEP)
   - Escolha a forma de pagamento
   - Confirme o pedido

### Para Administradores

1. **Acesso ao Painel**
   - Acesse `http://localhost:3000/admin/index.html`
   - Use um dos logins de administrador:
     - **Email:** `admin1@carvaodoisirmaos.com` / **Senha:** `admin123`
     - **Email:** `admin2@carvaodoisirmaos.com` / **Senha:** `admin123`
     - **Email:** `admin3@carvaodoisirmaos.com` / **Senha:** `admin123`

2. **Gerenciar Produtos**
   - Adicione novos produtos
   - Edite produtos existentes
   - Controle o estoque
   - Delete produtos

3. **Gerenciar Pedidos**
   - Visualize todos os pedidos
   - Filtre por status
   - Gerencie detalhes do pedido, atualize o status, adicione motivo de espera e observações

4. **Visualizar Estatísticas**
   - Total de vendas
   - Pedidos do dia
   - Produtos em estoque
   - Pedidos pendentes

## Produtos Disponíveis

| Produto | Peso | Preço Retirada | Preço Entrega|preço carga fechada|
|---------|------|----------------|------------- |-------------------|
| Carvão Premium | 5kg | R$ 17,00 | R$ 20,00     | R$ 18,00
| Carvão Premium | 3kg | R$ 10,00 | R$ 11,50     | R$ 10,50
| Carvão Básico  | 5kg | R$ 15,00 | R$ 16,00     | R$ 15,50

## Integração com Google Maps

Para habilitar a integração completa com Google Maps:

1. Obtenha uma chave de API do Google Maps em: https://console.cloud.google.com/
2. Adicione o script no `<head>` das páginas que precisam do Maps (localizacao.html, checkout.html):
   ```html
   <script src="https://maps.googleapis.com/maps/api/js?key=SUA_CHAVE_API&libraries=places"></script>
   ```
3. As funções de geocodificação e cálculo de distância estarão disponíveis automaticamente

## Tecnologias Utilizadas

- **Frontend:**
  - HTML5
  - CSS3
  - JavaScript (ES6+)
  - LocalStorage para persistência de dados (fallback e simulação)

- **Backend:**
  - Node.js
  - Express.js
  - CORS
  - Body-parser

- **APIs Externas:**
  - ViaCEP (busca de endereço por CEP)
  - Google Maps API (geocodificação e cálculo de distância)

## Observações

- O site utiliza `localStorage` como fallback quando o backend não está disponível ou para dados do cliente.
- As imagens dos produtos podem ser substituídas por URLs próprias.
- O endereço de retirada padrão é: Rua dos Churrasqueiros, 123 - Centro, São Paulo - SP.
- Para produção, é recomendado usar um banco de dados real (MongoDB, PostgreSQL, etc.) para persistência de dados do backend.

## Suporte

Para dúvidas ou problemas, entre em contato:
- 📞 (48)998498867
-📧 dasilvanicolas117@gmail.com

---


