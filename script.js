document.addEventListener('DOMContentLoaded', function() {
    // Animar os elementos quando a página carrega
    animateOnScroll();
    
    // Adicionar corações flutuantes aleatórios
    createRandomHearts();
    
    // Detectar quando o usuário rola a página
    window.addEventListener('scroll', function() {
        animateOnScroll();
    });
    
    // Adicionar efeito hover nos cartões de memória
    const memoryCards = document.querySelectorAll('.memory-card');
    memoryCards.forEach(card => {
        card.addEventListener('mouseover', function() {
            playHeartbeat(this);
        });
    });
    
    // Adicionar mensagens surpresa ao clicar na carta de amor
    const loveLetter = document.querySelector('.love-letter');
    loveLetter.addEventListener('click', function() {
        showLoveMessage();
    });

    // Exibir memórias em tempo real do Firebase
    displayMemoriesRealtime();
    const saveBtn = document.getElementById('save-memory');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveMemory);
    }

    // Botão de olho rola até a seção de elogios aos olhos
    const eyeBtn = document.getElementById('eye-button');
    const eyeModal = document.getElementById('eye-modal');
    const closeEyeModal = document.getElementById('close-eye-modal');
    if (eyeBtn && eyeModal) {
        eyeBtn.addEventListener('click', function() {
            eyeModal.classList.add('open');
        });
    }
    if (closeEyeModal && eyeModal) {
        closeEyeModal.addEventListener('click', function() {
            eyeModal.classList.remove('open');
        });
    }
    // Fechar ao clicar fora do conteúdo do modal
    if (eyeModal) {
        eyeModal.addEventListener('click', function(e) {
            if (e.target === eyeModal) {
                eyeModal.classList.remove('open');
            }
        });
    }

    // Check if user is logged in
    checkAuth();

    // Get current user
    const currentUser = checkAuth();

    // Add logout button to the page
    addLogoutButton();

    // Inicialização do Firebase Storage
    let storage;
    try {
        storage = firebase.storage();
        console.log('Firebase Storage inicializado com sucesso');
    } catch (error) {
        console.error('Erro ao inicializar Firebase Storage:', error);
        alert('Erro ao inicializar o sistema de armazenamento. Por favor, recarregue a página.');
    }
    const photosRef = db.collection('photos');

    // Gerenciamento dos botões de galeria
    const goToPhotosBtn = document.getElementById('go-to-photos');
    const goToVideosBtn = document.getElementById('go-to-videos');
    const photosModal = document.getElementById('photos-modal');
    const videosModal = document.getElementById('videos-modal');
    const closePhotosModal = document.getElementById('close-photos-modal');
    const closeVideosModal = document.getElementById('close-videos-modal');

    // Função para abrir modal
    function openModal(modal) {
        if (modal) {
            modal.classList.add('open');
            // Pausar todos os vídeos quando abrir o modal
            if (modal === videosModal) {
                const videos = modal.querySelectorAll('video');
                videos.forEach(video => video.pause());
            }
        }
    }

    // Função para fechar modal
    function closeModal(modal) {
        if (modal) {
            modal.classList.remove('open');
            // Pausar todos os vídeos quando fechar o modal
            if (modal === videosModal) {
                const videos = modal.querySelectorAll('video');
                videos.forEach(video => video.pause());
            }
        }
    }

    // Event listeners para os botões de galeria
    if (goToPhotosBtn && photosModal) {
        goToPhotosBtn.addEventListener('click', function() {
            openModal(photosModal);
        });
    }

    if (goToVideosBtn && videosModal) {
        goToVideosBtn.addEventListener('click', function() {
            openModal(videosModal);
        });
    }

    // Event listeners para fechar os modais
    if (photosModal && closePhotosModal) {
        // Fechar modal de fotos
        closePhotosModal.addEventListener('click', function() {
            closeModal(photosModal);
        });

        // Fechar ao clicar fora do conteúdo
        photosModal.addEventListener('click', function(e) {
            if (e.target === photosModal) {
                closeModal(photosModal);
            }
        });
    }

    if (videosModal && closeVideosModal) {
        // Fechar modal de vídeos
        closeVideosModal.addEventListener('click', function() {
            closeModal(videosModal);
        });

        // Fechar ao clicar fora do conteúdo
        videosModal.addEventListener('click', function(e) {
            if (e.target === videosModal) {
                closeModal(videosModal);
            }
        });
    }

    // Fechar modais com a tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (photosModal.classList.contains('open')) {
                closeModal(photosModal);
            }
            if (videosModal.classList.contains('open')) {
                closeModal(videosModal);
            }
        }
    });

    // Gerenciamento de edição de descrições
    initializeCaptionEditing();
});

