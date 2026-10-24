// ================= DATA & INITIAL STATE =================
const INITIAL_PRODUCTS = [
  {
    id: 1,
    title: "هاتف آيفون 15 برو ماكس 256GB",
    category: "إلكترونيات",
    price: 4899,
    oldPrice: 5299,
    badge: "الأكثر طلباً 🔥",
    rating: 4.9,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=80",
    description: "شاشة Super Retina XDR مع تيتانيوم قوي وخفيف وكاميرا احترافية بدقة 48 ميجابكسل."
  },
  {
    id: 2,
    title: "ساعة آبل الذكية Ultra 2 - تيتانيوم",
    category: "ساعات",
    price: 3199,
    oldPrice: 3499,
    badge: "خصم 10%",
    rating: 4.8,
    reviews: 94,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&auto=format&fit=crop&q=80",
    description: "شاشة ساطعة للغاية، بطارية تدوم حتى 72 ساعة في نمط الطاقة المنخفضة."
  },
  {
    id: 3,
    title: "سماعات سوني اللاسلكية WH-1000XM5",
    category: "إلكترونيات",
    price: 1250,
    oldPrice: 1450,
    badge: "عازل للضوضاء",
    rating: 4.9,
    reviews: 210,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=80",
    description: "تقنية رائدة عالمياً في عزل الضوضاء وصوت نقي وعمر بطارية حتى 30 ساعة."
  },
  {
    id: 4,
    title: "حذاء رياضي نايكي Air Max 270",
    category: "أزياء",
    price: 649,
    oldPrice: 799,
    badge: "جديد ✨",
    rating: 4.7,
    reviews: 65,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80",
    description: "تصميم عصري فائق الراحة بنعل هوائي مرن للجري والتمارين اليومية."
  },
  {
    id: 5,
    title: "عطر ديور سوفاج أو دو بارفان 100 مل",
    category: "عطور",
    price: 580,
    oldPrice: 650,
    badge: "فاخر",
    rating: 4.9,
    reviews: 312,
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&auto=format&fit=crop&q=80",
    description: "مزيج منعش من البرغموت ولمسات العنبر الدافئة برائحة جذابة تدوم طويلاً."
  },
  {
    id: 6,
    title: "نظارة الواقع الافتراضي Meta Quest 3",
    category: "ألعاب",
    price: 2199,
    oldPrice: 2400,
    badge: "موصى به",
    rating: 4.8,
    reviews: 87,
    image: "https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=500&auto=format&fit=crop&q=80",
    description: "عش تجربة الواقع المختلط الرائعة مع دقة وضوح مذهلة وصوت محيطي 3D."
  }
];

let products = [...INITIAL_PRODUCTS];
let cart = [
  { ...INITIAL_PRODUCTS[0], qty: 1 }
];

let orders = [
  {
    id: "ORD-9410",
    customer: "أحمد منصور",
    phone: "0501234567",
    items: "هاتف آيفون 15 برو ماكس (1)",
    total: 4899,
    status: "done",
    time: "منذ 15 دقيقة"
  },
  {
    id: "ORD-9409",
    customer: "سارة العتيبي",
    phone: "0559876543",
    items: "ساعة آبل Ultra 2 (1), عطر ديور سوفاج (1)",
    total: 3779,
    status: "pending",
    time: "منذ ساعتين"
  }
];

let currentCategory = "الكل";
let currentSearch = "";
let currentAdminTab = "orders"; // orders, products

// ================= INITIALIZATION =================
document.addEventListener('DOMContentLoaded', () => {
  initClock();
  renderProducts();
  renderCart();
  renderAdminOrders();
  renderAdminProducts();
  updateAdminKPIs();
  setupEventListeners();
});

