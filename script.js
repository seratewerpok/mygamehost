// Элементы страниц
const mainPage = document.getElementById('mainPage');
const authPage = document.getElementById('authPage');
const registerPage = document.getElementById('registerPage');
const dashboardPage = document.getElementById('dashboardPage');

// Навигация
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

// Кнопки Google
const googleAuthBtn = document.getElementById('googleAuthBtn');
const googleRegisterBtn = document.getElementById('googleRegisterBtn');

// Навигационные блоки
const guestNav = document.getElementById('guestNav');
const userNav = document.getElementById('userNav');
const usernameSpan = document.getElementById('username');

// Панель управления
const infoId = document.getElementById('infoId');
const infoLogin = document.getElementById('infoLogin');
const infoEmail = document.getElementById('infoEmail');
const infoRole = document.getElementById('infoRole');
const infoBalance = document.getElementById('infoBalance');
const infoRegDate = document.getElementById('infoRegDate');
const serversCount = document.getElementById('serversCount');

// Формы
const authForm = document.getElementById('authForm');
const registerForm = document.getElementById('registerForm');
const authLogin = document.getElementById('authLogin');
const authPassword = document.getElementById('authPassword');
const regEmail = document.getElementById('regEmail');
const regLogin = document.getElementById('regLogin');
const regPassword = document.getElementById('regPassword');
const regConfirmPassword = document.getElementById('regConfirmPassword');

// Ошибки
const emailError = document.getElementById('emailError');
const loginError = document.getElementById('loginError');
const passwordError = document.getElementById('passwordError');

// Firebase
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
const auth = firebase.auth();

// Константы
const CURRENT_USER_KEY = 'gamely_current_user';

const DEMO_USER = {
    id: '98977',
    login: 'demo',
    email: 'demo@example.com',
    password: '123456',
    role: 'Пользователь',
    balance: 0,
    registrationDate: '18.11.2023 22:40:54'
};

// Уведомления
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
        </div>`;
    
    container.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    if (duration > 0) {
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, duration);
    }
}

// Кнопка показа пароля
function createPasswordToggle(inputId) {
    const input = document.getElementById(inputId);
    const container = document.createElement('div');
    container.className = 'password-input-container';
    
    input.parentNode.insertBefore(container, input);
    container.appendChild(input);
    
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

// База данных
async function initUsersDatabase() {
    try {
        const demoUserDoc = await db.collection('users').doc(DEMO_USER.id).get();
        if (!demoUserDoc.exists) {
            await db.collection('users').doc(DEMO_USER.id).set(DEMO_USER);
            console.log('Демо-пользователь создан');
        }
    } catch (error) {
        console.error('Ошибка инициализации базы:', error);
    }
}

// Работа с пользователями
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

async function isEmailExists(email) {
    const user = await getUserByEmail(email);
    return user !== null;
}

async function isLoginExists(login) {
    const user = await getUserByLogin(login);
    return user !== null;
}

function generateUserId() {
    return Math.floor(10000 + Math.random() * 90000).toString();
}

// Авторизация
async function checkAuth() {
    await initUsersDatabase();
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null');
    if (currentUser) {
        showUserNav(currentUser.login);
    } else {
        showGuestNav();
    }
}

function showGuestNav() {
    guestNav.style.display = 'flex';
    userNav.style.display = 'none';
}

function showUserNav(username) {
    guestNav.style.display = 'none';
    userNav.style.display = 'flex';
    usernameSpan.textContent = username;
}

function updateDashboardInfo(user) {
    infoId.textContent = user.id || '---';
    infoLogin.textContent = user.login || '---';
    infoEmail.textContent = user.email || '---';
    infoRole.textContent = user.role || 'Пользователь';
    infoBalance.textContent = (user.balance || 0) + ' руб.';
    infoRegDate.textContent = user.registrationDate || new Date().toLocaleString();
    
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
        registrationDate: new Date().toLocaleString('ru-RU')
    };
    
    try {
        await db.collection('users').doc(newUser.id).set(newUser);
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
        let user = await getUserByLogin(login);
        if (!user) {
            user = await getUserByEmail(login);
        }
        
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

// Вход через Google
async function signInWithGoogle() {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('email');
        provider.addScope('profile');
        
        const result = await auth.signInWithPopup(provider);
        const user = result.user;
        
        console.log('Google user:', user);
        
        // Проверяем, есть ли пользователь в нашей базе
        let existingUser = await getUserByEmail(user.email);
        
        if (!existingUser) {
            // Создаем нового пользователя
            existingUser = {
                id: user.uid, // Используем UID от Google
                login: user.displayName || user.email.split('@')[0],
                email: user.email,
                password: 'google_oauth',
                role: 'Пользователь',
                balance: 0,
                registrationDate: new Date().toLocaleString('ru-RU'),
                displayName: user.displayName,
                photoURL: user.photoURL
            };
            
            await db.collection('users').doc(existingUser.id).set(existingUser);
            console.log('Новый пользователь создан через Google');
        }
        
        // Сохраняем в localStorage
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(existingUser));
        
        return existingUser;
        
    } catch (error) {
        console.error('Ошибка входа через Google:', error);
        
        // Детальные ошибки для отладки
        let errorMessage = 'Не удалось войти через Google';
        
        switch(error.code) {
            case 'auth/popup-blocked':
                errorMessage = 'Всплывающее окно было заблокировано браузером';
                break;
            case 'auth/popup-closed-by-user':
                errorMessage = 'Вы закрыли окно авторизации';
                break;
            case 'auth/network-request-failed':
                errorMessage = 'Проблемы с интернет-соединением';
                break;
            case 'auth/unauthorized-domain':
                errorMessage = 'Домен не авторизован. Проверь настройки Firebase';
                break;
        }
        
        throw new Error(errorMessage);
    }
}

// Выход
function logoutUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
    showGuestNav();
    navigateTo('main');
    showNotification('info', 'Выход', 'Вы успешно вышли из аккаунта');
}

// Навигация
function navigateTo(page, addToHistory = true) {
    mainPage.style.display = 'none';
    authPage.style.display = 'none';
    registerPage.style.display = 'none';
    dashboardPage.style.display = 'none';
    
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
    
    if (addToHistory) {
        history.pushState({ page: page }, '', `#${page}`);
    }
}

