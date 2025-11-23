// Элементы страниц
const mainPage = document.getElementById('mainPage');
const authPage = document.getElementById('authPage');
const registerPage = document.getElementById('registerPage');
const dashboardPage = document.getElementById('dashboardPage');
const homeLink = document.getElementById('homeLink');
const loginLink = document.getElementById('loginLink');
const createServerBtn = document.getElementById('createServerBtn');
const heroCreateBtn = document.getElementById('heroCreateBtn');
const showRegisterLink = document.getElementById('showRegisterLink');
const showLoginLink = document.getElementById('showLoginLink');
const logoutLink = document.getElementById('logoutLink');
const userMenuBtn = document.getElementById('userMenuBtn');
const dashboardLink = document.getElementById('dashboardLink');
const dashboardHomeLink = document.getElementById('dashboardHomeLink');
const dashboardLogoutBtn = document.getElementById('dashboardLogoutBtn');
const createServerDashboardBtn = document.getElementById('createServerDashboardBtn');
const depositBtn = document.getElementById('depositBtn');

// Навигационные блоки
const guestNav = document.getElementById('guestNav');
const userNav = document.getElementById('userNav');
const usernameSpan = document.getElementById('username');

// Элементы панели управления
const infoId = document.getElementById('infoId');
const infoLogin = document.getElementById('infoLogin');
const infoEmail = document.getElementById('infoEmail');
const infoRole = document.getElementById('infoRole');
const infoBalance = document.getElementById('infoBalance');
const infoRegDate = document.getElementById('infoRegDate');
const infoDiscord = document.getElementById('infoDiscord');
const serversCount = document.getElementById('serversCount');

// Формы и поля ввода
const authForm = document.getElementById('authForm');
const registerForm = document.getElementById('registerForm');
const authLogin = document.getElementById('authLogin');
const authPassword = document.getElementById('authPassword');
const regEmail = document.getElementById('regEmail');
const regLogin = document.getElementById('regLogin');
const regPassword = document.getElementById('regPassword');
const regConfirmPassword = document.getElementById('regConfirmPassword');

// Сообщения об ошибках
const emailError = document.getElementById('emailError');
const loginError = document.getElementById('loginError');
const passwordError = document.getElementById('passwordError');

// Инициализация базы данных пользователей
function initUsersDatabase() {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }
}

// Проверка существования email
function isEmailExists(email) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.some(user => user.email === email);
}

// Проверка существования логина
function isLoginExists(login) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.some(user => user.login === login);
}

// Генерация ID пользователя
function generateUserId() {
    return Math.floor(10000 + Math.random() * 90000).toString();
}

// Генерация Discord ID
function generateDiscordId() {
    return Math.floor(100000000000000000 + Math.random() * 900000000000000000).toString();
}

// Проверка авторизации при загрузке
function checkAuth() {
    initUsersDatabase();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (currentUser) {
        showUserNav(currentUser.login);
        updateDashboardInfo(currentUser);
    } else {
        showGuestNav();
    }
}

// Показать навигацию для гостя
function showGuestNav() {
    guestNav.style.display = 'flex';
    userNav.style.display = 'none';
}

// Показать навигацию для пользователя
function showUserNav(username) {
    guestNav.style.display = 'none';
    userNav.style.display = 'flex';
    usernameSpan.textContent = username;
}

// Обновить информацию в панели управления
function updateDashboardInfo(user) {
    infoId.textContent = user.id || '---';
    infoLogin.textContent = user.login || '---';
    infoEmail.textContent = user.email || '---';
    infoRole.textContent = user.role || 'Пользователь';
    infoBalance.textContent = (user.balance || 0) + ' руб.';
    infoRegDate.textContent = user.registrationDate || new Date().toLocaleString();
    infoDiscord.textContent = user.discordId || 'Не привязан';
    
    // Обновляем счетчик серверов
    const userServers = JSON.parse(localStorage.getItem('userServers') || '[]');
    serversCount.textContent = userServers.length;
}

// Регистрация пользователя
function registerUser(login, email, password) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const newUser = {
        id: generateUserId(),
        login: login,
        email: email,
        password: password,
        role: 'Пользователь',
        balance: 0,
        registrationDate: new Date().toLocaleString(),
        discordId: generateDiscordId(),
        referralCode: 'REF' + generateUserId()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    return newUser;
}

// Авторизация пользователя
function loginUser(login, password) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => 
        (u.email === login || u.login === login) && u.password === password
    );
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
    }
    return null;
}

// Выход пользователя
function logoutUser() {
    localStorage.removeItem('currentUser');
    showGuestNav();
    showMainPage();
}

// Показать главную страницу
function showMainPage() {
    mainPage.style.display = 'block';
    authPage.style.display = 'none';
    registerPage.style.display = 'none';
    dashboardPage.style.display = 'none';
    document.title = 'Gamely - Бесплатный игровой хостинг';
}