// Realtime Clock on Android Status Bar
function initClock() {
  function updateTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'م' : 'ص';
    hours = hours % 12 || 12;
    const timeStr = `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
    document.querySelectorAll('.status-time').forEach(el => el.textContent = timeStr);
  }
  updateTime();
  setInterval(updateTime, 30000);
}

// ================= STORE RENDERING =================
function renderProducts() {
  const container = document.getElementById('productsGrid');
  if (!container) return;

  const filtered = products.filter(p => {
    const matchesCat = currentCategory === "الكل" || p.category === currentCategory;
    const matchesSearch = p.title.toLowerCase().includes(currentSearch.toLowerCase()) || 
                          p.category.toLowerCase().includes(currentSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: span 2; text-align: center; padding: 30px; color: #94a3b8;">
        <span style="font-size: 32px; display: block; margin-bottom: 6px;">🔍</span>
        <p style="font-size: 12px; font-weight: 700;">لا توجد منتجات مطابقة للبحث</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(p => `
    <div class="product-card">
      <div class="product-thumb">
        <img src="${p.image}" alt="${p.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80'">
        ${p.badge ? `<span class="badge-tag">${p.badge}</span>` : ''}
      </div>
      <div class="product-info">
        <span class="product-category">${p.category}</span>
        <h4 class="product-title" title="${p.title}">${p.title}</h4>
        <div class="product-rating">
          <span>★</span> <strong>${p.rating}</strong>
          <span class="rating-count">(${p.reviews})</span>
        </div>
        <div class="price-row">
          <div class="price-wrap">
            <span class="main-price">${p.price.toLocaleString()} ر.س</span>
            ${p.oldPrice ? `<span class="old-price">${p.oldPrice.toLocaleString()} ر.س</span>` : ''}
          </div>
          <button class="add-btn" onclick="addToCart(${p.id})" title="أضف للسلة">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// ================= CART LOGIC =================
function addToCart(productId) {
  const prod = products.find(p => p.id === productId);
  if (!prod) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...prod, qty: 1 });
  }

  renderCart();
  showToast("تمت الإضافة للسلة 🛍️", prod.title, "store");

  // Animate cart tab badge
  const badge = document.getElementById('cartBadge');
  if (badge) {
    badge.classList.remove('bounce');
    void badge.offsetWidth;
    badge.classList.add('bounce');
  }
}

function updateQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }
  renderCart();
}

function renderCart() {
  const count = cart.reduce((acc, i) => acc + i.qty, 0);
  const badge = document.getElementById('cartBadge');
  const countEl = document.getElementById('cartCountText');
  
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
  if (countEl) countEl.textContent = `(${count} منتجات)`;

  const list = document.getElementById('cartItemsList');
  const subtotalEl = document.getElementById('cartSubtotal');
  const totalEl = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');

  if (!list) return;

  if (cart.length === 0) {
    list.innerHTML = `
      <div class="empty-cart-state">
        <span>🛒</span>
        <p style="font-weight: 700; color: #475569; font-size: 13px;">سلة التسوق فارغة</p>
        <p style="font-size: 11px;">تصفح المنتجات وأضف ما يعجبك إلى السلة</p>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = '0 ر.س';
    if (totalEl) totalEl.textContent = '0 ر.س';
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  if (checkoutBtn) checkoutBtn.disabled = false;

  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const shipping = subtotal > 500 ? 0 : 25;
  const total = subtotal + shipping;

  list.innerHTML = cart.map(item => `
    <div class="cart-item-row">
      <img src="${item.image}" alt="${item.title}" class="cart-item-img">
      <div class="cart-item-meta">
        <h5 class="cart-item-title">${item.title}</h5>
        <div class="cart-item-price">${(item.price * item.qty).toLocaleString()} ر.س</div>
      </div>
      <div class="cart-qty-ctrl">
        <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
        <span class="qty-val">${item.qty}</span>
        <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
      </div>
    </div>
  `).join('');

  if (subtotalEl) subtotalEl.textContent = `${subtotal.toLocaleString()} ر.س`;
  const shipEl = document.getElementById('cartShipping');
  if (shipEl) shipEl.textContent = shipping === 0 ? 'مجاني 🎉' : `${shipping} ر.س`;
  if (totalEl) totalEl.textContent = `${total.toLocaleString()} ر.س`;
}

function openCart() {
  document.getElementById('cartSheet').classList.add('open');
}

function closeCart() {
  document.getElementById('cartSheet').classList.remove('open');
}

// Checkout simulation: Connects Customer Store directly to Admin Panel!
function processCheckout() {
  if (cart.length === 0) return;

  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const total = subtotal > 500 ? subtotal : subtotal + 25;
  const orderNum = Math.floor(1000 + Math.random() * 9000);
  const newOrderId = `ORD-${orderNum}`;

  const summary = cart.map(i => `${i.title} (${i.qty})`).join('، ');

  // Add new order to Admin Panel
  orders.unshift({
    id: newOrderId,
    customer: "عميل تجريبي من التطبيق",
    phone: "0540001234",
    items: summary,
    total: total,
    status: "pending",
    time: "الآن"
  });

  // Empty cart
  cart = [];
  renderCart();
  closeCart();

  // Show Success dialog on store
  const successScreen = document.getElementById('orderSuccessScreen');
  document.getElementById('confirmedOrderNumber').textContent = `#${newOrderId}`;
  document.getElementById('confirmedOrderTotal').textContent = `${total.toLocaleString()} ر.س`;
  successScreen.classList.add('show');

  // Trigger sound effect notification if supported
  playBeep();

  // Show push notification on Admin Phone!
  showToast("🔔 إشعار طلب جديد!", `ورد طلب ${newOrderId} بقيمة ${total.toLocaleString()} ر.س`, "admin");

  // Re-render Admin App
  renderAdminOrders();
  updateAdminKPIs();
}

function closeSuccessScreen() {
  document.getElementById('orderSuccessScreen').classList.remove('show');
}

// Simple Web Audio API beep for realistic app sound
function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.18);
  } catch (e) {
    // Audio context may require user gesture on some browsers
  }
}

