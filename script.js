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

// Firebase конфигурация
const firebaseConfig = {
    apiKey: "AIzaSyCTc_NZlYVmxD2optGVRfZz7W-Y9ZvJRJM",
    authDomain: "gamehosting-ad7bf.firebaseapp.com",
    projectId: "gamehosting-ad7bf",
    storageBucket: "gamehosting-ad7bf.firebasestorage.app",
    messagingSenderId: "896049563682",
    appId: "1:896049563682:web:e73597ef00bbe1bebe227b"
};

// Инициализация Firebase
try {
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase инициализирован');
} catch (error) {
    console.log('Firebase уже инициализирован');
}

const db = firebase.firestore();

// Ключи для localStorage
const CURRENT_USER_KEY = 'gamely_current_user';

// Демо-пользователь
const DEMO_USER = {
    id: '98977',
    login: 'demo',
    email: 'demo@example.com',
    password: '123456',
    role: 'Пользователь',
    balance: 0,
    registrationDate: '18.11.2023 22:40:54'
};

// Состояние приложения
let currentPage = 'main';

// Система уведомлений
function showNotification(type, title, message, duration = 5000) {
    const container = document.getElementById('notificationContainer');
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let icon = 'fa-info-circle';
    switch(type) {
        case 'success': icon = 'fa-check-circle'; break;
        case 'error': icon = 'fa-exclamation-circle'; break;
        case 'warning': icon = 'fa-exclamation-triangle'; break;
        case 'info': icon = 'fa-info-circle'; break;
    }
    
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-header">
                <div class="notification-title">
                    <i class="fas ${icon}"></i>
                    ${title}
                </div>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="notification-message">${message}</div>
        </div>
    `;
    
    container.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Закрытие по кнопке
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Автоматическое закрытие
    if (duration > 0) {
        setTimeout(() => {
            if (notification.parentNode) {
                closeNotification(notification);
            }
        }, duration);
    }
    
    return notification;
}

function closeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Функция для создания кнопки показа пароля
function createPasswordToggle(inputId) {
    const input = document.getElementById(inputId);
    const container = document.createElement('div');
    container.className = 'password-input-container';
    
    // Обертываем input в контейнер
    input.parentNode.insertBefore(container, input);
    container.appendChild(input);
    
    // Создаем кнопку показа/скрытия пароля
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'toggle-password';
    toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
    
    toggleBtn.addEventListener('click', function() {
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });
    
    container.appendChild(toggleBtn);
}

// Инициализация базы данных
async function initUsersDatabase() {
    try {
        // Проверяем, есть ли демо-пользователь в базе
        const demoUserDoc = await db.collection('users').doc(DEMO_USER.id).get();
        
        if (!demoUserDoc.exists) {
            // Создаем демо-пользователя
            await db.collection('users').doc(DEMO_USER.id).set(DEMO_USER);
            console.log('Демо-пользователь создан');
        }
    } catch (error) {
        console.error('Ошибка инициализации базы:', error);
    }
}

// Получить пользователя по ID
async function getUserById(userId) {
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        return userDoc.exists ? userDoc.data() : null;
    } catch (error) {
        console.error('Ошибка получения пользователя:', error);
        return null;
    }
}

// Получить пользователя по email
async function getUserByEmail(email) {
    try {
        const snapshot = await db.collection('users')
            .where('email', '==', email.toLowerCase())
            .limit(1)
            .get();
        
        return snapshot.empty ? null : snapshot.docs[0].data();
    } catch (error) {
        console.error('Ошибка поиска по email:', error);
        return null;
    }
}

// Получить пользователя по логину
async function getUserByLogin(login) {
    try {
        const snapshot = await db.collection('users')
            .where('login', '==', login.toLowerCase())
            .limit(1)
            .get();
        
        return snapshot.empty ? null : snapshot.docs[0].data();
    } catch (error) {
        console.error('Ошибка поиска по логину:', error);
        return null;
    }
}

// Проверка существования email
async function isEmailExists(email) {
    const user = await getUserByEmail(email);
    return user !== null;
}

// Проверка существования логина
async function isLoginExists(login) {
    const user = await getUserByLogin(login);
    return user !== null;
}

// Генерация ID пользователя
function generateUserId() {
    return Math.floor(10000 + Math.random() * 90000).toString();
}

// Проверка авторизации при загрузке
async function checkAuth() {
    await initUsersDatabase();
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null');
    if (currentUser) {
        showUserNav(currentUser.login);
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
    
    // Обновляем счетчик серверов
    const userServers = JSON.parse(localStorage.getItem('userServers') || '[]');
    serversCount.textContent = userServers.length;
}

// Регистрация пользователя - УПРОЩЕННАЯ ВЕРСИЯ
async function registerUser(login, email, password) {
    return new Promise((resolve, reject) => {
        try {
            const newUser = {
                id: generateUserId(),
                login: login,
                email: email.toLowerCase(),
                password: password,
                role: 'Пользователь',
                balance: 0,
                registrationDate: new Date().toLocaleString()
            };
            
            // Сохраняем в Firebase
            db.collection('users').doc(newUser.id).set(newUser)
                .then(() => {
                    // Сохраняем в localStorage для авторизации
                    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
                    resolve(newUser);
                })
                .catch(error => {
                    console.error('Ошибка сохранения в Firebase:', error);
                    reject(new Error('Ошибка при создании пользователя в базе данных'));
                });
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            reject(new Error('Ошибка при создании пользователя'));
        }
    });
}

// Авторизация пользователя
async function loginUser(login, password) {
    try {
        // Ищем по логину
        let user = await getUserByLogin(login);
        
        // Если не нашли по логину, ищем по email
        if (!user) {
            user = await getUserByEmail(login);
        }
        
        // Проверяем пароль
        if (user && user.password === password) {
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
            return user;
        }
        
        return null;
    } catch (error) {
        console.error('Ошибка авторизации:', error);
        return null;
    }
}

// Выход пользователя
function logoutUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
    showGuestNav();
    navigateTo('main');
    showNotification('info', 'Выход', 'Вы успешно вышли из аккаунта');
}

// Функция навигации с History API
function navigateTo(page, addToHistory = true) {
    // Скрываем все страницы
    mainPage.style.display = 'none';
    authPage.style.display = 'none';
    registerPage.style.display = 'none';
    dashboardPage.style.display = 'none';
    
    // Показываем нужную страницу
    switch(page) {
        case 'main':
            mainPage.style.display = 'block';
            document.title = 'Gamely - Бесплатный игровой хостинг';
            break;
        case 'auth':
            authPage.style.display = 'block';
            document.title = 'Авторизация - Gamely';
            break;
        case 'register':
            registerPage.style.display = 'block';
            document.title = 'Регистрация - Gamely';
            break;
        case 'dashboard':
            dashboardPage.style.display = 'block';
            document.title = 'Панель управления - Gamely';
            const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || '{}');
            updateDashboardInfo(currentUser);
            break;
    }
    
    currentPage = page;
    
    // Добавляем в историю браузера
    if (addToHistory) {
        history.pushState({ page: page }, '', `#${page}`);
    }
}

