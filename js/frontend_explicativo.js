/**
 * Frontend Explicativo para Dashboard AWS
 * 
 * Este arquivo contém as funções explicativas e os botões de sair e apagar serviços
 * para o projeto didático de Dashboard AWS.
 * 
 * @author SS Technologies
 * @version 1.0.0
 */

// Elementos DOM para funções explicativas
let currentExplanation = null;
let explanationOverlay = null;
let explanationContent = null;
let explanationCloseBtn = null;

/**
 * Inicializa os componentes explicativos e botões de ação
 * Esta função deve ser chamada após o carregamento do DOM
 */
function initExplicativeComponents() {
  console.log('Inicializando componentes explicativos...');
  
  // Obtém referências aos elementos do overlay
  explanationOverlay = document.getElementById('explanation-overlay');
  explanationContent = document.getElementById('explanation-content');
  explanationCloseBtn = document.getElementById('explanation-close-btn');
  
  // Adiciona explicações aos cards de serviço
  setupServiceExplanations();
  
  // Configura o botão de limpeza de recursos
  setupCleanupButton();
  
  console.log('Componentes explicativos inicializados com sucesso!');
}

/**
 * Configura explicações para os cards de serviço AWS
 */
function setupServiceExplanations() {
  // Serviços AWS e suas explicações
  const awsServices = [
    {
      id: 'lambda-card',
      title: 'AWS Lambda',
      content: `
        <p><strong>O que é:</strong> AWS Lambda é um serviço de computação serverless que executa código em resposta a eventos, gerenciando automaticamente os recursos computacionais.</p>
        
        <p><strong>Como funciona:</strong> Você carrega seu código como uma função Lambda, configura gatilhos (como requisições HTTP, alterações em buckets S3, etc.) e o Lambda executa o código quando esses eventos ocorrem.</p>
        
        <p><strong>Vantagens:</strong></p>
        <ul class="list-disc pl-5 space-y-1">
          <li>Não é necessário provisionar ou gerenciar servidores</li>
          <li>Escalabilidade automática baseada na carga</li>
          <li>Pagamento apenas pelo tempo de computação consumido</li>
          <li>Suporte a várias linguagens de programação (Node.js, Python, Java, etc.)</li>
        </ul>
        
        <p><strong>Casos de uso comuns:</strong></p>
        <ul class="list-disc pl-5 space-y-1">
          <li>APIs e webhooks</li>
          <li>Processamento de dados em tempo real</li>
          <li>Automação de tarefas</li>
          <li>Backends para aplicações web e mobile</li>
        </ul>
        
        <p><strong>Conceitos importantes:</strong></p>
        <ul class="list-disc pl-5 space-y-1">
          <li><em>Função:</em> Unidade de código que processa eventos</li>
          <li><em>Gatilho:</em> Evento que inicia a execução da função</li>
          <li><em>Tempo de execução:</em> Ambiente que executa o código (ex: Node.js 14.x)</li>
          <li><em>Camadas:</em> Bibliotecas e dependências compartilhadas entre funções</li>
        </ul>
      `
    },
    {
      id: 'ec2-card',
      title: 'Amazon EC2',
      content: `
        <p><strong>O que é:</strong> Amazon Elastic Compute Cloud (EC2) é um serviço de computação em nuvem que fornece capacidade computacional redimensionável na forma de instâncias de servidor virtual.</p>
        
        <p><strong>Como funciona:</strong> Você seleciona um tipo de instância com recursos específicos (CPU, memória, armazenamento), escolhe uma imagem de máquina (AMI) com o sistema operacional desejado e inicia a instância na região escolhida.</p>
        
        <p><strong>Vantagens:</strong></p>
        <ul class="list-disc pl-5 space-y-1">
          <li>Controle total sobre as instâncias (sistema operacional, software, etc.)</li>
          <li>Ampla variedade de tipos de instância para diferentes cargas de trabalho</li>
          <li>Opções de pagamento flexíveis (sob demanda, instâncias reservadas, spot)</li>
          <li>Integração com outros serviços AWS</li>
        </ul>
        
        <p><strong>Casos de uso comuns:</strong></p>
        <ul class="list-disc pl-5 space-y-1">
          <li>Hospedagem de aplicações web</li>
          <li>Servidores de banco de dados</li>
          <li>Ambientes de desenvolvimento e teste</li>
          <li>Processamento de dados em lote</li>
        </ul>
        
        <p><strong>Conceitos importantes:</strong></p>
        <ul class="list-disc pl-5 space-y-1">
          <li><em>Instância:</em> Servidor virtual na nuvem</li>
          <li><em>AMI:</em> Imagem que contém o sistema operacional e software</li>
          <li><em>Grupo de segurança:</em> Firewall virtual que controla o tráfego</li>
          <li><em>EBS:</em> Armazenamento em bloco para instâncias EC2</li>
        </ul>
      `
    },
    {
      id: 's3-card',
      title: 'Amazon S3',
      content: `
        <p><strong>O que é:</strong> Amazon Simple Storage Service (S3) é um serviço de armazenamento de objetos que oferece escalabilidade, disponibilidade de dados, segurança e performance.</p>
        
        <p><strong>Como funciona:</strong> Você cria buckets (contêineres) para armazenar objetos (arquivos), que podem ser acessados via HTTP/HTTPS. Cada objeto tem uma URL única e pode ter até 5TB de tamanho.</p>
        
        <p><strong>Vantagens:</strong></p>
        <ul class="list-disc pl-5 space-y-1">
          <li>Durabilidade de 99,999999999% (11 noves)</li>
          <li>Escalabilidade praticamente ilimitada</li>
          <li>Controle de acesso granular</li>
          <li>Hospedagem de sites estáticos</li>
          <li>Ciclo de vida para gerenciamento automático de objetos</li>
        </ul>
        
        <p><strong>Casos de uso comuns:</strong></p>
        <ul class="list-disc pl-5 space-y-1">
          <li>Armazenamento e distribuição de conteúdo</li>
          <li>Backup e arquivamento</li>
          <li>Hospedagem de sites estáticos</li>
          <li>Data lakes e análise de big data</li>
        </ul>
        
        <p><strong>Conceitos importantes:</strong></p>
        <ul class="list-disc pl-5 space-y-1">
          <li><em>Bucket:</em> Contêiner para armazenar objetos</li>
          <li><em>Objeto:</em> Arquivo e seus metadados</li>
          <li><em>Classe de armazenamento:</em> Diferentes níveis de disponibilidade e custo</li>
          <li><em>Política de bucket:</em> Regras de acesso em formato JSON</li>
        </ul>
      `
    },
    {
      id: 'dynamodb-card',
      title: 'Amazon DynamoDB',
      content: `
        <p><strong>O que é:</strong> Amazon DynamoDB é um serviço de banco de dados NoSQL totalmente gerenciado que fornece performance rápida e previsível com escalabilidade contínua.</p>
        
        <p><strong>Como funciona:</strong> Você cria tabelas para armazenar e recuperar dados, e o DynamoDB gerencia automaticamente o particionamento dos dados e o provisionamento de recursos para atender aos requisitos de performance.</p>
        
        <p><strong>Vantagens:</strong></p>
        <ul class="list-disc pl-5 space-y-1">
          <li>Latência de milissegundos de um dígito em qualquer escala</li>
          <li>Escalabilidade automática</li>
          <li>Sem servidor para gerenciar</li>
          <li>Suporte a modelos de dados de documentos e chave-valor</li>
          <li>Integração com outros serviços AWS</li>
        </ul>
        
        <p><strong>Casos de uso comuns:</strong></p>
        <ul class="list-disc pl-5 space-y-1">
          <li>Aplicações web e mobile</li>
          <li>Jogos</li>
          <li>IoT</li>
          <li>Microserviços</li>
        </ul>
        
        <p><strong>Conceitos importantes:</strong></p>
        <ul class="list-disc pl-5 space-y-1">
          <li><em>Tabela:</em> Coleção de itens</li>
          <li><em>Item:</em> Grupo de atributos identificável de forma única</li>
          <li><em>Chave primária:</em> Identificador único para cada item</li>
          <li><em>Índice secundário:</em> Estrutura de dados alternativa para consultas</li>
        </ul>
      `
    }
  ];
  
  // Adiciona eventos de clique aos botões de informação
  awsServices.forEach(service => {
    const card = document.getElementById(service.id);
    if (card) {
      const infoButton = card.querySelector('button');
      if (infoButton) {
        infoButton.addEventListener('click', function(e) {
          e.stopPropagation(); // Evita que o clique propague para o card
          showExplanation(service.title, service.content);
        });
      }
    }
  });
  
  // Configura o botão de logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    // Substitui o evento de clique original
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Mostra explicação sobre o processo de logout
      showExplanation('Processo de Logout', `
        <p>O processo de logout em uma aplicação com autenticação JWT envolve os seguintes passos:</p>
        
        <ol class="list-decimal pl-5 space-y-2">
          <li>
            <strong>No frontend:</strong>
            <ul class="list-disc pl-5 mt-1">
              <li>Remover o token JWT do armazenamento local (localStorage)</li>
              <li>Limpar dados do usuário da memória</li>
              <li>Redirecionar para a página de login</li>
            </ul>
          </li>
          
          <li>
            <strong>No backend (opcional):</strong>
            <ul class="list-disc pl-5 mt-1">
              <li>Em sistemas com lista de tokens revogados, adicionar o token à lista</li>
              <li>Registrar o evento de logout para fins de auditoria</li>
            </ul>
          </li>
        </ol>
        
        <p class="mt-4">Ao clicar em "Confirmar Logout", seu token será removido e você será redirecionado para a tela de login.</p>
        
        <div class="mt-4 flex justify-center">
          <button id="confirm-logout" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200">
            Confirmar Logout
          </button>
        </div>
      `);
      
      // Adiciona evento ao botão de confirmar logout
      setTimeout(() => {
        const confirmBtn = document.getElementById('confirm-logout');
        if (confirmBtn) {
          confirmBtn.addEventListener('click', function() {
            hideExplanation();
            handleLogout();
          });
        }
      }, 100);
    });
  }
}