// ================= ADMIN PANEL RENDERING =================
function renderAdminOrders() {
  const container = document.getElementById('adminOrdersList');
  if (!container) return;

  container.innerHTML = orders.map(ord => `
    <div class="order-card">
      <div class="order-card-header">
        <div>
          <span class="order-id">#${ord.id}</span>
          <span class="order-time"> • ${ord.time}</span>
        </div>
        <span class="order-badge ${ord.status === 'done' ? 'badge-done' : 'badge-new'}">
          ${ord.status === 'done' ? 'مكتمل ✅' : 'جديد ⏳'}
        </span>
      </div>
      <div style="font-size: 11px; font-weight: 700; color: #1e293b;">
        👤 ${ord.customer} (${ord.phone})
      </div>
      <div class="order-items-preview">
        📦 ${ord.items}
      </div>
      <div class="order-total-price">
        <span>الإجمالي</span>
        <span>${ord.total.toLocaleString()} ر.س</span>
      </div>
      ${ord.status === 'pending' ? `
        <button onclick="markOrderCompleted('${ord.id}')" style="background: #e0f2fe; color: #0284c7; border: none; padding: 6px; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer; margin-top: 4px;">
          ✓ تأكيد وشحن الطلب
        </button>
      ` : ''}
    </div>
  `).join('');
}

function markOrderCompleted(orderId) {
  const ord = orders.find(o => o.id === orderId);
  if (ord) {
    ord.status = "done";
    renderAdminOrders();
    showToast("تحديث الطلب 🚚", `تم تغيير حالة ${orderId} إلى مكتمل`, "admin");
  }
}

function renderAdminProducts() {
  const container = document.getElementById('adminProductsList');
  if (!container) return;

  container.innerHTML = products.map(prod => `
    <div class="admin-prod-card">
      <img src="${prod.image}" alt="${prod.title}" class="admin-prod-img" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80'">
      <div class="admin-prod-info">
        <h5 class="admin-prod-title">${prod.title}</h5>
        <span class="admin-prod-price">${prod.price.toLocaleString()} ر.س</span>
        <span style="font-size: 10px; color: #94a3b8; display: block;">القسم: ${prod.category}</span>
      </div>
      <button class="del-prod-btn" onclick="deleteProduct(${prod.id})" title="حذف المنتج">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>
      </button>
    </div>
  `).join('');
}

function updateAdminKPIs() {
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const salesEl = document.getElementById('kpiSales');
  const countEl = document.getElementById('kpiOrdersCount');
  const prodsEl = document.getElementById('kpiProdsCount');

  if (salesEl) salesEl.textContent = `${totalSales.toLocaleString()} ر.س`;
  if (countEl) countEl.textContent = orders.length;
  if (prodsEl) prodsEl.textContent = products.length;
}

// Add New Product from Admin (instantly updates customer store!)
function openAddProductModal() {
  document.getElementById('addProductModal').classList.add('open');
}

