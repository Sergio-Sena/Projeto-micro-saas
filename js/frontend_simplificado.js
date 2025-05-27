/**
 * Frontend JavaScript para Dashboard AWS - Versão Simplificada
 * 
 * Esta versão simplificada foca apenas na navegação entre telas,
 * sem depender do backend para funcionalidades básicas.
 * 
 * @author SS Technologies & Manus AI
 * @version 1.2.0
 */

// Configuração do Google Sign-In (Simulação)
function initGoogleSignIn() {
  console.log('Inicializando Google Sign-In (Simulação)...');
  if (typeof google !== 'undefined') {
    google.accounts.id.initialize({
      client_id: 'SEU_GOOGLE_CLIENT_ID_AQUI',
      callback: handleGoogleSignIn,
      auto_select: false,
      cancel_on_tap_outside: true,
    });
    
    const googleSigninButton = document.getElementById('google-signin-button');
    if (googleSigninButton) {
      google.accounts.id.renderButton(
        googleSigninButton,
        { theme: 'outline', size: 'large', width: 300 }
      );
    }
    
    const googleSignupButton = document.getElementById('google-signup-button');
    if (googleSignupButton) {
      google.accounts.id.renderButton(
        googleSignupButton,
        { theme: 'outline', size: 'large', width: 300, text: 'signup_with' }
      );
    }
  } else {
    console.warn('Google Identity Services não carregado. Login/Signup com Google desabilitado.');
  }
}

// Simulação de login com Google
function handleGoogleSignIn(response) {
  console.log('Login com Google simulado');
  alert('Login com Google simulado com sucesso!');
  // Simula login bem-sucedido e redireciona para AWS Creds
  simulateSuccessfulLogin({
    username: 'Usuario Google',
    email: 'google@example.com'
  });
}

// Função para login tradicional (SIMULAÇÃO)
function handleTraditionalLogin(event) {
  event.preventDefault();
  console.log('Login tradicional simulado');
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  if (!username || !password) {
    alert('Por favor, preencha todos os campos');
    return;
  }
  
  // Simula login bem-sucedido
  simulateSuccessfulLogin({
    username: username,
    email: username
  });
}

// Função para registro de novo usuário (SIMULAÇÃO)
function handleSignup(event) {
  event.preventDefault();
  console.log('Cadastro simulado');
  
  const username = document.getElementById('signup-username').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  
  // Validação básica
  if (!username || !email || !password) {
    alert('Por favor, preencha todos os campos');
    return;
  }
  
  if (password !== confirmPassword) {
    alert('As senhas não coincidem');
    return;
  }
  
  // Simula cadastro bem-sucedido
  alert('Cadastro realizado com sucesso! Faça login para continuar.');
  showLoginPage();
}

// Função para validar credenciais AWS (SIMULAÇÃO)
function handleAwsCredentials(event) {
  event.preventDefault();
  console.log('Validação de credenciais AWS simulada');
  
  const accessKeyId = document.getElementById('access-key').value;
  const secretAccessKey = document.getElementById('secret-key').value;
  
  if (!accessKeyId || !secretAccessKey) {
    alert('Por favor, preencha todos os campos');
    return;
  }
  
  // Simula validação bem-sucedida
  alert('Credenciais AWS validadas com sucesso!');
  showDashboardPage();
}

// Simula um login bem-sucedido
function simulateSuccessfulLogin(user) {
  console.log('Login simulado para:', user);
  
  // Armazena informações do usuário
  localStorage.setItem('user', JSON.stringify(user));
  
  // Atualiza a UI
  updateUIAfterLogin(user);
  
  // Redireciona para a página de credenciais AWS
  showAwsCredsPage();
}

// Função de logout
function handleLogout() {
  console.log('Logout realizado');
  localStorage.removeItem('user');
  showLoginPage();
}

// Atualiza a UI após o login
function updateUIAfterLogin(user) {
  const usernameDisplay = document.getElementById('username-display');
  if (usernameDisplay && user) {
    usernameDisplay.textContent = user.username || 'Usuário';
  }
}

// Funções de navegação entre páginas
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
  
  // Mostra o conteúdo de boas-vindas
  hideAllServiceContents();
  document.getElementById('welcome-content').classList.remove('hidden');
  
  // Atualiza o nome do usuário
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    updateUIAfterLogin(user);
  }
}

// Esconde todos os conteúdos de serviço
function hideAllServiceContents() {
  const contents = [
    'welcome-content',
    'lambda-content',
    'ec2-content',
    's3-content',
    'dynamodb-content'
  ];
  
  contents.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.classList.add('hidden');
    }
  });
}

