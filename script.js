// Script principal da página de vendas IPTV
// Funcionalidades: Menu mobile, validação de formulário, scroll suave, animações

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    // Inicializa todas as funcionalidades
    initMobileMenu();
    initFormValidation();
    initSmoothScroll();
    initScrollEffects();
    initAnimations();
    initPhoneMask();
    
    console.log('✅ Página IPTV carregada com sucesso!');
});

// ==========================================
// MENU MOBILE RESPONSIVO
// ==========================================
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!hamburger || !navMenu) {
        console.warn('⚠️ Elementos do menu mobile não encontrados');
        return;
    }
    
    // Toggle do menu mobile
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Previne scroll do body quando menu está aberto
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
    });
    
    // Fecha menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Fecha menu ao clicar fora dele
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    console.log('✅ Menu mobile inicializado');
}

// ==========================================
// SCROLL SUAVE PARA ÂNCORAS
// ==========================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignora links vazios ou apenas #
            if (href === '#' || href === '') {
                e.preventDefault();
                return;
            }
            
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                e.preventDefault();
                
                // Calcula offset do header fixo
                const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                // Scroll suave
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    console.log('✅ Scroll suave inicializado');
}

// ==========================================
// VALIDAÇÃO DO FORMULÁRIO DE CONTATO
// ==========================================
function initFormValidation() {
    const form = document.getElementById('contactForm');
    
    if (!form) {
        console.warn('⚠️ Formulário de contato não encontrado');
        return;
    }
    
    // Elementos do formulário
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const planSelect = document.getElementById('plan');
    
    // Validação em tempo real
    nameInput?.addEventListener('blur', () => validateName());
    emailInput?.addEventListener('blur', () => validateEmail());
    phoneInput?.addEventListener('blur', () => validatePhone());
    planSelect?.addEventListener('change', () => validatePlan());
    
    // Submissão do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Valida todos os campos
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();
        const isPlanValid = validatePlan();
        
        // Se todos os campos são válidos
        if (isNameValid && isEmailValid && isPhoneValid && isPlanValid) {
            submitForm();
        } else {
            showError('Por favor, corrija os erros antes de enviar.');
        }
    });
    
    // Funções de validação individuais
    function validateName() {
        const name = nameInput.value.trim();
        const errorElement = document.getElementById('nameError');
        
        if (name.length < 2) {
            showFieldError(errorElement, 'Nome deve ter pelo menos 2 caracteres');
            return false;
        }
        
        if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(name)) {
            showFieldError(errorElement, 'Nome deve conter apenas letras');
            return false;
        }
        
        clearFieldError(errorElement);
        return true;
    }
    
    function validateEmail() {
        const email = emailInput.value.trim();
        const errorElement = document.getElementById('emailError');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            showFieldError(errorElement, 'Email é obrigatório');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            showFieldError(errorElement, 'Email inválido');
            return false;
        }
        
        clearFieldError(errorElement);
        return true;
    }
    
    function validatePhone() {
        const phone = phoneInput.value.trim();
        const errorElement = document.getElementById('phoneError');
        
        // Remove caracteres não numéricos para validação
        const phoneNumbers = phone.replace(/\D/g, '');
        
        if (phoneNumbers.length < 10) {
            showFieldError(errorElement, 'Telefone deve ter pelo menos 10 dígitos');
            return false;
        }
        
        if (phoneNumbers.length > 11) {
            showFieldError(errorElement, 'Telefone deve ter no máximo 11 dígitos');
            return false;
        }
        
        clearFieldError(errorElement);
        return true;
    }
    
    function validatePlan() {
        const plan = planSelect.value;
        const errorElement = document.getElementById('planError');
        
        if (!plan) {
            showFieldError(errorElement, 'Selecione um plano');
            return false;
        }
        
        clearFieldError(errorElement);
        return true;
    }
    
    // Funções auxiliares para exibir/limpar erros
    function showFieldError(errorElement, message) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    function clearFieldError(errorElement) {
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }
    
    function showError(message) {
        alert('❌ ' + message);
    }
    
    // Redireciona para WhatsApp com dados do formulário
    function submitForm() {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Mostra loading
        submitButton.textContent = 'Redirecionando...';
        submitButton.disabled = true;
        submitButton.classList.add('loading');
        
        // Coleta dados do formulário
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        const planValue = planSelect.value;
        const planText = planSelect.options[planSelect.selectedIndex].text;
        const message = document.getElementById('message').value.trim();
        
        // Cria mensagem personalizada para WhatsApp
        let whatsappMessage = `Olá! Sou *${name}* e gostaria de solicitar o *teste grátis* do IPTV.\n\n`;
        whatsappMessage += `📋 *Dados para contato:*\n`;
        whatsappMessage += `• Nome: ${name}\n`;
        whatsappMessage += `• Email: ${email}\n`;
        whatsappMessage += `• WhatsApp: ${phone}\n`;
        whatsappMessage += `• Plano de interesse: ${planText}\n`;
        
        if (message) {
            whatsappMessage += `\n💬 *Mensagem adicional:*\n${message}\n`;
        }
        
        whatsappMessage += `\n🎯 Podem me enviar o teste grátis de 24 horas?`;
        
        // URL do WhatsApp
        const whatsappUrl = `https://wa.me/5561991958961?text=${encodeURIComponent(whatsappMessage)}`;
        
        // Simula processamento e redireciona
        setTimeout(() => {
            // Restaura botão
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
            
            // Limpa formulário
            form.reset();
            
            // Redireciona para WhatsApp
            window.open(whatsappUrl, '_blank');
            
        }, 1500);
    }
    
    console.log('✅ Validação de formulário inicializada');
}

