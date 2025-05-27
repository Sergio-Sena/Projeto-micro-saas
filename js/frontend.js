/**
 * Frontend JavaScript para Dashboard AWS
 * 
 * Este arquivo contém as funções necessárias para o funcionamento
 * do frontend do Dashboard AWS, incluindo autenticação e interação
 * com os serviços AWS via API.
 * 
 * @author SS Technologies & Manus AI
 * @version 1.1.0
 */

// URL base da API (Ajustado para o backend local)
const API_BASE_URL = 'https://8000-i73u6u34plo4hby0xo8fx-bc096365.manusvm.computer/api'; // Aponta para o backend FastAPI rodando localmente

// Configuração do Google Sign-In (Mantida como simulação, pois requer configuração real no Google Cloud)
function initGoogleSignIn() {
  if (typeof google !== 'undefined') {
    console.log('Inicializando Google Sign-In (Simulação)...');
    google.accounts.id.initialize({
      client_id: 'SEU_GOOGLE_CLIENT_ID_AQUI', // Substitua pelo seu Client ID real
      callback: handleGoogleSignIn,
      auto_select: false,
      cancel_on_tap_outside: true,
    });
    google.accounts.id.renderButton(
      document.getElementById('google-signin-button'),
      { theme: 'outline', size: 'large', width: 300 }
    );
    if (document.getElementById('google-signup-button')) {
      google.accounts.id.renderButton(
        document.getElementById('google-signup-button'),
        { theme: 'outline', size: 'large', width: 300, text: 'signup_with' }
      );
    }
  } else {
    console.warn('Google Identity Services não carregado. Login/Signup com Google desabilitado.');
  }
}

async function handleGoogleSignIn(response) {
  // Mantido como simulação - Implementação real requer backend
  console.warn('Login com Google ainda em modo de simulação.');
  showError('Login com Google ainda não implementado no backend.');
  /*
  try {
    const result = await fetch(`${API_BASE_URL}/auth/google`, { // Endpoint hipotético
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: response.credential }),
    });
    const data = await result.json();
    if (result.ok && data.access_token) {
      localStorage.setItem('token', data.access_token);
      // Assumindo que o backend retorna dados do usuário também
      // localStorage.setItem('user', JSON.stringify(data.user)); 
      // updateUIAfterLogin(data.user);
      showAwsCredsPage();
    } else {
      showError('Falha no login com Google: ' + (data.detail || 'Erro desconhecido'));
    }
  } catch (error) {
    console.error('Erro ao processar login com Google:', error);
    showError('Erro ao processar login com Google. Tente novamente.');
  }
  */
}

/**
 * Função para login tradicional com username e senha (AJUSTADO PARA USAR BACKEND REAL)
 * @param {Event} event - Evento de submit do formulário
 */
