/**
 * VR-ZONE E-COMMERCE JAVASCRIPT ENGINE
 * Handles: Cart, Modals, Gallery, Pricing, Bundles, Checkout, Installments, Language Switch
 */

// Application State
const state = {
  currentLang: 'ua',
  selectedMemory: '128',
  basePrice128: 23000,
  oldPrice128: 24999,
  basePrice512: 30999,
  oldPrice512: 33499,
  bundleAddons: {
    strap: { name: 'Ремінь Elite Strap з батареєю', price: 2799, checked: false, img: 'images/quest3_side.jpg' },
    cable: { name: 'Оптичний кабель Link Cable 5м USB-C', price: 1890, checked: false, img: 'images/quest3_display.jpg' },
    silicone: { name: 'Силіконовий захисний чохол для обличчя', price: 590, checked: false, img: 'images/quest3_top.jpg' }
  },
  cart: [],
  promoDiscount: 0,
  isFavorite: false
};

// Translations
const translations = {
  ua: {
    city: 'Київ',
    workHours: 'Пн-Нд 09:00 - 21:00',
    deliveryNav: 'Доставка і оплата',
    warrantyNav: 'Гарантія 12 міс',
    contactsNav: 'Контакти',
    catalogBtn: 'Каталог товарів',
    searchPlaceholder: 'Пошук серед VR шоломів та аксесуарів...',
    favorites: 'Обране',
    compare: 'Порівняти',
    cart: 'Кошик',
    breadcrumbHome: 'Головна',
    breadcrumbCat: 'Віртуальна реальність',
    breadcrumbMeta: 'Шоломи Meta',
    badgeHit: 'Хіт продажу',
    badgeSale: 'Знижка -8%',
    badgeOfficial: 'Офіційна гарантія 12 міс',
    productTitle128: 'Шолом віртуальної реальності Meta Quest 3 128 GB (899-00583-01)',
    productTitle512: 'Шолом віртуальної реальності Meta Quest 3 512 GB (899-00584-01)',
    reviewsCount: '142 відгуки',
    inStock: 'В наявності (відправка сьогодні)',
    memoryLabel: 'Вбудована пам\'ять:',
    buyBtn: 'Купити',
    oneClickBtn: 'Купити в 1 клік',
    installmentBtn: 'Оплата частинами від 2 300 ₴/міс',
    toastAdded: 'Товар успішно додано до кошика!',
    toastFavAdd: 'Додано в список обраного',
    toastFavRem: 'Видалено зі списку обраного'
  },
  ru: {
    city: 'Киев',
    workHours: 'Пн-Вс 09:00 - 21:00',
    deliveryNav: 'Доставка и оплата',
    warrantyNav: 'Гарантия 12 мес',
    contactsNav: 'Контакты',
    catalogBtn: 'Каталог товаров',
    searchPlaceholder: 'Поиск среди VR шлемов и аксессуаров...',
    favorites: 'Избранное',
    compare: 'Сравнить',
    cart: 'Корзина',
    breadcrumbHome: 'Главная',
    breadcrumbCat: 'Виртуальная реальность',
    breadcrumbMeta: 'Шлемы Meta',
    badgeHit: 'Хит продаж',
    badgeSale: 'Скидка -8%',
    badgeOfficial: 'Официальная гарантия 12 мес',
    productTitle128: 'Шлем виртуальной реальности Meta Quest 3 128 GB (899-00583-01)',
    productTitle512: 'Шлем виртуальной реальности Meta Quest 3 512 GB (899-00584-01)',
    reviewsCount: '142 отзыва',
    inStock: 'В наличии (отправка сегодня)',
    memoryLabel: 'Встроенная память:',
    buyBtn: 'Купить',
    oneClickBtn: 'Купить в 1 клик',
    installmentBtn: 'Оплата частями от 2 300 ₴/мес',
    toastAdded: 'Товар успешно добавлен в корзину!',
    toastFavAdd: 'Добавлено в список избранного',
    toastFavRem: 'Удалено из списка избранного'
  }
};

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initGallery();
  initMemorySelector();
  initBundleAddons();
  initTabs();
  initCart();
  initModals();
  initLanguage();
  initInteractiveHelpers();
});

// Format Currency
function formatMoney(amount) {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₴";
}

// 1. Gallery
function initGallery() {
  const mainImg = document.getElementById('mainProductImg');
  const thumbs = document.querySelectorAll('.thumb-btn');
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      const targetSrc = thumb.getAttribute('data-img');
      mainImg.style.opacity = '0.3';
      setTimeout(() => {
        mainImg.src = targetSrc;
        mainImg.style.opacity = '1';
      }, 150);
    });
  });

  // Lightbox
  const frame = document.querySelector('.main-image-frame');
  frame.addEventListener('click', () => {
    lightboxImg.src = mainImg.src;
    lightbox.classList.add('open');
  });

  lightbox.addEventListener('click', () => {
    lightbox.classList.remove('open');
  });
}