function closeAddProductModal() {
  document.getElementById('addProductModal').classList.remove('open');
}

function submitNewProduct(e) {
  e.preventDefault();
  const title = document.getElementById('newProdTitle').value.trim();
  const price = parseFloat(document.getElementById('newProdPrice').value);
  const category = document.getElementById('newProdCategory').value;
  let image = document.getElementById('newProdImage').value.trim();

  if (!title || !price) return;

  if (!image) {
    image = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80";
  }

  const newProduct = {
    id: Date.now(),
    title: title,
    category: category,
    price: price,
    oldPrice: Math.round(price * 1.15),
    badge: "جديد مضاف ✨",
    rating: 5.0,
    reviews: 1,
    image: image,
    description: "منتج مضاف حديثاً من خلال تطبيق الإدارة."
  };

  products.unshift(newProduct);

  // Reset form & close
  document.getElementById('newProductForm').reset();
  closeAddProductModal();

  // Update UI in both Store and Admin
  renderProducts();
  renderAdminProducts();
  updateAdminKPIs();

  showToast("تمت إضافة المنتج بنجاح! 🚀", `ظهر الآن منتج "${title}" في تطبيق العميل`, "admin");
}

function deleteProduct(productId) {
  if (confirm("هل تريد حذف هذا المنتج من المتجر؟")) {
    products = products.filter(p => p.id !== productId);
    cart = cart.filter(p => p.id !== productId);
    renderProducts();
    renderCart();
    renderAdminProducts();
    updateAdminKPIs();
    showToast("تم حذف المنتج 🗑️", "تم تحديث قائمة المنتجات", "admin");
  }
}

// ================= TOAST SYSTEM =================
function showToast(title, desc, targetPhone = "store") {
  const toast = document.getElementById(targetPhone === "store" ? 'storeToast' : 'adminToast');
  if (!toast) return;

  toast.querySelector('.toast-title').textContent = title;
  toast.querySelector('.toast-desc').textContent = desc;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

// ================= TOP BAR CONTROLS =================
function setViewMode(mode) {
  const storePhone = document.getElementById('storePhoneWrapper');
  const adminPhone = document.getElementById('adminPhoneWrapper');
  const btns = document.querySelectorAll('.mode-btn');

  btns.forEach(btn => btn.classList.remove('active'));

  if (mode === 'dual') {
    document.getElementById('btnModeDual').classList.add('active');
    storePhone.style.display = 'flex';
    adminPhone.style.display = 'flex';
  } else if (mode === 'store') {
    document.getElementById('btnModeStore').classList.add('active');
    storePhone.style.display = 'flex';
    adminPhone.style.display = 'none';
  } else if (mode === 'admin') {
    document.getElementById('btnModeAdmin').classList.add('active');
    storePhone.style.display = 'none';
    adminPhone.style.display = 'flex';
  }
}

function setDeviceColor(colorHex, btn) {
  document.querySelectorAll('.phone-device').forEach(device => {
    device.style.backgroundColor = colorHex;
  });
  document.querySelectorAll('.device-color-dot').forEach(d => d.classList.remove('active'));
  btn.classList.add('active');
}

function switchAdminTab(tab) {
  currentAdminTab = tab;
  document.querySelectorAll('.adm-tab-btn').forEach(b => b.classList.remove('active'));
  if (tab === 'orders') {
    document.getElementById('tabBtnOrders').classList.add('active');
    document.getElementById('adminOrdersSection').style.display = 'block';
    document.getElementById('adminProductsSection').style.display = 'none';
  } else {
    document.getElementById('tabBtnProducts').classList.add('active');
    document.getElementById('adminOrdersSection').style.display = 'none';
    document.getElementById('adminProductsSection').style.display = 'block';
  }
}

// ================= EVENT LISTENERS =================
function setupEventListeners() {
  // Category chips
  document.querySelectorAll('.cat-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentCategory = chip.dataset.cat;
      renderProducts();
    });
  });

  // Search input
  const searchInput = document.getElementById('storeSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.trim();
      renderProducts();
    });
  }

  // Admin Product Form
  const newProductForm = document.getElementById('newProductForm');
  if (newProductForm) {
    newProductForm.addEventListener('submit', submitNewProduct);
  }
}