// Função para animar elementos quando visíveis na tela
function animateOnScroll() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const screenHeight = window.innerHeight;
        
        if (sectionTop < screenHeight * 0.8) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }
    });
    
    // Aplicar estilos iniciais para os elementos que ainda não foram vistos
    document.querySelectorAll('section:not([style])').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
}

// Função para criar corações flutuantes aleatórios
function createRandomHearts() {
    const heartContainer = document.querySelector('.floating-hearts');
    const heartEmojis = ['❤️', '💕', '💖', '💘', '💓', '💗'];
    
    // Criar 15 corações aleatórios
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart random';
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        
        // Posição aleatória
        heart.style.left = Math.random() * 100 + '%';
        
        // Tamanho aleatório
        const size = 0.5 + Math.random() * 1.5;
        heart.style.fontSize = size + 'rem';
        
        // Animação aleatória
        heart.style.animationDuration = 8 + Math.random() * 10 + 's';
        heart.style.animationDelay = Math.random() * 5 + 's';
        
        heartContainer.appendChild(heart);
    }
}

// Função para mostrar mensagem de amor aleatória
function showLoveMessage() {
    const loveMessages = [
        "Sua mensagem faz meu dia mais feliz! ❤️",
        "A distância é só um detalhe quando o amor é verdadeiro! 💓",
        "Você está a um clique, mas dentro do meu coração! 🎁",
        "Cada conversa com você é especial! 💕",
        "Sonho com o dia em que vou te ver pessoalmente! ✨",
        "Suas palavras transformam meu dia! 💖",
        "A internet nos uniu por um motivo especial! 🙏",
        "Você ilumina minha tela e minha vida! ☀️",
        "Apaixonado pelo seu jeito de ser, mesmo à distância! 💘",
        "Meu coração viaja bits e bytes para encontrar o seu! 💗"
    ];
    
    // Escolher uma mensagem aleatória
    const randomMessage = loveMessages[Math.floor(Math.random() * loveMessages.length)];
    
    // Criar elemento para a mensagem
    const messageElement = document.createElement('div');
    messageElement.className = 'surprise-message';
    messageElement.textContent = randomMessage;
    messageElement.style.position = 'fixed';
    messageElement.style.top = '50%';
    messageElement.style.left = '50%';
    messageElement.style.transform = 'translate(-50%, -50%)';
    messageElement.style.background = 'rgba(255, 77, 145, 0.9)';
    messageElement.style.color = 'white';
    messageElement.style.padding = '20px 30px';
    messageElement.style.borderRadius = '15px';
    messageElement.style.boxShadow = '0 5px 30px rgba(0,0,0,0.2)';
    messageElement.style.zIndex = '1000';
    messageElement.style.fontFamily = "'Dancing Script', cursive";
    messageElement.style.fontSize = '1.5rem';
    messageElement.style.textAlign = 'center';
    messageElement.style.animation = 'fadeIn 0.5s forwards';
    
    // Adicionar a mensagem ao corpo do documento
    document.body.appendChild(messageElement);
    
    // Remover após alguns segundos
    setTimeout(() => {
        messageElement.style.animation = 'fadeOut 0.5s forwards';
        setTimeout(() => {
            document.body.removeChild(messageElement);
        }, 500);
    }, 3000);
}

