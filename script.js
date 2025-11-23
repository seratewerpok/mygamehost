// Элементы страниц
const mainPage = document.getElementById('mainPage');
const authPage = document.getElementById('authPage');
const registerPage = document.getElementById('registerPage');
const homeLink = document.getElementById('homeLink');
const loginLink = document.getElementById('loginLink');
const createServerBtn = document.getElementById('createServerBtn');
const heroCreateBtn = document.getElementById('heroCreateBtn');
const showRegisterLink = document.getElementById('showRegisterLink');
const showLoginLink = document.getElementById('showLoginLink');

// Формы и кнопки
const authForm = document.getElementById('authForm');
const registerForm = document.getElementById('registerForm');
const authSubmit = document.getElementById('authSubmit');
const registerSubmit = document.getElementById('registerSubmit');

// Переменные для reCAPTCHA
let authRecaptchaVerified = false;
let registerRecaptchaVerified = false;

// Показать главную страницу
function showMainPage() {
    mainPage.style.display = 'block';
    authPage.style.display = 'none';
    registerPage.style.display = 'none';
    document.title = 'Gamely - Бесплатный игровой хостинг';
}

// Показать страницу авторизации
function showAuthPage() {
    mainPage.style.display = 'none';
    authPage.style.display = 'block';
    registerPage.style.display = 'none';
    document.title = 'Авторизация - Gamely';
    resetAuthRecaptcha();
}

// Показать страницу регистрации
function showRegisterPage() {
    mainPage.style.display = 'none';
    authPage.style.display = 'none';
    registerPage.style.display = 'block';
    document.title = 'Регистрация - Gamely';
    resetRegisterRecaptcha();
}

// Обработчики навигации
homeLink.addEventListener('click', function(e) {
    e.preventDefault();
    showMainPage();
});

loginLink.addEventListener('click', function(e) {
    e.preventDefault();
    showAuthPage();
});

createServerBtn.addEventListener('click', function(e) {
    e.preventDefault();
    showAuthPage();
});

heroCreateBtn.addEventListener('click', function(e) {
    e.preventDefault();
    showAuthPage();
});

// Переключение между авторизацией и регистрацией
showRegisterLink.addEventListener('click', function(e) {
    e.preventDefault();
    showRegisterPage();
});

showLoginLink.addEventListener('click', function(e) {
    e.preventDefault();
    showAuthPage();
});

// reCAPTCHA callback функции для авторизации
function onRecaptchaSuccess(response) {
    console.log('reCAPTCHA авторизации пройдена:', response);
    authRecaptchaVerified = true;
    enableAuthSubmit();
}

function onRecaptchaExpired() {
    console.log('reCAPTCHA авторизации истекла');
    authRecaptchaVerified = false;
    disableAuthSubmit();
    if (typeof grecaptcha !== 'undefined') {
        grecaptcha.reset();
    }
}

// reCAPTCHA callback функции для регистрации
function onRegisterRecaptchaSuccess(response) {
    console.log('reCAPTCHA регистрации пройдена:', response);
    registerRecaptchaVerified = true;
    enableRegisterSubmit();
}

function onRegisterRecaptchaExpired() {
    console.log('reCAPTCHA регистрации истекла');
    registerRecaptchaVerified = false;
    disableRegisterSubmit();
    if (typeof grecaptcha !== 'undefined') {
        grecaptcha.reset();
    }
}

// Управление кнопками авторизации
function enableAuthSubmit() {
    authSubmit.disabled = false;
    authSubmit.style.opacity = '1';
    authSubmit.style.cursor = 'pointer';
}

function disableAuthSubmit() {
    authSubmit.disabled = true;
    authSubmit.style.opacity = '0.6';
    authSubmit.style.cursor = 'not-allowed';
}

// Управление кнопками регистрации
function enableRegisterSubmit() {
    registerSubmit.disabled = false;
    registerSubmit.style.opacity = '1';
    registerSubmit.style.cursor = 'pointer';
}

function disableRegisterSubmit() {
    registerSubmit.disabled = true;
    registerSubmit.style.opacity = '0.6';
    registerSubmit.style.cursor = 'not-allowed';
}

// Сброс reCAPTCHA
function resetAuthRecaptcha() {
    if (typeof grecaptcha !== 'undefined') {
        grecaptcha.reset();
    }
    authRecaptchaVerified = false;
    disableAuthSubmit();
}

function resetRegisterRecaptcha() {
    if (typeof grecaptcha !== 'undefined') {
        grecaptcha.reset();
    }
    registerRecaptchaVerified = false;
    disableRegisterSubmit();
}

// Обработка формы авторизации
authForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!authRecaptchaVerified) {
        alert('Пожалуйста, пройдите проверку "Я не робот"');
        return;
    }
    
    authSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Вход...';
    authSubmit.disabled = true;
    
    setTimeout(() => {
        alert('Авторизация успешна!');
        showMainPage();
        authForm.reset();
        resetAuthRecaptcha();
        authSubmit.innerHTML = '<i class="fas fa-sign-in-alt"></i> Войти';
    }, 1500);
});

// Обработка формы регистрации
registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!registerRecaptchaVerified) {
        alert('Пожалуйста, пройдите проверку "Я не робот"');
        return;
    }
    
    const password = registerForm.querySelector('input[type="password"]').value;
    const confirmPassword = registerForm.querySelectorAll('input[type="password"]')[1].value;
    
    if (password !== confirmPassword) {
        alert('Пароли не совпадают!');
        return;
    }
    
    registerSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Регистрация...';
    registerSubmit.disabled = true;
    
    setTimeout(() => {
        alert('Регистрация успешна! Добро пожаловать в Gamely!');
        showMainPage();
        registerForm.reset();
        resetRegisterRecaptcha();
        registerSubmit.innerHTML = '<i class="fas fa-user-plus"></i> Зарегистрироваться';
    }, 1500);
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

// Запускаем частицы после загрузки
window.addEventListener('load', createParticles);

// Показываем главную страницу по умолчанию
showMainPage();