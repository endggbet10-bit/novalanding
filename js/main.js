// === ОСНОВНОЙ СКРИПТ ===

document.addEventListener('DOMContentLoaded', () => {

    // ============================
    // 1. HEADER — тень при скролле
    // ============================
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });


    // ============================
    // 2. БУРГЕР-МЕНЮ (мобилка)
    // ============================
    const burger = document.getElementById('burger');
    const nav = document.querySelector('.header__nav');

    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        nav.classList.toggle('active');
    });

    // Закрыть меню при клике на ссылку
    document.querySelectorAll('.header__link').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            nav.classList.remove('active');
        });
    });


    // ============================
    // 3. SCROLL-АНИМАЦИИ (появление элементов)
    // ============================
    const animatedElements = document.querySelectorAll('[data-animate="fade-up"]');

    const observerOptions = {
        threshold: 0.15,   // элемент виден на 15%
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Задержка для каскадного появления
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);

                observer.unobserve(entry.target); // анимируем один раз
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));


    // ============================
    // 4. СЧЁТЧИКИ (анимация чисел)
    // ============================
    const counters = document.querySelectorAll('.stats__number');
    let countersStarted = false;

    const statsSection = document.getElementById('stats');

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersStarted) {
                countersStarted = true;
                counters.forEach(counter => animateCounter(counter));
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    function animateCounter(el) {
        const target = parseFloat(el.dataset.target);
        const isDecimal = el.dataset.decimal === 'true';
        const duration = 2000; // 2 секунды
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing (замедление к концу)
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * target;

            if (isDecimal) {
                el.textContent = current.toFixed(1);
            } else {
                el.textContent = Math.floor(current).toLocaleString('ru-RU');
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                // Финальное значение
                if (isDecimal) {
                    el.textContent = target.toFixed(1);
                } else {
                    el.textContent = target.toLocaleString('ru-RU');
                }
            }
        }

        requestAnimationFrame(update);
    }


    // ============================
    // 5. ФОРМА ПОДПИСКИ
    // ============================
    const subscribeForm = document.getElementById('subscribeForm');

    if (subscribeForm) {
        subscribeForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const input = subscribeForm.querySelector('.subscribe__input');
            const btn = subscribeForm.querySelector('.btn');
            const originalText = btn.textContent;

            // Анимация кнопки
            btn.textContent = '✓ Готово!';
            btn.style.background = '#00cc6a';
            input.value = '';

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
            }, 3000);
        });
    }


    // ============================
    // 6. ПЛАВНЫЙ СКРОЛЛ для якорных ссылок
    // ============================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = targetEl.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

});