// Funções de simulação para serviços AWS
function fetchLambdaFunctions() {
  hideAllServiceContents();
  document.getElementById('lambda-content').classList.remove('hidden');
  alert('Funções Lambda carregadas (simulação)');
}

function fetchEC2Instances() {
  hideAllServiceContents();
  document.getElementById('ec2-content').classList.remove('hidden');
  alert('Instâncias EC2 carregadas (simulação)');
}

function fetchS3Buckets() {
  hideAllServiceContents();
  document.getElementById('s3-content').classList.remove('hidden');
  alert('Buckets S3 carregados (simulação)');
}

function fetchDynamoDBTables() {
  hideAllServiceContents();
  document.getElementById('dynamodb-content').classList.remove('hidden');
  alert('Tabelas DynamoDB carregadas (simulação)');
}

function cleanupAllAwsResources() {
  alert('Recursos AWS removidos (simulação)');
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM carregado, inicializando aplicação simplificada...');
  
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
  
  // Adiciona listeners aos botões de navegação
  
  // Link para página de cadastro
  const showSignupLink = document.getElementById('show-signup');
  if (showSignupLink) {
    console.log("Link 'show-signup' encontrado, adicionando listener");
    showSignupLink.addEventListener('click', function(e) {
      e.preventDefault();
      console.log("Link 'show-signup' clicado");
      showSignupPage();
    });
  } else {
    console.error("Link 'show-signup' não encontrado!");
    
    // Tenta encontrar qualquer link que possa ser o de cadastro
    document.querySelectorAll('a').forEach(link => {
      if (link.textContent.trim().toLowerCase().includes('sign up')) {
        console.log("Link alternativo para cadastro encontrado:", link.textContent);
        link.addEventListener('click', function(e) {
          e.preventDefault();
          console.log("Link alternativo para cadastro clicado");
          showSignupPage();
        });
      }
    });
  }
  
  // Botão voltar da página de cadastro
  const backToLoginFromSignup = document.getElementById('back-to-login-from-signup');
  if (backToLoginFromSignup) {
    console.log("Botão 'Back' na página de cadastro encontrado, adicionando listener");
    backToLoginFromSignup.addEventListener('click', function(e) {
      e.preventDefault();
      console.log("Botão 'Back' na página de cadastro clicado");
      showLoginPage();
    });
  } else {
    console.error("Botão 'Back' na página de cadastro não encontrado!");
  }
  
  // Botão voltar da página de credenciais AWS
  const backToLogin = document.getElementById('back-to-login');
  if (backToLogin) {
    console.log("Botão 'Back' na página de credenciais AWS encontrado, adicionando listener");
    backToLogin.addEventListener('click', function(e) {
      e.preventDefault();
      console.log("Botão 'Back' na página de credenciais AWS clicado");
      showLoginPage();
    });
  } else {
    console.error("Botão 'Back' na página de credenciais AWS não encontrado!");
  }
  
  // Botão de logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    console.log("Botão de logout encontrado, adicionando listener");
    logoutBtn.addEventListener('click', handleLogout);
  } else {
    console.error("Botão de logout não encontrado!");
  }
  
  // Adiciona listeners para os botões de serviço AWS
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
  
  // Botão de limpeza de recursos
  const cleanupButton = document.getElementById('cleanup-button');
  if (cleanupButton) {
    cleanupButton.addEventListener('click', cleanupAllAwsResources);
  }
  
  // Inicializa o Google Sign-In
  initGoogleSignIn();
  
  // Verifica se o usuário já está "logado"
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    console.log('Usuário encontrado no localStorage:', user);
    updateUIAfterLogin(user);
    showAwsCredsPage();
  } else {
    console.log('Nenhum usuário encontrado, mostrando página de login');
    showLoginPage();
  }
  
  // Adiciona listeners para links de cadastro no rodapé
  const signUpLink = document.querySelector('a[href="#"][id="sign-up"]');
  if (signUpLink) {
    signUpLink.addEventListener('click', function(e) {
      e.preventDefault();
      showSignupPage();
    });
  }
  
  // Adiciona listeners para qualquer link com texto "Sign up"
  document.querySelectorAll('a').forEach(link => {
    const text = link.textContent.trim().toLowerCase();
    if (text.includes('sign up') || text.includes('signup') || text.includes('cadastro')) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        console.log("Link de cadastro clicado:", text);
        showSignupPage();
      });
    }
  });
});