// 2. Memory Variant Selector
function initMemorySelector() {
  const cards = document.querySelectorAll('.memory-card');
  const currentPriceEl = document.getElementById('productPrice');
  const oldPriceEl = document.getElementById('productOldPrice');
  const discountSavingEl = document.getElementById('discountSaving');
  const titleEl = document.getElementById('productMainTitle');
  const installmentText = document.getElementById('installmentText');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const mem = card.getAttribute('data-memory');
      state.selectedMemory = mem;

      if (mem === '128') {
        currentPriceEl.innerHTML = `23 000 <span>₴</span>`;
        oldPriceEl.textContent = '24 999 ₴';
        discountSavingEl.textContent = 'Економія 1 999 ₴ (-8%)';
        titleEl.textContent = translations[state.currentLang].productTitle128;
        if (installmentText) installmentText.textContent = 'Оплата частинами від 2 300 ₴/міс';
      } else {
        currentPriceEl.innerHTML = `30 999 <span>₴</span>`;
        oldPriceEl.textContent = '33 499 ₴';
        discountSavingEl.textContent = 'Економія 2 500 ₴ (-7%)';
        titleEl.textContent = translations[state.currentLang].productTitle512;
        if (installmentText) installmentText.textContent = 'Оплата частинами від 3 100 ₴/міс';
      }

      showToast(`Обрано конфігурацію: Meta Quest 3 ${mem} GB`);
    });
  });
}

// 3. Bundle Addons
function initBundleAddons() {
  const checkboxes = document.querySelectorAll('.bundle-check');
  checkboxes.forEach(cb => {
    cb.addEventListener('change', (e) => {
      const addonKey = e.target.getAttribute('data-addon');
      if (state.bundleAddons[addonKey]) {
        state.bundleAddons[addonKey].checked = e.target.checked;
        const addon = state.bundleAddons[addonKey];
        if (e.target.checked) {
          showToast(`Додано до бандлу: ${addon.name} (+${formatMoney(addon.price)})`);
        }
      }
    });
  });
}

// 4. Tabs
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // Link from review count
  const reviewsLink = document.getElementById('jumpToReviews');
  if (reviewsLink) {
    reviewsLink.addEventListener('click', () => {
      const reviewTab = document.querySelector('[data-tab="tab-reviews"]');
      if (reviewTab) reviewTab.click();
      document.querySelector('.tabs-container').scrollIntoView({ behavior: 'smooth' });
    });
  }
}

// 5. Cart Management
function initCart() {
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOpenBtns = document.querySelectorAll('.btn-open-cart');
  const cartCloseBtns = document.querySelectorAll('.cart-close-btn');
  const btnBuyMain = document.getElementById('btnBuyMain');

  cartOpenBtns.forEach(b => b.addEventListener('click', (e) => {
    e.preventDefault();
    openCart();
  }));

  cartCloseBtns.forEach(b => b.addEventListener('click', closeCart));

  if (btnBuyMain) {
    btnBuyMain.addEventListener('click', () => {
      const price = state.selectedMemory === '128' ? state.basePrice128 : state.basePrice512;
      const title = state.selectedMemory === '128' 
        ? 'Шолом віртуальної реальності Meta Quest 3 128 GB' 
        : 'Шолом віртуальної реальності Meta Quest 3 512 GB';

      addToCart({
        id: `quest3-${state.selectedMemory}`,
        title: title,
        sub: `Конфігурація: ${state.selectedMemory} GB • Офіційна гарантія 12 міс`,
        price: price,
        img: 'images/quest3_headset.jpg',
        qty: 1
      });

      // Add checked bundle addons
      Object.keys(state.bundleAddons).forEach(key => {
        const item = state.bundleAddons[key];
        if (item.checked) {
          addToCart({
            id: `addon-${key}`,
            title: item.name,
            sub: 'Фірмовий аксесуар зі знижкою',
            price: item.price,
            img: item.img || 'images/quest3_controller.jpg',
            qty: 1
          });
        }
      });

      openCart();
      showToast(translations[state.currentLang].toastAdded);
    });
  }

  // Mini recommended items buy buttons
  document.querySelectorAll('.btn-mini-buy').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const title = btn.getAttribute('data-title');
      const price = parseInt(btn.getAttribute('data-price'), 10);
      const img = btn.getAttribute('data-img');

      addToCart({
        id: id,
        title: title,
        sub: 'Аксесуар / Супутній товар',
        price: price,
        img: img,
        qty: 1
      });
      openCart();
      showToast(`Додано: ${title}`);
    });
  });

  // Promo code
  const promoBtn = document.getElementById('applyPromoBtn');
  const promoInput = document.getElementById('promoCodeInput');
  if (promoBtn && promoInput) {
    promoBtn.addEventListener('click', () => {
      const code = promoInput.value.trim().toUpperCase();
      if (code === 'QUEST' || code === 'META2026' || code === 'VRZONE') {
        state.promoDiscount = 500;
        showToast('Промокод активовано! Знижка 500 ₴ нарахована');
        renderCart();
      } else if (code) {
        showToast('Невірний або застарілий промокод');
      }
    });
  }
}