/**
 * Configura o botão de limpeza de recursos AWS
 */
function setupCleanupButton() {
  const cleanupBtn = document.getElementById('cleanup-services-btn');
  
  if (cleanupBtn) {
    cleanupBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      showExplanation('Apagar Serviços AWS', `
        <p><strong>Esta função permite remover todos os recursos AWS criados durante o uso da aplicação.</strong></p>
        
        <p class="mt-4">Ao apagar os serviços, os seguintes recursos serão removidos:</p>
        
        <ul class="list-disc pl-5 space-y-1 mt-2">
          <li>Funções Lambda</li>
          <li>Instâncias EC2</li>
          <li>Buckets S3 (e seus conteúdos)</li>
          <li>Tabelas DynamoDB</li>
          <li>Outros recursos associados (roles IAM, security groups, etc.)</li>
        </ul>
        
        <div class="bg-yellow-900 bg-opacity-30 border border-yellow-700 rounded-lg p-4 mt-4">
          <p class="text-yellow-300 font-medium"><i class="fas fa-exclamation-triangle mr-2"></i> Atenção:</p>
          <p class="mt-1 text-yellow-100">Esta ação não pode ser desfeita. Todos os dados armazenados nos serviços serão permanentemente perdidos.</p>
        </div>
        
        <p class="mt-4">Como funciona o processo de limpeza:</p>
        
        <ol class="list-decimal pl-5 space-y-2 mt-2">
          <li>O frontend envia uma solicitação para o endpoint <code>/api/aws/resources</code> com método DELETE</li>
          <li>O backend usa o AWS SDK para identificar e remover recursos associados à sua conta</li>
          <li>Um relatório de recursos removidos é gerado e retornado</li>
        </ol>
        
        <p class="mt-4">Deseja prosseguir com a remoção de todos os recursos AWS?</p>
        
        <div class="mt-6 flex justify-center space-x-4">
          <button id="cancel-cleanup" class="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200">
            Cancelar
          </button>
          <button id="confirm-cleanup" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200">
            Confirmar Remoção
          </button>
        </div>
      `);
      
      // Adiciona eventos aos botões
      setTimeout(() => {
        const cancelBtn = document.getElementById('cancel-cleanup');
        const confirmBtn = document.getElementById('confirm-cleanup');
        
        if (cancelBtn) {
          cancelBtn.addEventListener('click', function() {
            hideExplanation();
          });
        }
        
        if (confirmBtn) {
          confirmBtn.addEventListener('click', function() {
            hideExplanation();
            cleanupAllAwsResources();
          });
        }
      }, 100);
    });
  }
}

