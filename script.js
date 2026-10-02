/**
 * ==============================================================================
 * Md Ridwan Hossain - Interactive Portfolio & Web Application Logic
 * ==============================================================================
 * Modules:
 * 1. ThemeManager        - Dark / Light mode switching & LocalStorage persistence
 * 2. NavigationManager   - Mobile navigation drawer & Active section scroll-spy
 * 3. PortfolioFilter     - Interactive category filter tabs with smooth transitions
 * 4. PricingCalculator   - Interactive scope slider, add-on pricing & real-time counter
 * 5. ContactValidator    - Real-time input validation, character counter & toast alert
 * 6. LiveChatWidget      - Interactive chat window, quick reply chips & bot replies
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. ThemeManager (Dark / Light Mode)
       ========================================================================== */
    const ThemeManager = (() => {
        const toggleBtn = document.getElementById('theme-toggle');
        const themeIcon = document.getElementById('theme-icon');

        function applyTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            if (theme === 'light') {
                themeIcon.textContent = '☀️';
                toggleBtn.setAttribute('title', 'Switch to Dark Mode');
            } else {
                themeIcon.textContent = '🌙';
                toggleBtn.setAttribute('title', 'Switch to Light Mode');
            }
        }

        function init() {
            const savedTheme = localStorage.getItem('theme') || 'dark';
            applyTheme(savedTheme);

            toggleBtn.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
                applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
            });
        }

        return { init };
    })();

    /* ==========================================================================
       2. NavigationManager (Mobile Menu & Scroll Spy)
       ========================================================================== */
    const NavigationManager = (() => {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const navLinks = document.getElementById('nav-links');
        const sections = document.querySelectorAll('section');
        const navAnchors = document.querySelectorAll('.nav-links a');

        function init() {
            // Mobile Drawer Toggle
            if (mobileMenuBtn) {
                mobileMenuBtn.addEventListener('click', () => {
                    navLinks.classList.toggle('active');
                });
            }

            // Close mobile menu on link click
            navAnchors.forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                });
            });

            // Scroll Spy
            window.addEventListener('scroll', () => {
                let currentSectionId = '';
                sections.forEach(section => {
                    const sectionTop = section.offsetTop - 120;
                    if (window.scrollY >= sectionTop) {
                        currentSectionId = section.getAttribute('id');
                    }
                });

                navAnchors.forEach(anchor => {
                    anchor.classList.remove('active');
                    if (anchor.getAttribute('href') === `#${currentSectionId}`) {
                        anchor.classList.add('active');
                    }
                });
            });
        }

        return { init };
    })();

    /* ==========================================================================
       3. PortfolioFilter (Interactive Project Filter Tabs)
       ========================================================================== */
    const PortfolioFilter = (() => {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const portfolioCards = document.querySelectorAll('.portfolio-card');

        function init() {
            filterButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    const filter = btn.getAttribute('data-filter');

                    portfolioCards.forEach(card => {
                        const category = card.getAttribute('data-category');
                        if (filter === 'all' || category === filter) {
                            card.style.display = 'flex';
                            setTimeout(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'translateY(0) scale(1)';
                            }, 20);
                        } else {
                            card.style.opacity = '0';
                            card.style.transform = 'translateY(15px) scale(0.95)';
                            setTimeout(() => {
                                card.style.display = 'none';
                            }, 300);
                        }
                    });
                });
            });
        }

        return { init };
    })();

    /* ==========================================================================
       4. PricingCalculator (Interactive Scope Slider & Real-time Quote)
       ========================================================================== */
    const PricingCalculator = (() => {
        const scopeSlider = document.getElementById('scope-slider');
        const scopeValueLabel = document.getElementById('scope-value-label');
        const pricingTierBadge = document.getElementById('pricing-tier-badge');
        const estimatedPriceEl = document.getElementById('estimated-price');
        const estimatedTimeEl = document.getElementById('estimated-time');
        const addonCheckboxes = document.querySelectorAll('.addon-checkbox');
        const pricingCtaBtn = document.getElementById('pricing-cta-btn');

        const tiers = [
            { max: 2, name: 'Starter Landing', base: 349, time: '3 - 5 Days' },
            { max: 5, name: 'Growth Business', base: 699, time: '1 - 2 Weeks' },
            { max: 8, name: 'Professional App', base: 1299, time: '2 - 3 Weeks' },
            { max: 10, name: 'Enterprise Platform', base: 2199, time: '4+ Weeks' }
        ];

        function animateNumber(element, target) {
            const current = parseInt(element.textContent.replace(/,/g, ''), 10) || 0;
            const diff = target - current;
            const duration = 250;
            const startTime = performance.now();

            function step(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const value = Math.round(current + (diff * progress));
                element.textContent = value.toLocaleString();
                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            }
            requestAnimationFrame(step);
        }

        function calculate() {
            const pages = parseInt(scopeSlider.value, 10);
            scopeValueLabel.textContent = `${pages} ${pages === 1 ? 'Page / Module' : 'Pages / Modules'}`;

            let selectedTier = tiers[0];
            for (let tier of tiers) {
                if (pages <= tier.max) {
                    selectedTier = tier;
                    break;
                }
            }

            pricingTierBadge.textContent = selectedTier.name;
            estimatedTimeEl.textContent = selectedTier.time;

            let addonsSum = 0;
            addonCheckboxes.forEach(cb => {
                if (cb.checked) {
                    addonsSum += parseInt(cb.getAttribute('data-price'), 10);
                }
            });

            const total = selectedTier.base + (pages * 40) + addonsSum;
            animateNumber(estimatedPriceEl, total);
        }

        function init() {
            if (!scopeSlider) return;

            scopeSlider.addEventListener('input', calculate);
            addonCheckboxes.forEach(cb => cb.addEventListener('change', calculate));
            calculate();

            if (pricingCtaBtn) {
                pricingCtaBtn.addEventListener('click', () => {
                    const subjectInput = document.getElementById('contact-subject');
                    if (subjectInput) {
                        subjectInput.value = `Selected Plan: ${pricingTierBadge.textContent} (${scopeSlider.value} Pages - Est. $${estimatedPriceEl.textContent})`;
                        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
                        subjectInput.focus();
                    }
                });
            }
        }

        return { init };
    })();

    /* ==========================================================================
       5. ContactValidator (Dynamic Form Validation & Toast Notification)
       ========================================================================== */
    const ContactValidator = (() => {
        const contactForm = document.getElementById('contact-form');
        const nameInput = document.getElementById('contact-name');
        const emailInput = document.getElementById('contact-email');
        const messageInput = document.getElementById('contact-message');
        const charCounter = document.getElementById('char-counter');
        const nameError = document.getElementById('name-error');
        const emailError = document.getElementById('email-error');
        const messageError = document.getElementById('message-error');
        const submitBtn = document.getElementById('submit-btn');
        const btnSpinner = document.getElementById('btn-spinner');
        const btnText = document.getElementById('btn-text');

        const toast = document.getElementById('toast-notification');
        const toastTitle = document.getElementById('toast-title');
        const toastBody = document.getElementById('toast-body');

        function showToast(title, body) {
            toastTitle.textContent = title;
            toastBody.textContent = body;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 5000);
        }

        function validateName() {
            if (nameInput.value.trim().length >= 3) {
                nameInput.classList.remove('is-invalid');
                nameInput.classList.add('is-valid');
                nameError.classList.remove('active');
                return true;
            } else {
                nameInput.classList.add('is-invalid');
                nameInput.classList.remove('is-valid');
                nameError.classList.add('active');
                return false;
            }
        }

        function validateEmail() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(emailInput.value.trim())) {
                emailInput.classList.remove('is-invalid');
                emailInput.classList.add('is-valid');
                emailError.classList.remove('active');
                return true;
            } else {
                emailInput.classList.add('is-invalid');
                emailInput.classList.remove('is-valid');
                emailError.classList.add('active');
                return false;
            }
        }

        function validateMessage() {
            if (messageInput.value.trim().length >= 15) {
                messageInput.classList.remove('is-invalid');
                messageInput.classList.add('is-valid');
                messageError.classList.remove('active');
                return true;
            } else {
                messageInput.classList.add('is-invalid');
                messageInput.classList.remove('is-valid');
                messageError.classList.add('active');
                return false;
            }
        }

        function init() {
            if (!contactForm) return;

            messageInput.addEventListener('input', () => {
                charCounter.textContent = `${messageInput.value.length} / 500`;
            });

            nameInput.addEventListener('blur', validateName);
            emailInput.addEventListener('blur', validateEmail);
            messageInput.addEventListener('blur', validateMessage);

            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const isNameValid = validateName();
                const isEmailValid = validateEmail();
                const isMsgValid = validateMessage();

                if (!isNameValid || !isEmailValid || !isMsgValid) {
                    return;
                }

                btnSpinner.style.display = 'inline-block';
                btnText.textContent = 'Transmitting...';
                submitBtn.disabled = true;

                setTimeout(() => {
                    btnSpinner.style.display = 'none';
                    btnText.textContent = 'Sent Successfully! ✅';
                    showToast('Message Received!', `Thank you, ${nameInput.value.trim()}! Md Ridwan Hossain will reply within 24 hours.`);

                    contactForm.reset();
                    charCounter.textContent = '0 / 500';
                    nameInput.classList.remove('is-valid');
                    emailInput.classList.remove('is-valid');
                    messageInput.classList.remove('is-valid');

                    setTimeout(() => {
                        btnText.textContent = 'Send Message 🚀';
                        submitBtn.disabled = false;
                    }, 3000);
                }, 1200);
            });
        }

        return { init };
    })();

    /* ==========================================================================
       6. LiveChatWidget (Interactive Chatbot & Floating Widget)
       ========================================================================== */
    const LiveChatWidget = (() => {
        const launcherBtn = document.getElementById('chat-launcher-btn');
        const chatWindow = document.getElementById('chat-window');
        const closeBtn = document.getElementById('chat-close-btn');
        const chatMessages = document.getElementById('chat-messages');
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('chat-send-btn');
        const chatBadge = document.getElementById('chat-badge');
        const typingIndicator = document.getElementById('typing-indicator');
        const chipButtons = document.querySelectorAll('.chip-btn');

        function toggleChat() {
            chatWindow.classList.toggle('open');
            if (chatWindow.classList.contains('open')) {
                chatBadge.style.display = 'none';
                chatInput.focus();
            }
        }

        function formatTime() {
            const now = new Date();
            return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        function appendMessage(text, isUser = false) {
            const bubble = document.createElement('div');
            bubble.className = `msg-bubble ${isUser ? 'msg-user' : 'msg-bot'}`;
            bubble.innerHTML = `${text} <div class="msg-time">${formatTime()}</div>`;
            chatMessages.insertBefore(bubble, typingIndicator);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function triggerBotReply(promptText) {
            typingIndicator.style.display = 'flex';
            chatMessages.scrollTop = chatMessages.scrollHeight;

            const lower = promptText.toLowerCase();
            let reply = "Thanks for your message! Md Ridwan Hossain is online and will reply shortly. You can also send a direct inquiry through the contact form.";

            if (lower.includes('hire') || lower.includes('project') || lower.includes('work')) {
                reply = "I'm currently accepting new projects! Feel free to use the interactive Pricing calculator to check estimates or drop your details in the Contact form.";
            } else if (lower.includes('price') || lower.includes('rate') || lower.includes('cost')) {
                reply = "Standard landing pages start at $349, while complete custom web platforms range from $1,299 to $2,199+. Adjust the slider in our Pricing section to view custom quotes!";
            } else if (lower.includes('tech') || lower.includes('stack') || lower.includes('skill')) {
                reply = "My core stack includes modern JavaScript, TypeScript, React, Next.js, Node.js, REST APIs, and responsive UI/UX architecture.";
            } else if (lower.includes('meeting') || lower.includes('call') || lower.includes('schedule')) {
                reply = "I'd be glad to schedule a quick Google Meet or Zoom consultation! Leave your email in the contact form or write to contact@mdridwan.dev.";
            } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
                reply = "Hello! 👋 Great to have you here. Are you looking to launch a new web app or upgrade an existing website?";
            }

            setTimeout(() => {
                typingIndicator.style.display = 'none';
                appendMessage(reply, false);
            }, 900);
        }

        function handleSend() {
            const query = chatInput.value.trim();
            if (!query) return;

            appendMessage(query, true);
            chatInput.value = '';
            triggerBotReply(query);
        }

        function init() {
            if (!launcherBtn || !chatWindow) return;

            launcherBtn.addEventListener('click', toggleChat);
            closeBtn.addEventListener('click', toggleChat);

            sendBtn.addEventListener('click', handleSend);
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleSend();
                }
            });

            chipButtons.forEach(chip => {
                chip.addEventListener('click', () => {
                    const text = chip.textContent.trim();
                    appendMessage(text, true);
                    triggerBotReply(text);
                });
            });
        }

        return { init };
    })();

    /* ==========================================================================
       Initialize All Application Modules
       ========================================================================== */
    ThemeManager.init();
    NavigationManager.init();
    PortfolioFilter.init();
    PricingCalculator.init();
    ContactValidator.init();
    LiveChatWidget.init();
});
