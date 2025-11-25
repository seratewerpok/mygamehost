// Элементы страниц
const mainPage = document.getElementById('mainPage');
const authPage = document.getElementById('authPage');
const registerPage = document.getElementById('registerPage');
const dashboardPage = document.getElementById('dashboardPage');
const createServerPage = document.getElementById('createServerPage');
const balancePage = document.getElementById('balancePage');

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

// Создание сервера
const createServerMenuLink = document.getElementById('createServerMenuLink');
const createServerHomeLink = document.getElementById('createServerHomeLink');
const createServerDashboardLink = document.getElementById('createServerDashboardLink');
const backToDashboardBtn = document.getElementById('backToDashboardBtn');
const continueToStep2Btn = document.getElementById('continueToStep2Btn');

// Баланс
const balanceMenuLink = document.getElementById('balanceMenuLink');
const balanceHomeLink = document.getElementById('balanceHomeLink');
const balanceDashboardLink = document.getElementById('balanceDashboardLink');
const currentBalance = document.getElementById('currentBalance');
const depositAmount = document.getElementById('depositAmount');
const depositSubmitBtn = document.getElementById('depositSubmitBtn');
const amountPresets = document.querySelectorAll('.amount-preset');

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
const authEmail = document.getElementById('authLogin');
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

// Показ навигации
function showGuestNav() {
    guestNav.style.display = 'flex';
    userNav.style.display = 'none';
}

function showUserNav(username) {
    guestNav.style.display = 'none';
    userNav.style.display = 'flex';
    usernameSpan.textContent = username;
}

// Обновление дашборда
function updateDashboardInfo(userData) {
    infoId.textContent = userData.id || '---';
    infoLogin.textContent = userData.login || '---';
    infoEmail.textContent = userData.email || '---';
    infoRole.textContent = userData.role || 'Пользователь';
    infoBalance.textContent = (userData.balance || 0) + ' руб.';
    infoRegDate.textContent = userData.registrationDate || new Date().toLocaleString('ru-RU');
    
    const userServers = JSON.parse(localStorage.getItem('userServers') || '[]');
    serversCount.textContent = userServers.length;
}

// Обновление баланса на странице баланса
function updateBalancePage(userData) {
    currentBalance.textContent = (userData.balance || 0) + ' ₽';
}

// Навигация
function navigateTo(page, addToHistory = true) {
    mainPage.style.display = 'none';
    authPage.style.display = 'none';
    registerPage.style.display = 'none';
    dashboardPage.style.display = 'none';
    createServerPage.style.display = 'none';
    balancePage.style.display = 'none';
    
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
            break;
        case 'createServer':
            createServerPage.style.display = 'block';
            document.title = 'Создание сервера - Gamely';
            break;
        case 'balance':
            balancePage.style.display = 'block';
            document.title = 'Пополнение баланса - Gamely';
            break;
    }
    
    if (addToHistory) {
        history.pushState({ page: page }, '', `#${page}`);
    }
}

function handlePopState(event) {
    if (event.state && event.state.page) {
        navigateTo(event.state.page, false);
    } else {
        navigateTo('main', false);
    }
}

// ========== ОСНОВНОЙ ФУНКЦИОНАЛ (Firebase Architecture) ==========

// Вход через Google
async function signInWithGoogle() {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('email');
        provider.addScope('profile');
        
        const result = await auth.signInWithPopup(provider);
        const user = result.user;

        // Проверяем, есть ли профиль в Firestore
        const userRef = db.collection('users').doc(user.uid);
        const doc = await userRef.get();

        if (!doc.exists) {
            // Создаем новый профиль
            const newUser = {
                id: user.uid,
                login: user.displayName || user.email.split('@')[0],
                email: user.email.toLowerCase(),
                role: 'Пользователь',
                balance: 0,
                registrationDate: new Date().toLocaleString('ru-RU'),
                displayName: user.displayName,
                photoURL: user.photoURL
            };
            await userRef.set(newUser);
            
            showUserNav(newUser.login);
            updateDashboardInfo(newUser);
            updateBalancePage(newUser);
            showNotification('success', 'Успешно!', `Добро пожаловать, ${newUser.login}!`);
        } else {
            const userData = doc.data();
            showUserNav(userData.login);
            updateDashboardInfo(userData);
            updateBalancePage(userData);
            showNotification('success', 'С возвращением!', `Рады видеть, ${userData.login}!`);
        }

        navigateTo('main');
        return true;
    } catch (error) {
        console.error('Google auth error:', error);
        let msg = 'Не удалось войти через Google';
        if (error.code === 'auth/popup-blocked') msg = 'Всплывающее окно заблокировано браузером';
        if (error.code === 'auth/popup-closed-by-user') msg = 'Вы закрыли окно авторизации';
        showNotification('error', 'Ошибка', msg);
        return false;
    }
}