// Обработчик кнопки "Назад"
function handlePopState(event) {
    if (event.state && event.state.page) {
        navigateTo(event.state.page, false);
    } else {
        navigateTo('main', false);
    }
}

// Обработчики навигации
homeLink.addEventListener('click', function(e) {
    e.preventDefault();
    navigateTo('main');
});

loginLink.addEventListener('click', function(e) {
    e.preventDefault();
    navigateTo('auth');
});

createServerBtn.addEventListener('click', function(e) {
    e.preventDefault();
    const currentUser = localStorage.getItem(CURRENT_USER_KEY);
    if (currentUser) {
        navigateTo('dashboard');
    } else {
        navigateTo('auth');
    }
});

heroCreateBtn.addEventListener('click', function(e) {
    e.preventDefault();
    const currentUser = localStorage.getItem(CURRENT_USER_KEY);
    if (currentUser) {
        navigateTo('dashboard');
    } else {
        navigateTo('auth');
    }
});

dashboardLink.addEventListener('click', function(e) {
    e.preventDefault();
    navigateTo('dashboard');
});

dashboardHomeLink.addEventListener('click', function(e) {
    e.preventDefault();
    navigateTo('main');
});

// Переключение между авторизацией и регистрацией
showRegisterLink.addEventListener('click', function(e) {
    e.preventDefault();
    navigateTo('register');
});