// Показать страницу авторизации
function showAuthPage() {
    mainPage.style.display = 'none';
    authPage.style.display = 'block';
    registerPage.style.display = 'none';
    dashboardPage.style.display = 'none';
    document.title = 'Авторизация - Gamely';
}

// Показать страницу регистрации
function showRegisterPage() {
    mainPage.style.display = 'none';
    authPage.style.display = 'none';
    registerPage.style.display = 'block';
    dashboardPage.style.display = 'none';
    document.title = 'Регистрация - Gamely';
}

// Показать панель управления
function showDashboardPage() {
    mainPage.style.display = 'none';
    authPage.style.display = 'none';
    registerPage.style.display = 'none';
    dashboardPage.style.display = 'block';
    document.title = 'Панель управления - Gamely';
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    updateDashboardInfo(currentUser);
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
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        showDashboardPage();
    } else {
        showAuthPage();
    }
});

heroCreateBtn.addEventListener('click', function(e) {
    e.preventDefault();
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        showDashboardPage();
    } else {
        showAuthPage();
    }
});

dashboardLink.addEventListener('click', function(e) {
    e.preventDefault();
    showDashboardPage();
});

dashboardHomeLink.addEventListener('click', function(e) {
    e.preventDefault();
    showMainPage();
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

// Выход из аккаунта
logoutLink.addEventListener('click', function(e) {
    e.preventDefault();
    logoutUser();
});

dashboardLogoutBtn.addEventListener('click', function(e) {
    e.preventDefault();
    logoutUser();
});

// Валидация формы регистрации
regEmail.addEventListener('blur', function() {
    const email = this.value.trim();
    if (email && isEmailExists(email)) {
        const user = JSON.parse(localStorage.getItem('users') || '[]').find(u => u.email === email);
        emailError.textContent = `Эта почта зарегистрирована с логином: ${user.login}`;
        emailError.style.display = 'block';
    } else {
        emailError.style.display = 'none';
    }
});

regLogin.addEventListener('blur', function() {
    const login = this.value.trim();
    if (login && isLoginExists(login)) {
        loginError.textContent = 'Этот логин занят';
        loginError.style.display = 'block';
    } else {
        loginError.style.display = 'none';
    }
});

regConfirmPassword.addEventListener('blur', function() {
    const password = regPassword.value;
    const confirmPassword = this.value;
    if (password !== confirmPassword) {
        passwordError.textContent = 'Пароли не совпадают';
        passwordError.style.display = 'block';
    } else {
        passwordError.style.display = 'none';
    }
});

// Обработка формы авторизации
authForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const login = authLogin.value.trim();
    const password = authPassword.value;
    
    const submitBtn = this.querySelector('.auth-submit');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Вход...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        const user = loginUser(login, password);
        if (user) {
            showUserNav(user.login);
            showMainPage();
        } else {
            alert('Неверный логин или пароль!');
        }
        
        authForm.reset();
        submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Войти';
        submitBtn.disabled = false;
    }, 1500);
});

// Обработка формы регистрации
registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = regEmail.value.trim();
    const login = regLogin.value.trim();
    const password = regPassword.value;
    const confirmPassword = regConfirmPassword.value;
    
    // Проверки
    if (isEmailExists(email)) {
        emailError.textContent = `Эта почта зарегистрирована с логином: ${JSON.parse(localStorage.getItem('users') || '[]').find(u => u.email === email).login}`;
        emailError.style.display = 'block';
        return;
    }
    
    if (isLoginExists(login)) {
        loginError.textContent = 'Этот логин занят';
        loginError.style.display = 'block';
        return;
    }
    
    if (password !== confirmPassword) {
        passwordError.textContent = 'Пароли не совпадают';
        passwordError.style.display = 'block';
        return;
    }
    
    const submitBtn = this.querySelector('.auth-submit');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Регистрация...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        const newUser = registerUser(login, email, password);
        showUserNav(newUser.login);
        showMainPage();
        registerForm.reset();
        submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Зарегистрироваться';
        submitBtn.disabled = false;
    }, 1500);
});

// Действия в панели управления
depositBtn.addEventListener('click', function() {
    alert('Переход к пополнению баланса...');
});

createServerDashboardBtn.addEventListener('click', function() {
    alert('Переход к созданию сервера...');
});

// Плавное появление элементов при загрузке
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'all 0.8s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }
    
    // Анимация появления карточек преимуществ
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = `all 0.6s ease ${index * 0.1}s`;
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 500 + index * 100);
    });
    
    // Анимация появления отзывов
    const reviewCards = document.querySelectorAll('.review-card');
    reviewCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = `all 0.6s ease ${index * 0.1}s`;
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 800 + index * 100);
    });
});

// Добавляем эффект частиц для фона
function createParticles() {
    const heroBanner = document.querySelector('.hero-banner');
    if (!heroBanner) return;
    
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;
    
    heroBanner.appendChild(particlesContainer);
    
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