// Регистрация через Email/Password
async function registerWithEmail(email, login, password) {
    try {
        // Создаем пользователя в Firebase Authentication
        const credential = await auth.createUserWithEmailAndPassword(email, password);
        
        // Сохраняем дополнительные данные в Firestore
        const userData = {
            id: credential.user.uid,
            login: login || email.split('@')[0],
            email: email.toLowerCase(),
            role: 'Пользователь',
            balance: 0,
            registrationDate: new Date().toLocaleString('ru-RU')
        };
        
        await db.collection('users').doc(credential.user.uid).set(userData);
        
        showUserNav(userData.login);
        updateDashboardInfo(userData);
        updateBalancePage(userData);
        showNotification('success', 'Успех!', `Добро пожаловать, ${userData.login}!`);
        navigateTo('main');
        
        return true;
    } catch (error) {
        console.error('Registration error:', error);
        let msg = 'Ошибка регистрации';
        if (error.code === 'auth/email-already-in-use') msg = 'Этот email уже зарегистрирован';
        if (error.code === 'auth/weak-password') msg = 'Пароль слишком слабый (минимум 6 символов)';
        if (error.code === 'auth/invalid-email') msg = 'Неверный формат email';
        showNotification('error', 'Ошибка', msg);
        return false;
    }
}

// Вход через Email/Password
async function loginWithEmail(email, password) {
    try {
        await auth.signInWithEmailAndPassword(email, password);
        // Успешный вход обработается в onAuthStateChanged
        return true;
    } catch (error) {
        console.error('Login error:', error);
        let msg = 'Неверный email или пароль';
        if (error.code === 'auth/user-not-found') msg = 'Пользователь не найден';
        if (error.code === 'auth/wrong-password') msg = 'Неверный пароль';
        if (error.code === 'auth/invalid-email') msg = 'Неверный формат email';
        showNotification('error', 'Ошибка', msg);
        return false;
    }
}

// Пополнение баланса
async function depositBalance(userId, amount) {
    try {
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();
        
        if (!userDoc.exists) {
            throw new Error('Пользователь не найден');
        }
        
        const userData = userDoc.data();
        const newBalance = (userData.balance || 0) + amount;
        
        // Обновляем баланс в Firestore
        await userRef.update({
            balance: newBalance
        });
        
        // Обновляем интерфейс
        updateDashboardInfo({ ...userData, balance: newBalance });
        updateBalancePage({ ...userData, balance: newBalance });
        
        showNotification('success', 'Баланс пополнен!', `На ваш счет зачислено ${amount} ₽`);
        return true;
        
    } catch (error) {
        console.error('Deposit error:', error);
        showNotification('error', 'Ошибка', 'Не удалось пополнить баланс');
        return false;
    }
}

// Автоматическое обновление интерфейса при изменении статуса авторизации
auth.onAuthStateChanged(async (user) => {
    if (user) {
        // Пользователь вошел
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            showUserNav(userData.login);
            updateDashboardInfo(userData);
            updateBalancePage(userData);
            
            // Если находимся на странице авторизации/регистрации - переходим на главную
            if (location.hash === '#auth' || location.hash === '#register') {
                navigateTo('main');
            }
        }
    } else {
        // Пользователь вышел
        showGuestNav();
        localStorage.removeItem(CURRENT_USER_KEY);
    }
});

// Выход
function logoutUser() {
    auth.signOut();
    showNotification('info', 'Выход', 'Вы успешно вышли из аккаунта');
    navigateTo('main');
}

// ========== ОБРАБОТЧИКИ СОБЫТИЙ ==========

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
    if (auth.currentUser) {
        navigateTo('dashboard');
    } else {
        navigateTo('auth');
    }
});

dashboardHomeLink.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('main');
});

createServerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (auth.currentUser) {
        navigateTo('createServer');
    } else {
        navigateTo('auth');
    }
});

heroCreateBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (auth.currentUser) {
        navigateTo('createServer');
    } else {
        navigateTo('auth');
    }
});

createServerDashboardBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (auth.currentUser) {
        navigateTo('createServer');
    } else {
        navigateTo('auth');
    }
});

depositBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (auth.currentUser) {
        navigateTo('balance');
    } else {
        navigateTo('auth');
    }
});

// Обработчики создания сервера
createServerMenuLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (auth.currentUser) {
        navigateTo('createServer');
    } else {
        navigateTo('auth');
    }
});