showLoginLink.addEventListener('click', function(e) {
    e.preventDefault();
    navigateTo('auth');
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
regEmail.addEventListener('blur', async function() {
    const email = this.value.trim();
    if (email && await isEmailExists(email)) {
        const user = await getUserByEmail(email);
        emailError.textContent = `Эта почта зарегистрирована с логином: ${user.login}`;
        emailError.style.display = 'block';
    } else {
        emailError.style.display = 'none';
    }
});

regLogin.addEventListener('blur', async function() {
    const login = this.value.trim();
    if (login && await isLoginExists(login)) {
        loginError.textContent = 'Этот логин занят';
        loginError.style.display = 'block';
    } else {
        loginError.style.display = 'none';
    }
});

regConfirmPassword.addEventListener('blur', function() {
    const password = regPassword.value;
    const confirmPassword = this.value;
    if (password && confirmPassword && password !== confirmPassword) {
        passwordError.textContent = 'Пароли не совпадают';
        passwordError.style.display = 'block';
    } else {
        passwordError.style.display = 'none';
    }
});

// Обработка формы авторизации
authForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const login = authLogin.value.trim();
    const password = authPassword.value;
    
    if (!login || !password) {
        showNotification('warning', 'Заполните все поля', 'Пожалуйста, введите логин/email и пароль');
        return;
    }
    
    const submitBtn = this.querySelector('.auth-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Вход...';
    submitBtn.disabled = true;
    
    try {
        const user = await loginUser(login, password);
        if (user) {
            showUserNav(user.login);
            navigateTo('main');
            showNotification('success', 'Добро пожаловать!', `Рады видеть вас снова, ${user.login}!`);
        } else {
            showNotification('error', 'Ошибка входа', 'Неверный логин/email или пароль. Проверьте правильность введенных данных.');
        }
    } catch (error) {
        showNotification('error', 'Ошибка авторизации', error.message);
    }
    
    authForm.reset();
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
});

// Обработка формы регистрации - ПОЛНОСТЬЮ ПЕРЕПИСАННАЯ
registerForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = regEmail.value.trim();
    const login = regLogin.value.trim();
    const password = regPassword.value;
    const confirmPassword = regConfirmPassword.value;
    
    // Проверки заполненности
    if (!email || !login || !password || !confirmPassword) {
        showNotification('warning', 'Заполните все поля', 'Пожалуйста, заполните все поля формы');
        return;
    }
    
    const submitBtn = this.querySelector('.auth-submit');
    const originalText = submitBtn.innerHTML;
    
    // Функция для сброса кнопки
    const resetButton = () => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    };
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Проверка...';
    submitBtn.disabled = true;
    
    try {
        // Проверка email
        if (await isEmailExists(email)) {
            const user = await getUserByEmail(email);
            emailError.textContent = `Эта почта зарегистрирована с логином: ${user.login}`;
            emailError.style.display = 'block';
            resetButton();
            showNotification('warning', 'Email уже используется', 'Этот email уже зарегистрирован в системе');
            return;
        }
        
        // Проверка логина
        if (await isLoginExists(login)) {
            loginError.textContent = 'Этот логин занят';
            loginError.style.display = 'block';
            resetButton();
            showNotification('warning', 'Логин занят', 'Этот логин уже используется другим пользователем');
            return;
        }
        
        // Проверка паролей
        if (password !== confirmPassword) {
            passwordError.textContent = 'Пароли не совпадают';
            passwordError.style.display = 'block';
            resetButton();
            showNotification('warning', 'Пароли не совпадают', 'Убедитесь, что пароли в обоих полях одинаковые');
            return;
        }
        
        // Проверка длины пароля
        if (password.length < 6) {
            passwordError.textContent = 'Пароль должен содержать минимум 6 символов';
            passwordError.style.display = 'block';
            resetButton();
            showNotification('warning', 'Слабый пароль', 'Пароль должен содержать минимум 6 символов');
            return;
        }
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Регистрация...';
        
        // Регистрация пользователя с таймаутом
        const registrationPromise = registerUser(login, email, password);
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Таймаут регистрации')), 10000)
        );
        
        const newUser = await Promise.race([registrationPromise, timeoutPromise]);
        
        // УСПЕШНАЯ РЕГИСТРАЦИЯ
        registerForm.reset();
        resetButton();
        
        showUserNav(newUser.login);
        navigateTo('main');
        showNotification('success', 'Регистрация успешна!', `Добро пожаловать в Gamely, ${newUser.login}! Теперь вы можете создать свой первый сервер.`);
        
    } catch (error) {
        // ОШИБКА РЕГИСТРАЦИИ
        console.error('Ошибка регистрации:', error);
        resetButton();
        showNotification('error', 'Ошибка регистрации', error.message || 'Произошла неизвестная ошибка при регистрации');
    }
});

// Действия в панели управления
depositBtn.addEventListener('click', function() {
    showNotification('info', 'Пополнение баланса', 'Функция пополнения баланса скоро будет доступна');
});

createServerDashboardBtn.addEventListener('click', function() {
    showNotification('info', 'Создание сервера', 'Функция создания сервера скоро будет доступна');
});

// Информация для разработчика
function showDevInfo() {
    console.log('=== Gamely Dev Info ===');
    console.log('Демо пользователь:');
    console.log('Логин: demo');
    console.log('Пароль: 123456');
    console.log('Email: demo@example.com');
    console.log('=====================');
}

// Плавное появление элементов при загрузке
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    showDevInfo();
    
    // Инициализация кнопок показа пароля
    createPasswordToggle('authPassword');
    createPasswordToggle('regPassword');
    createPasswordToggle('regConfirmPassword');
    
    // Обработчик кнопки "Назад"
    window.addEventListener('popstate', handlePopState);
    
    // Проверяем hash в URL при загрузке
    const hash = window.location.hash.replace('#', '');
    if (hash && ['main', 'auth', 'register', 'dashboard'].includes(hash)) {
        navigateTo(hash, false);
    } else {
        navigateTo('main', true);
    }
    
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