// ==========================================
// MÁSCARA PARA TELEFONE
// ==========================================
function initPhoneMask() {
    const phoneInput = document.getElementById('phone');
    
    if (!phoneInput) return;
    
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length <= 11) {
            if (value.length <= 10) {
                // Formato: (11) 9999-9999
                value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
            } else {
                // Formato: (11) 99999-9999
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            }
        }
        
        e.target.value = value;
    });
    
    console.log('✅ Máscara de telefone inicializada');
}

// ==========================================
// EFEITOS DE SCROLL
// ==========================================
function initScrollEffects() {
    const header = document.querySelector('.header');
    
    if (!header) return;
    
    // Efeito de transparência no header
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        
        if (scrolled > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    });
    
    console.log('✅ Efeitos de scroll inicializados');
}

// ==========================================
// ANIMAÇÕES DE ENTRADA
// ==========================================
function initAnimations() {
    // Intersection Observer para animações
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Elementos para animar
    const animatedElements = document.querySelectorAll(
        '.service-card, .pricing-card, .testimonial-card, .contact-method'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    console.log('✅ Animações inicializadas');
}

// ==========================================
// FUNCIONALIDADES DOS BOTÕES DE PLANOS
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const planButtons = document.querySelectorAll('.pricing-card .btn');
    
    planButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Determina o plano baseado no índice
            const plans = ['basico', 'premium', 'familia'];
            const planName = plans[index] || 'premium';
            
            // Preenche o select do formulário
            const planSelect = document.getElementById('plan');
            if (planSelect) {
                planSelect.value = planName;
            }
            
            // Scroll para o formulário
            const contactSection = document.getElementById('contato');
            if (contactSection) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                const targetPosition = contactSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Destaca o formulário
                setTimeout(() => {
                    const form = document.querySelector('.contact-form-container');
                    if (form) {
                        form.style.transform = 'scale(1.02)';
                        form.style.boxShadow = '0 20px 40px rgba(99, 102, 241, 0.2)';
                        
                        setTimeout(() => {
                            form.style.transform = 'scale(1)';
                            form.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                        }, 1000);
                    }
                }, 500);
            }
        });
    });
});

// ==========================================
// ANIMAÇÃO DOS CONTROLES DA TV
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const controlDots = document.querySelectorAll('.control-dot');
    const tvContent = document.querySelector('.tv-content p');
    
    if (controlDots.length === 0 || !tvContent) return;
    
    const channels = [
        'Globo HD - Jornal Nacional',
        'SBT HD - Programa do Ratinho',
        'Record HD - Cidade Alerta',
        'Band HD - Jornal da Band'
    ];
    
    let currentChannel = 0;
    
    // Troca de canal automática
    setInterval(() => {
        // Remove active de todos os dots
        controlDots.forEach(dot => dot.classList.remove('active'));
        
        // Próximo canal
        currentChannel = (currentChannel + 1) % channels.length;
        
        // Ativa o dot correspondente (com fallback)
        if (controlDots[currentChannel % controlDots.length]) {
            controlDots[currentChannel % controlDots.length].classList.add('active');
        }
        
        // Atualiza o texto do canal
        tvContent.textContent = channels[currentChannel];
        
    }, 3000);
    
    console.log('✅ Animação da TV inicializada');
});

// ==========================================
// UTILITÁRIOS GERAIS
// ==========================================

// Função para detectar dispositivo móvel
function isMobile() {
    return window.innerWidth <= 768;
}

// Função para debounce (otimização de performance)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Otimiza eventos de scroll e resize
window.addEventListener('scroll', debounce(function() {
    // Eventos de scroll otimizados podem ser adicionados aqui
}, 10));

window.addEventListener('resize', debounce(function() {
    // Ajustes de layout em redimensionamento
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    if (window.innerWidth > 768) {
        navMenu?.classList.remove('active');
        hamburger?.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}, 250));

// ==========================================
// TRATAMENTO DE ERROS GLOBAIS
// ==========================================
window.addEventListener('error', function(e) {
    console.error('❌ Erro JavaScript:', e.error);
});

// Log de carregamento completo
window.addEventListener('load', function() {
    console.log('🚀 Página IPTV totalmente carregada!');
    
    // Remove qualquer loader se existir
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.display = 'none';
    }
});

// ==========================================
// ANALYTICS E TRACKING (SIMULADO)
// ==========================================
function trackEvent(eventName, eventData = {}) {
    // Em produção, aqui seria integrado com Google Analytics, Facebook Pixel, etc.
    console.log('📊 Evento rastreado:', eventName, eventData);
}

// Rastreia cliques nos botões importantes
document.addEventListener('click', function(e) {
    const target = e.target;
    
    // Rastreia cliques nos botões de planos
    if (target.closest('.pricing-card .btn')) {
        const planCard = target.closest('.pricing-card');
        const planName = planCard.querySelector('h3')?.textContent || 'Desconhecido';
        trackEvent('plan_button_click', { plan: planName });
    }
    
    // Rastreia cliques no WhatsApp
    if (target.closest('.whatsapp-btn')) {
        trackEvent('whatsapp_click', { source: 'floating_button' });
    }
    
    // Rastreia cliques no formulário
    if (target.closest('.contact-form button[type="submit"]')) {
        trackEvent('form_submit_attempt');
    }
});

console.log('📱 Script IPTV carregado - Versão 1.0');
console.log('🎯 Funcionalidades ativas: Menu Mobile, Validação, Scroll Suave, Animações');
console.log('💡 Para suporte: contato@iptvpremium.com');