createServerHomeLink.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('main');
});

createServerDashboardLink.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('dashboard');
});

backToDashboardBtn.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('dashboard');
});

continueToStep2Btn.addEventListener('click', (e) => {
    e.preventDefault();
    showNotification('info', 'Создание сервера', 'Переход ко второму шагу будет реализован позже');
});

// Обработчики страницы баланса
balanceMenuLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (auth.currentUser) {
        navigateTo('balance');
    } else {
        navigateTo('auth');
    }
});

balanceHomeLink.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('main');
});

balanceDashboardLink.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('dashboard');
});

// Быстрый выбор суммы пополнения
amountPresets.forEach(preset => {
    preset.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Убираем активный класс у всех пресетов
        amountPresets.forEach(p => p.classList.remove('active'));
        
        // Добавляем активный класс текущему пресету
        preset.classList.add('active');
        
        // Устанавливаем значение в поле ввода
        const amount = preset.getAttribute('data-amount');
        depositAmount.value = amount;
    });
});

// Пополнение баланса
depositSubmitBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const amount = parseInt(depositAmount.value);
    
    if (!amount || amount < 10) {
        showNotification('warning', 'Ошибка', 'Минимальная сумма пополнения - 10 ₽');
        return;
    }
    
    if (amount > 50000) {
        showNotification('warning', 'Ошибка', 'Максимальная сумма пополнения - 50 000 ₽');
        return;
    }
    
    const user = auth.currentUser;
    if (!user) {
        showNotification('error', 'Ошибка', 'Необходимо авторизоваться');
        navigateTo('auth');
        return;
    }
    
    const originalText = depositSubmitBtn.innerHTML;
    depositSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Пополнение...';
    depositSubmitBtn.disabled = true;
    
    // Имитация платежной системы (в реальности здесь будет интеграция с ЮKassa и т.д.)
    setTimeout(async () => {
        const success = await depositBalance(user.uid, amount);
        
        if (success) {
            depositAmount.value = '';
            amountPresets.forEach(p => p.classList.remove('active'));
        }
        
        depositSubmitBtn.innerHTML = originalText;
        depositSubmitBtn.disabled = false;
    }, 2000);
});

// Кнопки Google
googleAuthBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const btn = googleAuthBtn;
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Вход через Google...';
    btn.disabled = true;
    
    await signInWithGoogle();
    
    btn.innerHTML = originalText;
    btn.disabled = false;
});

googleRegisterBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const btn = googleRegisterBtn;
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Регистрация через Google...';
    btn.disabled = true;
    
    await signInWithGoogle();
    
    btn.innerHTML = originalText;
    btn.disabled = false;
});

// Форма регистрации
registerForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = regEmail.value.trim();
    const login = regLogin.value.trim() || email.split('@')[0];
    const password = regPassword.value;
    const confirmPassword = regConfirmPassword.value;
    
    if (!email || !password || !confirmPassword) {
        showNotification('warning', 'Ошибка', 'Заполните все обязательные поля');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('warning', 'Ошибка', 'Пароли не совпадают');
        return;
    }
    
    if (password.length < 6) {
        showNotification('warning', 'Ошибка', 'Пароль должен быть не менее 6 символов');
        return;
    }
    
    const submitBtn = this.querySelector('.auth-submit');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Регистрация...';
    submitBtn.disabled = true;
    
    const success = await registerWithEmail(email, login, password);
    
    if (success) {
        registerForm.reset();
    }
    
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
});

// Форма авторизации
authForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = authEmail.value.trim();
    const password = authPassword.value;
    
    if (!email || !password) {
        showNotification('warning', 'Ошибка', 'Заполните email и пароль');
        return;
    }
    
    const submitBtn = this.querySelector('.auth-submit');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Вход...';
    submitBtn.disabled = true;
    
    await loginWithEmail(email, password);
    
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
});

// Валидация формы регистрации
regEmail.addEventListener('blur', function() {
    const email = this.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
        emailError.textContent = 'Неверный формат email';
        emailError.style.display = 'block';
    } else {
        emailError.style.display = 'none';
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

// ========== ИНИЦИАЛИЗАЦИЯ ==========

// Загрузка страницы
document.addEventListener('DOMContentLoaded', function() {
    createPasswordToggle('authPassword');
    createPasswordToggle('regPassword');
    createPasswordToggle('regConfirmPassword');
    
    window.addEventListener('popstate', handlePopState);
    
    const hash = window.location.hash.replace('#', '');
    if (hash && ['main', 'auth', 'register', 'dashboard', 'createServer', 'balance'].includes(hash)) {
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