// Обработчик назад
function handlePopState(event) {
    if (event.state && event.state.page) {
        navigateTo(event.state.page, false);
    } else {
        navigateTo('main', false);
    }
}

// Навигационные обработчики
homeLink.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('main');
});

loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('auth');
});

showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('register');
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('auth');
});

logoutLink.addEventListener('click', (e) => {
    e.preventDefault();
    logoutUser();
});

dashboardLogoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    logoutUser();
});

dashboardLink.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('dashboard');
});

dashboardHomeLink.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('main');
});

createServerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const currentUser = localStorage.getItem(CURRENT_USER_KEY);
    if (currentUser) {
        navigateTo('dashboard');
    } else {
        navigateTo('auth');
    }
});

heroCreateBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const currentUser = localStorage.getItem(CURRENT_USER_KEY);
    if (currentUser) {
        navigateTo('dashboard');
    } else {
        navigateTo('auth');
    }
});

createServerDashboardBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showNotification('info', 'Создание сервера', 'Функция создания сервера скоро будет доступна');
});

depositBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showNotification('info', 'Пополнение баланса', 'Функция пополнения баланса скоро будет доступна');
});

// Кнопки Google
googleAuthBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const btn = googleAuthBtn;
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Вход через Google...';
    btn.disabled = true;
    
    try {
        const user = await signInWithGoogle();
        showUserNav(user.login);
        navigateTo('main');
        showNotification('success', 'Успешный вход!', `Добро пожаловать, ${user.login}!`);
    } catch (error) {
        console.error('Ошибка:', error);
        showNotification('error', 'Ошибка входа', error.message);
    }
    
    btn.innerHTML = originalText;
    btn.disabled = false;
});

googleRegisterBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const btn = googleRegisterBtn;
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Регистрация через Google...';
    btn.disabled = true;
    
    try {
        const user = await signInWithGoogle();
        showUserNav(user.login);
        navigateTo('main');
        showNotification('success', 'Регистрация успешна!', `Добро пожаловать, ${user.login}!`);
    } catch (error) {
        console.error('Ошибка:', error);
        showNotification('error', 'Ошибка регистрации', error.message);
    }
    
    btn.innerHTML = originalText;
    btn.disabled = false;
});

// Валидация регистрации
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

// Форма регистрации
registerForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = regEmail.value.trim();
    const login = regLogin.value.trim();
    const password = regPassword.value;
    const confirmPassword = regConfirmPassword.value;
    
    if (!email || !login || !password || !confirmPassword) {
        showNotification('warning', 'Заполните все поля', 'Пожалуйста, заполните все поля формы');
        return;
    }
    
    const submitBtn = this.querySelector('.auth-submit');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Регистрация...';
    submitBtn.disabled = true;
    
    try {
        // Быстрые проверки
        if (await isEmailExists(email)) {
            showNotification('warning', 'Email занят', 'Этот email уже используется');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            return;
        }
        
        if (await isLoginExists(login)) {
            showNotification('warning', 'Логин занят', 'Этот логин уже используется');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            return;
        }
        
        if (password !== confirmPassword) {
            showNotification('warning', 'Пароли не совпадают', 'Проверьте правильность ввода пароля');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            return;
        }
        
        if (password.length < 6) {
            showNotification('warning', 'Слабый пароль', 'Пароль должен быть не менее 6 символов');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            return;
        }
        
        // РЕГИСТРАЦИЯ
        const newUser = await registerUser(login, email, password);
        
        // УСПЕХ - сбрасываем форму и переходим
        registerForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // ПОСЛЕ РЕГИСТРАЦИИ ДЕЛАЕМ ТОЧНО ТАК ЖЕ КАК ПОСЛЕ АВТОРИЗАЦИИ
        showUserNav(newUser.login);
        navigateTo('main');
        showNotification('success', 'Регистрация успешна!', `Добро пожаловать, ${newUser.login}!`);
        
    } catch (error) {
        console.error('Ошибка:', error);
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        showNotification('error', 'Ошибка регистрации', 'Произошла ошибка при регистрации');
    }
});

// Форма авторизации
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
            showNotification('error', 'Ошибка входа', 'Неверный логин/email или пароль');
        }
    } catch (error) {
        showNotification('error', 'Ошибка авторизации', 'Произошла ошибка при входе');
    }
    
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
});

// Загрузка страницы
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    
    createPasswordToggle('authPassword');
    createPasswordToggle('regPassword');
    createPasswordToggle('regConfirmPassword');
    
    window.addEventListener('popstate', handlePopState);
    
    const hash = window.location.hash.replace('#', '');
    if (hash && ['main', 'auth', 'register', 'dashboard'].includes(hash)) {
        navigateTo(hash, false);
    } else {
        navigateTo('main', true);
    }
    
    // Анимации
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
});

// Частицы
window.addEventListener('load', function() {
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
});