function addToCart(item) {
  const existing = state.cart.find(i => i.id === item.id);
  if (existing) {
    existing.qty += item.qty;
  } else {
    state.cart.push(item);
  }
  renderCart();
}

function updateCartQty(id, delta) {
  const item = state.cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    state.cart = state.cart.filter(i => i.id !== id);
  }
  renderCart();
}

function renderCart() {
  const listEl = document.getElementById('cartItemsList');
  const countBadges = document.querySelectorAll('.cart-badge-count');
  const cartHeaderSum = document.getElementById('cartHeaderSum');
  const totalSumEl = document.getElementById('cartTotalSum');
  const promoRow = document.getElementById('cartPromoRow');
  const promoDiscountSum = document.getElementById('promoDiscountSum');

  const totalItems = state.cart.reduce((acc, i) => acc + i.qty, 0);
  countBadges.forEach(b => b.textContent = totalItems);

  let subtotal = state.cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
  let finalTotal = Math.max(0, subtotal - state.promoDiscount);

  if (cartHeaderSum) {
    cartHeaderSum.textContent = formatMoney(finalTotal);
  }

  if (totalSumEl) {
    totalSumEl.textContent = formatMoney(finalTotal);
  }

  if (promoRow && promoDiscountSum) {
    if (state.promoDiscount > 0) {
      promoRow.style.display = 'flex';
      promoDiscountSum.textContent = `-${formatMoney(state.promoDiscount)}`;
    } else {
      promoRow.style.display = 'none';
    }
  }

  if (!listEl) return;

  if (state.cart.length === 0) {
    listEl.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: #64748b;">
        <svg style="width: 60px; height: 60px; margin-bottom: 12px; stroke: #94a3b8;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <p style="font-size: 16px; font-weight: 600; color: #0f172a;">Ваш кошик порожній</p>
        <p style="font-size: 13px; margin-top: 4px;">Виберіть Meta Quest 3 або аксесуари та натисніть «Купити»</p>
      </div>
    `;
    return;
  }

  listEl.innerHTML = state.cart.map(item => `
    <div class="cart-item-row">
      <img src="${item.img}" class="cart-item-img" alt="${item.title}">
      <div class="cart-item-info">
        <div class="cart-item-title">${item.title}</div>
        <div class="cart-item-sub">${item.sub}</div>
        <div class="cart-item-controls">
          <div class="qty-counter">
            <button class="qty-btn" onclick="updateCartQty('${item.id}', -1)">-</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" onclick="updateCartQty('${item.id}', 1)">+</button>
          </div>
          <div class="cart-item-price">${formatMoney(item.price * item.qty)}</div>
        </div>
      </div>
    </div>
  `).join('');
}

function openCart() {
  renderCart();
  const modal = document.getElementById('cartDrawer');
  if (modal) modal.classList.add('open');
}

function closeCart() {
  const modal = document.getElementById('cartDrawer');
  if (modal) modal.classList.remove('open');
}

// 6. Modals (1-Click, Installment, Full Checkout)
function initModals() {
  // 1-Click Modal
  const oneClickModal = document.getElementById('oneClickModal');
  const btnOneClick = document.getElementById('btnOneClick');
  const formOneClick = document.getElementById('formOneClick');

  if (btnOneClick && oneClickModal) {
    btnOneClick.addEventListener('click', () => {
      document.getElementById('oneClickProductName').textContent = 
        `Meta Quest 3 ${state.selectedMemory}GB (${formatMoney(state.selectedMemory === '128' ? state.basePrice128 : state.basePrice512)})`;
      oneClickModal.classList.add('open');
    });
  }

  if (formOneClick) {
    formOneClick.addEventListener('submit', (e) => {
      e.preventDefault();
      const phone = document.getElementById('oneClickPhone').value;
      const orderNum = Math.floor(100000 + Math.random() * 900000);
      oneClickModal.classList.remove('open');
      showSuccessModal(`Дякуємо! Швидке замовлення №${orderNum} оформлено. Ми зателефонуємо на номер ${phone} протягом 5 хвилин для підтвердження доставки.`);
    });
  }

  // Installment Modal
  const installmentModal = document.getElementById('installmentModal');
  const btnInstallment = document.getElementById('btnInstallment');
  if (btnInstallment && installmentModal) {
    btnInstallment.addEventListener('click', () => {
      installmentModal.classList.add('open');
    });
  }

  // Checkout Modal
  const checkoutModal = document.getElementById('checkoutModal');
  const btnCheckoutTrigger = document.getElementById('btnCheckoutTrigger');
  const formCheckout = document.getElementById('formCheckout');

  if (btnCheckoutTrigger) {
    btnCheckoutTrigger.addEventListener('click', () => {
      if (state.cart.length === 0) {
        showToast('Спочатку додайте товари до кошика!');
        return;
      }
      closeCart();
      checkoutModal.classList.add('open');
      document.getElementById('checkoutOrderTotal').textContent = 
        formatMoney(state.cart.reduce((acc, i) => acc + (i.price * i.qty), 0) - state.promoDiscount);
    });
  }

  if (formCheckout) {
    formCheckout.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('checkoutName').value;
      const phone = document.getElementById('checkoutPhone').value;
      const city = document.getElementById('checkoutCity').value;
      const orderNum = Math.floor(100000 + Math.random() * 900000);

      checkoutModal.classList.remove('open');
      state.cart = [];
      renderCart();

      showSuccessModal(`Вітаємо, ${name}! Ваше замовлення №${orderNum} успішно прийнято. Відправка до м. ${city} запланована на сьогодні. Деталі та номер ТТН надіслано на ${phone}.`);
    });
  }

  // Generic close buttons
  document.querySelectorAll('.modal-close-generic').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
    });
  });
}

function showSuccessModal(message) {
  const successModal = document.getElementById('successModal');
  const textEl = document.getElementById('successModalText');
  if (successModal && textEl) {
    textEl.textContent = message;
    successModal.classList.add('open');
  } else {
    alert(message);
  }
}

// 7. Language Switcher
function initLanguage() {
  const uaBtn = document.getElementById('langUa');
  const ruBtn = document.getElementById('langRu');

  if (uaBtn && ruBtn) {
    uaBtn.addEventListener('click', () => switchLanguage('ua'));
    ruBtn.addEventListener('click', () => switchLanguage('ru'));
  }
}

function switchLanguage(lang) {
  state.currentLang = lang;
  document.getElementById('langUa').classList.toggle('active', lang === 'ua');
  document.getElementById('langRu').classList.toggle('active', lang === 'ru');

  const dict = translations[lang];
  document.getElementById('topCity').textContent = dict.city;
  document.getElementById('topHours').textContent = dict.workHours;
  document.getElementById('topDelivery').textContent = dict.deliveryNav;
  document.getElementById('topWarranty').textContent = dict.warrantyNav;
  document.getElementById('topContacts').textContent = dict.contactsNav;
  document.getElementById('catalogBtnText').textContent = dict.catalogBtn;
  document.getElementById('mainSearchInput').placeholder = dict.searchPlaceholder;
  document.getElementById('productMainTitle').textContent = 
    state.selectedMemory === '128' ? dict.productTitle128 : dict.productTitle512;

  showToast(lang === 'ua' ? 'Мову змінено на українську' : 'Язык переключен на русский');
}

// 8. Wishlist & Interactive Helpers
function initInteractiveHelpers() {
  const favBtn = document.getElementById('favBtn');
  const favHeaderBadge = document.getElementById('favHeaderBadge');

  if (favBtn) {
    favBtn.addEventListener('click', () => {
      state.isFavorite = !state.isFavorite;
      favBtn.classList.toggle('active', state.isFavorite);
      if (favHeaderBadge) favHeaderBadge.textContent = state.isFavorite ? '1' : '0';
      showToast(state.isFavorite ? translations[state.currentLang].toastFavAdd : translations[state.currentLang].toastFavRem);
    });
  }

  // Live 360 preview demo
  const btn360 = document.getElementById('btn360');
  if (btn360) {
    btn360.addEventListener('click', () => {
      showToast('360° інтерактивний огляд: потягніть мишкою для обертання');
    });
  }
}

// Toast Notifications
function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg style="width: 20px; height: 20px; color: #10b981; flex-shrink: 0;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = 'all 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