async function handleTraditionalLogin(event) {
  event.preventDefault();
  showLoading('Autenticando...');

  // No backend, o login espera 'username', não 'email'
  const username = document.getElementById('username').value; 
  const password = document.getElementById('password').value;

  if (!username || !password) {
    hideLoading();
    showError('Por favor, preencha o nome de usuário e a senha');
    return;
  }

  try {
    // Requisição REAL para o backend
    const response = await fetch(`${API_BASE_URL}/login`, { // Rota /api/login
      method: 'POST',
      headers: {
        // FastAPI espera 'application/x-www-form-urlencoded' para OAuth2PasswordRequestForm
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      // Corpo formatado como x-www-form-urlencoded
      body: new URLSearchParams({
          'username': username,
          'password': password
      })
    });

    const data = await response.json();
    hideLoading();

    if (response.ok && data.access_token) {
      localStorage.setItem('token', data.access_token);
      // Buscar dados do usuário separadamente após login
      await fetchAndStoreUserData(data.access_token);
      showAwsCredsPage(); // Redireciona para a página de credenciais AWS
    } else {
      // Exibe o erro retornado pela API ou uma mensagem padrão
      showError('Falha no login: ' + (data.detail || 'Nome de usuário ou senha incorretos'));
    }
  } catch (error) {
    hideLoading();
    console.error('Erro ao fazer login:', error);
    showError('Erro ao fazer login. Verifique sua conexão e tente novamente.');
  }
}

/**
 * Função para buscar e armazenar dados do usuário após login
 * @param {string} token - Token JWT
 */
async function fetchAndStoreUserData(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/me`, { // Rota /api/me
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const userData = await response.json();
    if (response.ok) {
      localStorage.setItem('user', JSON.stringify(userData));
      updateUIAfterLogin(userData);
    } else {
      console.error('Erro ao buscar dados do usuário:', userData.detail);
      // Não impede o fluxo, mas registra o erro
    }
  } catch (error) {
    console.error('Erro de rede ao buscar dados do usuário:', error);
  }
}


/**
 * Função para registro de novo usuário (AJUSTADO PARA USAR BACKEND REAL)
 * @param {Event} event - Evento de submit do formulário
 */
async function handleSignup(event) {
  event.preventDefault();
  showLoading('Registrando...');

  const username = document.getElementById('signup-username').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  // Validação básica
  if (!username || !email || !password) {
    hideLoading();
    showError('Por favor, preencha todos os campos');
    return;
  }
  if (password !== confirmPassword) {
    hideLoading();
    showError('As senhas não coincidem');
    return;
  }
  if (password.length < 6) { // Ajustar se o backend tiver outra regra
    hideLoading();
    showError('A senha deve ter pelo menos 6 caracteres');
    return;
  }

  try {
    // Requisição REAL para o backend
    const response = await fetch(`${API_BASE_URL}/signup`, { // Rota /api/signup
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    hideLoading();

    if (response.status === 201) { // Verifica o status 201 Created
      // Após signup bem-sucedido, redireciona para login
      showSuccess('Registro bem-sucedido!', 'Você foi registrado com sucesso. Faça o login para continuar.');
      showLoginPage(); // Mostra a página de login após registro
    } else {
      // Exibe o erro retornado pela API ou uma mensagem padrão
      showError('Falha no registro: ' + (data.detail || 'Erro desconhecido'));
    }
  } catch (error) {
    hideLoading();
    console.error('Erro ao registrar:', error);
    showError('Erro ao registrar. Verifique sua conexão e tente novamente.');
  }
}

/**
 * Função para validar credenciais AWS (AJUSTADO PARA USAR BACKEND REAL)
 * @param {Event} event - Evento de submit do formulário
 */
async function handleAwsCredentials(event) {
  event.preventDefault();
  showLoading('Validando credenciais AWS...');

  const accessKeyId = document.getElementById('access-key').value;
  const secretAccessKey = document.getElementById('secret-key').value;

  if (!accessKeyId || !secretAccessKey) {
    hideLoading();
    showError('Por favor, preencha a Access Key ID e a Secret Access Key');
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    hideLoading();
    showError('Sessão expirada ou inválida. Faça login novamente.');
    showLoginPage();
    return;
  }

  try {
    // Requisição REAL para o backend de validação
    const response = await fetch(`${API_BASE_URL}/aws/credentials/validate`, { // Rota /api/aws/credentials/validate
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ accessKeyId, secretAccessKey }), // Enviando no formato esperado pelo backend
    });

    const data = await response.json();
    hideLoading();

    if (response.ok && data.isValid === true) {
      // Credenciais válidas, pode prosseguir para o dashboard
      showSuccess('Credenciais Válidas!', 'Suas credenciais AWS foram validadas com sucesso.');
      // Idealmente, salvar as credenciais de forma segura ou indicar que foram validadas
      localStorage.setItem('aws_validated', 'true'); // Exemplo simples
      showDashboardPage();
    } else {
      // Credenciais inválidas ou erro na API
      localStorage.removeItem('aws_validated');
      showError('Falha na validação: ' + (data.message || 'Credenciais AWS inválidas ou erro na verificação.'));
    }
  } catch (error) {
    hideLoading();
    localStorage.removeItem('aws_validated');
    console.error('Erro ao validar credenciais AWS:', error);
    showError('Erro ao validar credenciais AWS. Verifique sua conexão e tente novamente.');
  }
}

// --- Funções de verificação de autenticação e logout (sem alterações) ---
function checkAuthentication() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return token !== null && user !== null;
}

function handleLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('aws_validated'); // Limpa validação AWS
  showLoginPage();
}

// --- Funções de busca de dados AWS (Mantidas como simulação) ---
// Estas funções precisariam ser adaptadas para chamar o backend real
// passando o token JWT na autorização.

function fetchLambdaFunctions() {
  hideAllServiceContents();
  document.getElementById('lambda-content').classList.remove('hidden');
  showLoading('Carregando Funções Lambda...');
  // Simulação
  setTimeout(() => {
    const lambdaFunctions = [
      { name: 'api-handler', runtime: 'nodejs14.x', memory: 128, lastModified: '2023-05-15' },
      { name: 'image-processor', runtime: 'python3.9', memory: 256, lastModified: '2023-05-10' },
    ];
    renderLambdaFunctions(lambdaFunctions);
    hideLoading();
  }, 1000);
  /* Chamada Real (Exemplo):
  const token = localStorage.getItem('token');
  fetch(`${API_BASE_URL}/aws/lambda`, { headers: { 'Authorization': `Bearer ${token}` } })
    .then(res => res.json())
    .then(data => renderLambdaFunctions(data))
    .catch(err => showError('Erro ao buscar Lambdas'));
  */
}

function fetchEC2Instances() {
  hideAllServiceContents();
  document.getElementById('ec2-content').classList.remove('hidden');
  showLoading('Carregando Instâncias EC2...');
  // Simulação
  setTimeout(() => {
    const ec2Instances = [
      { name: 'Web Server', id: 'i-1234567890abcdef0', type: 't2.micro', state: 'running', publicIp: '54.123.45.67' },
      { name: 'Database', id: 'i-0987654321fedcba0', type: 't3.small', state: 'stopped', publicIp: null },
    ];
    renderEC2Instances(ec2Instances);
    hideLoading();
  }, 1000);
}

function fetchS3Buckets() {
  hideAllServiceContents();
  document.getElementById('s3-content').classList.remove('hidden');
  showLoading('Carregando Buckets S3...');
  // Simulação
  setTimeout(() => {
    const s3Buckets = [
      { name: 'my-website-bucket', creationDate: '2023-01-15', region: 'us-east-1' },
      { name: 'data-backup-bucket', creationDate: '2023-02-20', region: 'us-west-2' },
    ];
    renderS3Buckets(s3Buckets);
    hideLoading();
  }, 1000);
}

function fetchDynamoDBTables() {
  hideAllServiceContents();
  document.getElementById('dynamodb-content').classList.remove('hidden');
  showLoading('Carregando Tabelas DynamoDB...');
  // Simulação
  setTimeout(() => {
    const dynamodbTables = [
      { name: 'Users', status: 'Active', itemCount: 1250 },
      { name: 'Products', status: 'Active', itemCount: 5432 },
    ];
    renderDynamoDBTables(dynamodbTables);
    hideLoading();
  }, 1000);
}

function cleanupAllAwsResources() {
  showLoading('Removendo recursos AWS (Simulação)...');
  setTimeout(() => {
    hideLoading();
    showSuccess('Recursos Removidos (Simulação)', 'Todos os recursos AWS foram removidos com sucesso (simulação).');
  }, 2000);
}

// --- Funções auxiliares para UI (sem alterações significativas) ---
function updateUIAfterLogin(user) {
  const usernameDisplay = document.getElementById('username-display');
  if (usernameDisplay && user) {
    usernameDisplay.textContent = user.username || 'Usuário';
  }
}

function hideAllServiceContents() {
  document.getElementById('welcome-content').classList.add('hidden');
  document.getElementById('lambda-content').classList.add('hidden');
  document.getElementById('ec2-content').classList.add('hidden');
  document.getElementById('s3-content').classList.add('hidden');
  document.getElementById('dynamodb-content').classList.add('hidden');
}

function showError(message) {
  const errorElement = document.getElementById('error-message');
  if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.remove('hidden');
      // Esconder a mensagem após alguns segundos
      setTimeout(() => { errorElement.classList.add('hidden'); }, 5000);
  } else {
      alert(`Erro: ${message}`); // Fallback
  }
  // Opcional: Usar a função showExplanation se disponível e preferível
  /*
  if (typeof showExplanation === 'function') {
    showExplanation('Erro', `<div class="text-center"><p class="text-lg">${message}</p></div>`);
  } else {
    alert(message);
  }
  */
}

function showSuccess(title, message) {
   const successElement = document.getElementById('success-message'); // Supondo que exista um elemento para sucesso
   if (successElement) {
       successElement.innerHTML = `<strong>${title}</strong><br>${message}`;
       successElement.classList.remove('hidden');
       setTimeout(() => { successElement.classList.add('hidden'); }, 5000);
   } else {
       alert(`${title}: ${message}`); // Fallback
   }
}

function showLoading(message) {
  const loadingOverlay = document.getElementById('loading-overlay');
  const loadingMessage = document.getElementById('loading-message');
  if (loadingMessage) {
    loadingMessage.textContent = message || 'Carregando...';
  }
  if (loadingOverlay) {
    loadingOverlay.classList.remove('hidden');
    loadingOverlay.classList.add('flex');
  }
}

function hideLoading() {
  const loadingOverlay = document.getElementById('loading-overlay');
  if (loadingOverlay) {
    loadingOverlay.classList.add('hidden');
    loadingOverlay.classList.remove('flex');
  }
}

// --- Funções de navegação entre páginas (sem alterações) ---
function showLoginPage() {
  console.log("Mostrando página de login");
  document.getElementById('login-page').classList.remove('hidden');
  document.getElementById('signup-page').classList.add('hidden');
  document.getElementById('aws-creds-page').classList.add('hidden');
  document.getElementById('dashboard-page').classList.add('hidden');
}

function showSignupPage() {
  console.log("Mostrando página de cadastro");
  document.getElementById('login-page').classList.add('hidden');
  document.getElementById('signup-page').classList.remove('hidden');
  document.getElementById('aws-creds-page').classList.add('hidden');
  document.getElementById('dashboard-page').classList.add('hidden');
}

function showAwsCredsPage() {
  console.log("Mostrando página de credenciais AWS");
  document.getElementById('login-page').classList.add('hidden');
  document.getElementById('signup-page').classList.add('hidden');
  document.getElementById('aws-creds-page').classList.remove('hidden');
  document.getElementById('dashboard-page').classList.add('hidden');
}

function showDashboardPage() {
  console.log("Mostrando página do dashboard");
  document.getElementById('login-page').classList.add('hidden');
  document.getElementById('signup-page').classList.add('hidden');
  document.getElementById('aws-creds-page').classList.add('hidden');
  document.getElementById('dashboard-page').classList.remove('hidden');
  // Mostra o conteúdo de boas-vindas por padrão ao entrar no dashboard
  hideAllServiceContents();
  document.getElementById('welcome-content').classList.remove('hidden');
  // Atualiza o nome do usuário se disponível
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
      updateUIAfterLogin(user);
  }
}

// --- Renderização de dados (Mantidas como estavam) ---
function renderLambdaFunctions(functions) {
  const container = document.getElementById('lambda-list');
  container.innerHTML = ''; // Limpa o conteúdo anterior
  functions.forEach(func => {
    const card = `
      <div class="bg-gray-800 p-4 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold text-blue-400">${func.name}</h3>
        <p class="text-sm text-gray-400">Runtime: ${func.runtime}</p>
        <p class="text-sm text-gray-400">Memória: ${func.memory} MB</p>
        <p class="text-sm text-gray-400">Última Modificação: ${func.lastModified}</p>
      </div>
    `;
    container.innerHTML += card;
  });
}

function renderEC2Instances(instances) {
  const container = document.getElementById('ec2-list');
  container.innerHTML = '';
  instances.forEach(instance => {
    const card = `
      <div class="bg-gray-800 p-4 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold text-green-400">${instance.name} (${instance.id})</h3>
        <p class="text-sm text-gray-400">Tipo: ${instance.type}</p>
        <p class="text-sm text-gray-400">Estado: <span class="${instance.state === 'running' ? 'text-green-500' : 'text-red-500'}">${instance.state}</span></p>
        ${instance.publicIp ? `<p class="text-sm text-gray-400">IP Público: ${instance.publicIp}</p>` : ''}
      </div>
    `;
    container.innerHTML += card;
  });
}

function renderS3Buckets(buckets) {
  const container = document.getElementById('s3-list');
  container.innerHTML = '';
  buckets.forEach(bucket => {
    const card = `
      <div class="bg-gray-800 p-4 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold text-yellow-400">${bucket.name}</h3>
        <p class="text-sm text-gray-400">Data de Criação: ${bucket.creationDate}</p>
        <p class="text-sm text-gray-400">Região: ${bucket.region}</p>
      </div>
    `;
    container.innerHTML += card;
  });
}

function renderDynamoDBTables(tables) {
  const container = document.getElementById('dynamodb-list');
  container.innerHTML = '';
  tables.forEach(table => {
    const card = `
      <div class="bg-gray-800 p-4 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold text-purple-400">${table.name}</h3>
        <p class="text-sm text-gray-400">Status: <span class="${table.status === 'Active' ? 'text-green-500' : 'text-yellow-500'}">${table.status}</span></p>
        <p class="text-sm text-gray-400">Contagem de Itens: ${table.itemCount.toLocaleString()}</p>
      </div>
    `;
    container.innerHTML += card;
  });
}

// --- Inicialização ---
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM carregado, inicializando aplicação...');
  
  // Adiciona listeners aos formulários
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    console.log("Formulário de login encontrado, adicionando listener");
    loginForm.addEventListener('submit', handleTraditionalLogin);
  } else {
    console.error("Formulário de login não encontrado!");
  }
  
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    console.log("Formulário de cadastro encontrado, adicionando listener");
    signupForm.addEventListener('submit', handleSignup);
  } else {
    console.error("Formulário de cadastro não encontrado!");
  }
  
  const awsCredsForm = document.getElementById('aws-creds-form');
  if (awsCredsForm) {
    console.log("Formulário de credenciais AWS encontrado, adicionando listener");
    awsCredsForm.addEventListener('submit', handleAwsCredentials);
  } else {
    console.error("Formulário de credenciais AWS não encontrado!");
  }
  
  // Adiciona listeners aos botões de navegação e ações
  const signupLink = document.getElementById('show-signup');
  if (signupLink) {
    console.log("Link de cadastro encontrado, adicionando listener");
    signupLink.addEventListener('click', function(e) {
      e.preventDefault();
      console.log("Link de cadastro clicado!");
      showSignupPage();
    });
  } else {
    console.error("Link de cadastro (show-signup) não encontrado!");
  }
  
  // Verifica se existe o link "Sign up" no rodapé da tela de login
  const signUpFooterLink = document.querySelector('a[href="#"][id="sign-up"]');
  if (signUpFooterLink) {
    console.log("Link 'Sign up' no rodapé encontrado, adicionando listener");
    signUpFooterLink.addEventListener('click', function(e) {
      e.preventDefault();
      console.log("Link 'Sign up' no rodapé clicado!");
      showSignupPage();
    });
  }
  
  // Adiciona listener para qualquer link com texto "Sign up"
  document.querySelectorAll('a').forEach(link => {
    if (link.textContent.trim().toLowerCase().includes('sign up')) {
      console.log("Link com texto 'Sign up' encontrado:", link);
      link.addEventListener('click', function(e) {
        e.preventDefault();
        console.log("Link com texto 'Sign up' clicado!");
        showSignupPage();
      });
    }
  });
  
  const backToLoginFromSignup = document.getElementById('back-to-login-from-signup');
  if (backToLoginFromSignup) {
    console.log("Botão 'Back' na tela de cadastro encontrado, adicionando listener");
    backToLoginFromSignup.addEventListener('click', function(e) {
      e.preventDefault();
      console.log("Botão 'Back' na tela de cadastro clicado!");
      showLoginPage();
    });
  } else {
    console.error("Botão 'Back' na tela de cadastro não encontrado!");
  }
  
  const backToLogin = document.getElementById('back-to-login');
  if (backToLogin) {
    console.log("Botão 'Back' na tela de credenciais AWS encontrado, adicionando listener");
    backToLogin.addEventListener('click', function(e) {
      e.preventDefault();
      console.log("Botão 'Back' na tela de credenciais AWS clicado!");
      showLoginPage();
    });
  } else {
    console.error("Botão 'Back' na tela de credenciais AWS não encontrado!");
  }
  
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    console.log("Botão de logout encontrado, adicionando listener");
    logoutBtn.addEventListener('click', handleLogout);
  } else {
    console.error("Botão de logout não encontrado!");
  }

  // Adiciona listeners para os botões de serviço AWS (simulação)
  document.querySelectorAll('[data-service]').forEach(button => {
      button.addEventListener('click', () => {
          const service = button.getAttribute('data-service');
          switch(service) {
              case 'lambda': fetchLambdaFunctions(); break;
              case 'ec2': fetchEC2Instances(); break;
              case 's3': fetchS3Buckets(); break;
              case 'dynamodb': fetchDynamoDBTables(); break;
          }
      });
  });

  const cleanupButton = document.getElementById('cleanup-button');
  if (cleanupButton) cleanupButton.addEventListener('click', cleanupAllAwsResources);

  // Inicializa o Google Sign-In
  initGoogleSignIn(); // Descomentado para habilitar Google Sign-In

  // Verifica se o usuário já está autenticado ao carregar a página
  if (checkAuthentication()) {
    console.log('Usuário autenticado, redirecionando para credenciais AWS ou dashboard...');
    const user = JSON.parse(localStorage.getItem('user'));
    updateUIAfterLogin(user);
    // Verifica se as credenciais AWS já foram validadas nesta sessão (exemplo)
    if (localStorage.getItem('aws_validated') === 'true') {
        showDashboardPage();
    } else {
        showAwsCredsPage();
    }
  } else {
    console.log('Usuário não autenticado, mostrando página de login.');
    showLoginPage();
  }
});