/**
 * Exibe uma explicação no overlay
 * @param {string} title - Título da explicação
 * @param {string} content - Conteúdo HTML da explicação
 */
function showExplanation(title, content) {
  if (!explanationOverlay) {
    explanationOverlay = document.getElementById('explanation-overlay');
    explanationContent = document.getElementById('explanation-content');
  }
  
  if (!explanationOverlay || !explanationContent) {
    console.error('Elementos de explicação não encontrados');
    return;
  }
  
  // Atualiza o conteúdo
  document.getElementById('explanation-title').textContent = title;
  explanationContent.innerHTML = content;
  
  // Exibe o overlay com animação
  explanationOverlay.classList.remove('hidden');
  explanationOverlay.classList.add('flex');
  
  // Adiciona evento de tecla Escape para fechar
  document.addEventListener('keydown', handleEscapeKey);
  
  // Salva a explicação atual
  currentExplanation = { title, content };
}

/**
 * Esconde o overlay de explicação
 */
function hideExplanation() {
  if (explanationOverlay) {
    explanationOverlay.classList.add('hidden');
    explanationOverlay.classList.remove('flex');
    
    // Remove evento de tecla Escape
    document.removeEventListener('keydown', handleEscapeKey);
  }
}

/**
 * Manipula o evento de tecla Escape para fechar a explicação
 * @param {KeyboardEvent} event - Evento de teclado
 */
function handleEscapeKey(event) {
  if (event.key === 'Escape') {
    hideExplanation();
  }
}

// Inicializa os componentes quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  // Inicializa os componentes explicativos
  initExplicativeComponents();
  
  // Configura o botão de fechar explicação
  const closeBtn = document.getElementById('explanation-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', hideExplanation);
  }
  
  // Configura o botão "Entendi"
  const gotItBtn = document.getElementById('explanation-got-it');
  if (gotItBtn) {
    gotItBtn.addEventListener('click', hideExplanation);
  }
});

// Exporta funções para uso global
window.showExplanation = showExplanation;
window.hideExplanation = hideExplanation;
