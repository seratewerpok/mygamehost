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
    
    // Обновляем счетчик серверов
    const userServers = JSON.parse(localStorage.getItem('userServers') || '[]');
    serversCount.textContent = userServers.length;
}

// Регистрация пользователя
async function registerUser(login, email, password) {
    const newUser = {
        id: generateUserId(),
        login: login,
        email: email.toLowerCase(),
        password: password,
        role: 'Пользователь',
        balance: 0,
        registrationDate: new Date().toLocaleString()
    };
    
    try {
        // Сохраняем в Firebase
        await db.collection('users').doc(newUser.id).set(newUser);
        
        // Сохраняем в localStorage для авторизации
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
        
        return newUser;
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        throw new Error('Ошибка при создании пользователя');
    }
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
    
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || '{}');
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
    const currentUser = localStorage.getItem(CURRENT_USER_KEY);
    if (currentUser) {
        showDashboardPage();
    } else {
        showAuthPage();
    }
});

heroCreateBtn.addEventListener('click', function(e) {
    e.preventDefault();
    const currentUser = localStorage.getItem(CURRENT_USER_KEY);
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
        alert('Заполните все поля!');
        return;
    }
    
    const submitBtn = this.querySelector('.auth-submit');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Вход...';
    submitBtn.disabled = true;
    
    try {
        const user = await loginUser(login, password);
        if (user) {
            showUserNav(user.login);
            showMainPage();
            alert(`Добро пожаловать, ${user.login}!`);
        } else {
            alert('Неверный логин/email или пароль! Попробуйте:\nЛогин: demo\nПароль: 123456');
        }
    } catch (error) {
        alert('Ошибка авторизации: ' + error.message);
    }
    
    authForm.reset();
    submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Войти';
    submitBtn.disabled = false;
});

// Обработка формы регистрации
registerForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = regEmail.value.trim();
    const login = regLogin.value.trim();
    const password = regPassword.value;
    const confirmPassword = regConfirmPassword.value;
    
    // Проверки заполненности
    if (!email || !login || !password || !confirmPassword) {
        alert('Заполните все поля!');
        return;
    }
    
    const submitBtn = this.querySelector('.auth-submit');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Проверка...';
    submitBtn.disabled = true;
    
    try {
        // Проверка email
        if (await isEmailExists(email)) {
            const user = await getUserByEmail(email);
            emailError.textContent = `Эта почта зарегистрирована с логином: ${user.login}`;
            emailError.style.display = 'block';
            submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Зарегистрироваться';
            submitBtn.disabled = false;
            return;
        }
        
        // Проверка логина
        if (await isLoginExists(login)) {
            loginError.textContent = 'Этот логин занят';
            loginError.style.display = 'block';
            submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Зарегистрироваться';
            submitBtn.disabled = false;
            return;
        }
        
        // Проверка паролей
        if (password !== confirmPassword) {
            passwordError.textContent = 'Пароли не совпадают';
            passwordError.style.display = 'block';
            submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Зарегистрироваться';
            submitBtn.disabled = false;
            return;
        }
        
        // Проверка длины пароля
        if (password.length < 6) {
            passwordError.textContent = 'Пароль должен содержать минимум 6 символов';
            passwordError.style.display = 'block';
            submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Зарегистрироваться';
            submitBtn.disabled = false;
            return;
        }
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Регистрация...';
        
        const newUser = await registerUser(login, email, password);
        showUserNav(newUser.login);
        showMainPage();
        registerForm.reset();
        alert(`Регистрация успешна! Добро пожаловать, ${newUser.login}!`);
        
    } catch (error) {
        alert('Ошибка регистрации: ' + error.message);
    }
    
    submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Зарегистрироваться';
    submitBtn.disabled = false;
});

// Действия в панели управления
depositBtn.addEventListener('click', function() {
    alert('Переход к пополнению баланса...');
});

createServerDashboardBtn.addEventListener('click', function() {
    alert('Переход к созданию сервера...');
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