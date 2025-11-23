* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #e0e0e0;
    background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
    min-height: 100vh;
    overflow-x: hidden;
}

/* Хедер */
header {
    background: rgba(26, 26, 46, 0.95);
    backdrop-filter: blur(10px);
    padding: 1rem 0;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
    box-shadow: 0 2px 20px rgba(102, 51, 153, 0.2);
    border-bottom: 1px solid #333;
}

.header-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
}

/* Логотип */
.logo {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    font-size: 1.8rem;
    font-weight: bold;
}

.logo i {
    font-size: 2.2rem;
    background: linear-gradient(135deg, #8b5ceb 0%, #6d28d9 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.site-name {
    background: linear-gradient(135deg, #8b5ceb 0%, #6d28d9 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 800;
}

/* Навигация */
.nav-section {
    display: flex;
    align-items: center;
    gap: 0.8rem;
}

.nav-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #e0e0e0;
    text-decoration: none;
    padding: 0.7rem 1.2rem;
    border-radius: 8px;
    transition: all 0.3s ease;
    font-weight: 500;
}

.nav-link:hover {
    background: rgba(139, 92, 235, 0.2);
    color: #8b5ceb;
    transform: translateY(-1px);
}

/* Выпадающее меню помощи */
.nav-dropdown {
    position: relative;
}

.dropdown-content {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    background: #1a1a2e;
    min-width: 200px;
    box-shadow: 0 8px 25px rgba(139, 92, 235, 0.3);
    border-radius: 10px;
    padding: 0.5rem 0;
    z-index: 1001;
    border: 1px solid #333;
}

.dropdown-content a {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    padding: 0.8rem 1.2rem;
    color: #e0e0e0;
    text-decoration: none;
    transition: all 0.3s;
}

.dropdown-content a:hover {
    background: rgba(139, 92, 235, 0.2);
    color: #8b5ceb;
}

.nav-dropdown:hover .dropdown-content {
    display: block;
}

/* Кнопки */
.create-server-btn {
    background: linear-gradient(135deg, #8b5ceb 0%, #6d28d9 100%);
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    transition: all 0.3s ease;
}

.create-server-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(139, 92, 235, 0.4);
    background: linear-gradient(135deg, #9b69f0 0%, #7c3aed 100%);
}

.login-btn {
    background: transparent;
    border: 2px solid #8b5ceb;
    color: #8b5ceb;
    border-radius: 8px;
}

.login-btn:hover {
    background: #8b5ceb;
    color: white;
}

/* Главная страница */
.main-page {
    display: block;
}

.auth-page {
    display: none;
    min-height: 100vh;
    padding-top: 80px;
}

/* Герой-баннер */
.hero-banner {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: white;
    padding: 0 2rem;
    margin-top: 80px;
}

.hero-content {
    max-width: 800px;
    z-index: 2;
    position: relative;
}

.hero-content h1 {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 1.5rem;
    line-height: 1.2;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    background: linear-gradient(135deg, #ffffff 0%, #8b5ceb 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.hero-content p {
    font-size: 1.4rem;
    margin-bottom: 3rem;
    opacity: 0.9;
    font-weight: 300;
    color: #c4b5fd;
}

.hero-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
        radial-gradient(circle at 20% 80%, rgba(139, 92, 235, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(109, 40, 217, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(124, 58, 237, 0.05) 0%, transparent 50%);
    background-size: cover;
    z-index: 1;
}

/* Кнопки героя */
.hero-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}

.btn-primary {
    background: linear-gradient(135deg, #8b5ceb 0%, #6d28d9 100%);
    color: white;
    border: none;
    padding: 1rem 2.5rem;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-block;
}

.btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(139, 92, 235, 0.4);
    background: linear-gradient(135deg, #9b69f0 0%, #7c3aed 100%);
}

.btn-secondary {
    background: transparent;
    color: #c4b5fd;
    border: 2px solid rgba(139, 92, 235, 0.3);
    padding: 1rem 2rem;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-secondary:hover {
    background: rgba(139, 92, 235, 0.1);
    border-color: rgba(139, 92, 235, 0.6);
    color: #8b5ceb;
}

/* Страница авторизации */
.auth-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 80px);
    padding: 2rem;
}

.auth-card {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    padding: 3rem;
    border-radius: 15px;
    box-shadow: 0 20px 40px rgba(139, 92, 235, 0.3);
    border: 1px solid #333;
    width: 100%;
    max-width: 400px;
}

.auth-header {
    text-align: center;
    margin-bottom: 2rem;
}

.auth-header h2 {
    background: linear-gradient(135deg, #8b5ceb 0%, #6d28d9 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

.auth-header p {
    color: #c4b5fd;
    opacity: 0.8;
}

/* Форма авторизации */
.auth-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-group label {
    font-weight: 600;
    color: #c4b5fd;
    font-size: 0.9rem;
}

.form-group input {
    padding: 1rem;
    border: 2px solid #333;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s;
    background: #0c0c0c;
    color: white;
}

.form-group input:focus {
    outline: none;
    border-color: #8b5ceb;
    box-shadow: 0 0 0 3px rgba(139, 92, 235, 0.1);
}

/* reCAPTCHA стили */
.recaptcha-container {
    margin: 1.5rem 0;
    display: flex;
    justify-content: center;
}

.g-recaptcha {
    transform: scale(0.9);
    transform-origin: 0 0;
}

/* Кнопка входа */
.auth-submit {
    width: 100%;
    padding: 1rem;
    font-size: 1.1rem;
    margin-top: 1rem;
    opacity: 0.6;
    cursor: not-allowed;
}

.auth-submit:enabled {
    opacity: 1;
    cursor: pointer;
}

.auth-links {
    display: flex;
    justify-content: space-between;
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #333;
}

.auth-links a {
    color: #8b5ceb;
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.3s;
}

.auth-links a:hover {
    color: #c4b5fd;
    text-decoration: underline;
}

/* Преимущества регистрации */
.register-features {
    background: rgba(139, 92, 235, 0.05);
    border: 1px solid #333;
    border-radius: 8px;
    padding: 1rem;
    margin: 1rem 0;
}

.register-features h4 {
    color: #8b5ceb;
    margin-bottom: 0.5rem;
}

.register-features ul {
    list-style: none;
    padding-left: 0;
}

.register-features li {
    color: #c4b5fd;
    margin-bottom: 0.3rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.register-features li::before {
    content: "✓";
    color: #8b5ceb;
    font-weight: bold;
}

/* Анимации */
@keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
    50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
}

/* Адаптивность */
@media (max-width: 768px) {
    .header-container {
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
    }
    
    .hero-content h1 {
        font-size: 2rem;
    }
    
    .hero-content p {
        font-size: 1.1rem;
    }
    
    .hero-buttons {
        flex-direction: column;
    }
    
    .nav-section {
        flex-wrap: wrap;
        justify-content: center;
    }
    
    .dropdown-content {
        left: -50px;
    }
    
    .auth-card {
        padding: 2rem;
        margin: 1rem;
    }
    
    .auth-links {
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
    }
    
    .g-recaptcha {
        transform: scale(0.8);
    }
}

@media (max-width: 400px) {
    .g-recaptcha {
        transform: scale(0.7);
    }
}
