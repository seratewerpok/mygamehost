// Элементы модальных окон
const authModal = document.getElementById('authModal');
const registerModal = document.getElementById('registerModal');
const loginBtn = document.getElementById('loginBtn');
const createServerBtn = document.getElementById('createServerBtn');
const heroCreateBtn = document.getElementById('heroCreateBtn');
const closeBtn = document.querySelector('.close');
const closeRegisterBtn = document.querySelector('.close-register');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');

// Функция открытия модального окна авторизации
function openAuthModal() {
    authModal.style.display = 'block';
    registerModal.style.display = 'none';
}

// Функция открытия модального окна регистрации
function openRegisterModal() {
    registerModal.style.display = 'block';
    authModal.style.display = 'none';
}

// Функция закрытия всех модальных окон
function closeAllModals() {
    authModal.style.display = 'none';
    registerModal.style.display = 'none';
}

// Обработчики событий для кнопок авторизации
loginBtn.addEventListener('click', function(e) {
    e.preventDefault();
    openAuthModal();
});

createServerBtn.addEventListener('click', function(e) {
    e.preventDefault();
    openAuthModal();
});

heroCreateBtn.addEventListener('click', function(e) {
    e.preventDefault();
    openAuthModal();
});

// Переключение между окнами авторизации и регистрации
showRegister.addEventListener('click', function(e) {
    e.preventDefault();
    openRegisterModal();
});

showLogin.addEventListener('click', function(e) {
    e.preventDefault();
    openAuthModal();
});

// Закрытие модальных окон
closeBtn.addEventListener('click', closeAllModals);
closeRegisterBtn.addEventListener('click', closeAllModals);

// Закрытие при клике вне окна
window.addEventListener('click', function(e) {
    if (e.target === authModal || e.target === registerModal) {
        closeAllModals();
    }
});

// Проверка на бота и обработка формы авторизации
document.getElementById('authForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const botAnswer = document.getElementById('botAnswer').value;
    
    // Проверка ответа на вопрос (2 + 2 = 4)
    if (parseInt(botAnswer) !== 4) {
        alert('Ошибка: Неверный ответ на проверочный вопрос!');
        return;
    }
    
    // Если проверка пройдена
    alert('Авторизация успешна! В реальном приложении здесь будет отправка данных на сервер');
    closeAllModals();
    
    // Очистка формы
    this.reset();
});

// Проверка на бота и обработка формы регистрации
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const botAnswer = document.getElementById('registerBotAnswer').value;
    
    // Проверка ответа на вопрос (7 + 3 = 10)
    if (parseInt(botAnswer) !== 10) {
        alert('Ошибка: Неверный ответ на проверочный вопрос!');
        return;
    }
    
    // Если проверка пройдена
    alert('Регистрация успешна! В реальном приложении здесь будет отправка данных на сервер');
    closeAllModals();
    
    // Очистка формы
    this.reset();
});

// Плавное появление элементов при загрузке
document.addEventListener('DOMContentLoaded', function() {
    const heroContent = document.querySelector('.hero-content');
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        heroContent.style.transition = 'all 0.8s ease';
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }, 300);
});

// Добавляем эффект частиц для фона
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;
    
    document.querySelector('.hero-banner').appendChild(particlesContainer);
    
    // Создаем несколько частиц
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: #8b5ceb;
            border-radius: 50%;
            animation: float 6s ease-in-out infinite;
            animation-delay: ${Math.random() * 6}s;
        `;
        
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        particlesContainer.appendChild(particle);
    }
}

// Добавляем CSS для анимации частиц
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
        50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
    }
`;
document.head.appendChild(style);

// Запускаем частицы после загрузки
window.addEventListener('load', createParticles);