document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(localStorage.getItem('nova_cart')) || [];

    const cartBtn = document.getElementById('cartBtn');
    const cartClose = document.getElementById('cartClose');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartBadge = document.getElementById('cartBadge');
    const cartTotalSum = document.getElementById('cartTotalSum');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // Открыть / Закрыть
    function toggleCart() {
        if (cartDrawer && cartOverlay) {
            cartDrawer.classList.toggle('active');
            cartOverlay.classList.toggle('active');
        }
    }

    if (cartBtn) cartBtn.addEventListener('click', toggleCart);
    if (cartClose) cartClose.addEventListener('click', toggleCart);
    if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);

    // Сохранение и обновление
    function updateCart() {
        localStorage.setItem('nova_cart', JSON.stringify(cart));
        renderCart();
    }

    // Рендер
    function renderCart() {
        if (!cartBadge || !cartItemsContainer || !cartTotalSum) return;

        const totalCount = cart.reduce((sum, item) => sum + item.count, 0);
        cartBadge.textContent = totalCount;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="cart-drawer__empty">Корзина пуста 😔</p>';
            cartTotalSum.textContent = '0 ₽';
            return;
        }

        let totalPrice = 0;
        cartItemsContainer.innerHTML = '';

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.count;
            totalPrice += itemTotal;

            const itemEl = document.createElement('div');
            itemEl.classList.add('cart-item');
            itemEl.innerHTML = `
                <img src="${item.img}" alt="${item.title}" class="cart-item__img">
                <div class="cart-item__details">
                    <div class="cart-item__title">${item.title}</div>
                    <div class="cart-item__price">${item.price.toLocaleString('ru-RU')} ₽</div>
                    <div class="cart-item__controls">
                        <button class="cart-item__btn" onclick="changeCount(${index}, -1)">-</button>
                        <span class="cart-item__count">${item.count}</span>
                        <button class="cart-item__btn" onclick="changeCount(${index}, 1)">+</button>
                        <button class="cart-item__remove" onclick="removeItem(${index})">&times;</button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(itemEl);
        });

        cartTotalSum.textContent = `${totalPrice.toLocaleString('ru-RU')} ₽`;
    }

    // Изменение количества
    window.changeCount = function(index, delta) {
        cart[index].count += delta;
        if (cart[index].count <= 0) {
            cart.splice(index, 1);
        }
        updateCart();
    };

    // Удаление товара
    window.removeItem = function(index) {
        cart.splice(index, 1);
        updateCart();
    };

    // Клики на кнопки "В корзину"
    document.querySelectorAll('.product-card').forEach(card => {
        const btn = card.querySelector('.btn');
        if (!btn || btn.disabled) return;

        btn.addEventListener('click', () => {
            const title = card.querySelector('.product-card__name').textContent;
            const priceText = card.querySelector('.product-card__price').textContent;
            const price = parseInt(priceText.replace(/\s/g, ''));
            const img = card.querySelector('img').src;

            const existingIndex = cart.findIndex(item => item.title === title);

            if (existingIndex > -1) {
                cart[existingIndex].count += 1;
            } else {
                cart.push({ title, price, img, count: 1 });
            }

            updateCart();
            toggleCart();
        });
    });

    // Оформить заказ
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) return alert('Ваша корзина пуста!');
            alert('🎉 Спасибо за заказ! Данные отправлены (имитация).');
            cart = [];
            updateCart();
            toggleCart();
        });
    }

    renderCart();
});