// Função para adicionar efeito de batimento ao passar o mouse
function playHeartbeat(element) {
    element.style.animation = 'cardHeartbeat 0.5s';
    
    // Remover a animação após terminar
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

// Adicionar estilos de animação ao documento
const styleElement = document.createElement('style');
styleElement.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        to { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
    
    @keyframes cardHeartbeat {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .floating-heart.random {
        position: absolute;
        animation-name: floatRandom;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite;
    }
    
    @keyframes floatRandom {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 0.8;
        }
        90% {
            opacity: 0.8;
        }
        100% {
            transform: translateY(-100px) rotate(20deg);
            opacity: 0;
        }
    }
`;

document.head.appendChild(styleElement);

// Função para formatar a data completa
function formatFullDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Função para salvar memória no Firebase
function saveMemory() {
    const memoryText = document.getElementById('new-memory').value.trim();
    if (!memoryText) return;
    db.collection('memories').add({
        text: memoryText,
        date: new Date().toISOString(),
        author: currentUser.name
    }).then(() => {
        document.getElementById('new-memory').value = '';
    });
}

// Função para exibir memórias em tempo real
function displayMemoriesRealtime() {
    db.collection('memories').orderBy('date', 'desc').onSnapshot(snapshot => {
        const memoriesList = document.getElementById('memories-list');
        if (snapshot.empty) {
            memoriesList.innerHTML = `<div class="no-memories"><p>Nenhuma memória ainda. Seja o primeiro a adicionar uma memória especial! 💝</p></div>`;
            return;
        }
        memoriesList.innerHTML = '';
        snapshot.forEach(doc => {
            const memory = doc.data();
            memoriesList.innerHTML += `
                <div class="memory-item">
                    ${memory.text}
                    <div class="memory-meta">${formatFullDate(memory.date)} | Adicionado por ${memory.author}</div>
                </div>
            `;
        });
    });
}

// Cole aqui suas credenciais do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCcuzO6BAWGveGf5M0e8rd6OWl0rnA8gyk",
    authDomain: "minha-linda-bba48.firebaseapp.com",
    projectId: "minha-linda-bba48",
    storageBucket: "minha-linda-bba48.firebasestorage.app",
    messagingSenderId: "675623347892",
    appId: "1:675623347892:web:3cda3f26b113ca4e64d9e1",
    measurementId: "G-VLRDPKHL7E"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Estilos para os cartões de memória
const memoryItemStyles = document.createElement('style');
memoryItemStyles.textContent = `
    .memory-item {
        background: #fff;
        border-radius: 12px;
        margin: 0 auto 18px auto;
        padding: 18px 20px 10px 20px;
        font-family: 'Dancing Script', cursive;
        font-size: 1.3rem;
        color: #5a5a5a;
        box-shadow: 0 2px 8px rgba(255, 77, 145, 0.07);
        max-width: 600px;
        border: 1.5px solid #ffe0ef;
        text-align: center;
        transition: box-shadow 0.2s;
    }
    .memory-item:hover {
        box-shadow: 0 6px 24px rgba(255, 77, 145, 0.13);
    }
    .memory-meta {
        margin-top: 10px;
        font-size: 0.95em;
        color: #ff4d91;
        opacity: 0.85;
        font-family: 'Montserrat', sans-serif;
        text-align: center;
    }
`;
document.head.appendChild(memoryItemStyles);

// Check if user is logged in
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'login.html';
        return null;
    }
    return JSON.parse(currentUser);
}

// Get current user
const currentUser = checkAuth();

// Add logout button to the page
function addLogoutButton() {
    const header = document.querySelector('header');
    if (header && currentUser) {
        const logoutButton = document.createElement('button');
        logoutButton.className = 'logout-button';
        logoutButton.innerHTML = `Sair (${currentUser.name})`;
        logoutButton.onclick = function() {
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        };
        header.appendChild(logoutButton);
    }
}

// Add logout button styles
const style = document.createElement('style');
style.textContent = `
    .logout-button {
        position: absolute;
        top: 20px;
        right: 20px;
        background: #ff4d91;
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 0.9em;
    }
    .logout-button:hover {
        background: #ff3377;
    }
`;
document.head.appendChild(style);

// Add logout button if user is logged in
if (currentUser) {
    addLogoutButton();
}

// Função para mostrar mensagem de sucesso
function showSuccessMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'success-message';
    messageElement.textContent = message;
    messageElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff4d91;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        font-family: 'Montserrat', sans-serif;
        box-shadow: 0 4px 15px rgba(255, 77, 145, 0.2);
        z-index: 1000;
        animation: slideIn 0.5s ease-out;
    `;
    
    document.body.appendChild(messageElement);
    
    setTimeout(() => {
        messageElement.style.animation = 'slideOut 0.5s ease-in forwards';
        setTimeout(() => {
            document.body.removeChild(messageElement);
        }, 500);
    }, 3000);
}

// Animações para mensagens
const animationStyle = document.createElement('style');
animationStyle.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(animationStyle);

// Gerenciamento de edição de descrições
function initializeCaptionEditing() {
    // Coleção no Firebase para as descrições
    const captionsRef = db.collection('mediaCaptions');

    // Função para carregar descrições do Firebase
    function loadCaptions() {
        captionsRef.get().then((snapshot) => {
            snapshot.forEach((doc) => {
                const data = doc.data();
                const element = document.querySelector(`[data-id="${doc.id}"] .caption-text`);
                if (element) {
                    element.textContent = data.caption;
                    // Atualizar também o valor do input
                    const input = element.parentElement.querySelector('.caption-input');
                    if (input) {
                        input.value = data.caption;
                    }
                }
            });
        });
    }

    // Carregar descrições ao iniciar
    loadCaptions();

    // Adicionar listeners para todos os botões de edição
    document.querySelectorAll('.edit-caption-btn').forEach(button => {
        button.addEventListener('click', function() {
            const mediaItem = this.closest('.media-caption');
            const captionText = mediaItem.querySelector('.caption-text');
            const editForm = mediaItem.querySelector('.edit-caption-form');
            
            // Esconder texto e mostrar formulário
            captionText.style.display = 'none';
            editForm.style.display = 'block';
            editForm.classList.add('show');
            
            // Focar no input
            const input = editForm.querySelector('.caption-input');
            input.focus();
            input.select();
        });
    });

    // Adicionar listeners para botões de salvar
    document.querySelectorAll('.save-caption-btn').forEach(button => {
        button.addEventListener('click', function() {
            const mediaItem = this.closest('.media-caption');
            const mediaContainer = mediaItem.closest('.photo-item, .video-item');
            const mediaId = mediaContainer.dataset.id;
            const input = mediaItem.querySelector('.caption-input');
            const captionText = mediaItem.querySelector('.caption-text');
            const editForm = mediaItem.querySelector('.edit-caption-form');
            
            const newCaption = input.value.trim();
            if (newCaption) {
                // Salvar no Firebase
                captionsRef.doc(mediaId).set({
                    caption: newCaption,
                    updatedBy: currentUser.name,
                    updatedAt: new Date().toISOString()
                }).then(() => {
                    // Atualizar texto na interface
                    captionText.textContent = newCaption;
                    captionText.style.display = 'inline-block';
                    editForm.style.display = 'none';
                    editForm.classList.remove('show');
                    
                    // Mostrar mensagem de sucesso
                    showSuccessMessage('Descrição atualizada com sucesso! 💖');
                }).catch(error => {
                    console.error('Erro ao salvar descrição:', error);
                    showSuccessMessage('Erro ao salvar descrição. Tente novamente.');
                });
            }
        });
    });

    // Adicionar listeners para botões de cancelar
    document.querySelectorAll('.cancel-caption-btn').forEach(button => {
        button.addEventListener('click', function() {
            const mediaItem = this.closest('.media-caption');
            const captionText = mediaItem.querySelector('.caption-text');
            const editForm = mediaItem.querySelector('.edit-caption-form');
            const input = editForm.querySelector('.caption-input');
            
            // Restaurar valor original
            input.value = captionText.textContent;
            
            // Esconder formulário e mostrar texto
            captionText.style.display = 'inline-block';
            editForm.style.display = 'none';
            editForm.classList.remove('show');
        });
    });

    // Salvar ao pressionar Enter no input
    document.querySelectorAll('.caption-input').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.closest('.edit-caption-form').querySelector('.save-caption-btn').click();
            }
        });
    });
} 