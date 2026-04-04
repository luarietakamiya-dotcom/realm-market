/* Quiet Market Logic - Beautiful Fantasy Version (Japanese) */

// --- Data Layer ---
const KEYS = {
    USER: 'quiet_user',
    PRODUCTS: 'quiet_products',
    PURCHASES: 'quiet_purchases'
  };
  
  const CATEGORIES = ['ぬいぐるみ', 'フィギュア', '衣装', '靴', 'アクセサリー', '帽子', 'フード', 'その他'];
  
  const part1 = [
    "旅人","収集家","観測者","商人","訪問者",
    "記録者","目撃者","保管者","拾い主","放浪者",
    "案内人","運び手","語り手","探し人","見張り",
    "配達人","管理人","徘徊者","受取人","仲介者"
  ];
  
  const part2 = [
    "静かな","名もなき","遠くから来た","通りすがりの",
    "少し眠い","古い","忘れられた","夜に歩く",
    "曖昧な","気のせいの","かすかな","どこかの",
    "長く留まる","一度消えた","遅れてきた","影のような",
    "ぼんやりした","名前を持たない","誰かだった","境界にいる"
  ];
  
  const part3 = [
    "", "", "", "", "", "", "", "", "", "",
    "のようなもの","だった気がする","かもしれない",
    "ではない何か","に似ている","のままでいる",
    "だったはず","でしかない","になりかけた","の記憶"
  ];
  
  function random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  
  function generateName() {
    return random(part2) + random(part1) + random(part3);
  }
  
  function getUser() {
    const data = localStorage.getItem(KEYS.USER);
    if (data) return JSON.parse(data);
    
    const newUser = {
      displayName: generateName(),
      coins: 1000
    };
    localStorage.setItem(KEYS.USER, JSON.stringify(newUser));
    return newUser;
  }
  
  function saveUser(user) {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  }
  
  const SAMPLE_PRODUCTS = [
    {
      id: 'sample-1',
      name: '忘れられたロケット',
      description: '小さな銀色のロケット。触れると冷たく、いくら力を込めても開くことはない。',
      price: 120,
      category: 'アクセサリー',
      image: 'https://images.unsplash.com/photo-1614882068224-b5ab58ffb4d7?auto=format&fit=crop&q=80&w=600&h=400',
      creator: '遠くの旅人',
      createdAt: Date.now() - 1000000
    },
    {
      id: 'sample-2',
      name: 'すり切れた手帳',
      description: 'ページには几帳面な筆跡が残っているが、インクは色褪せて読むことができない。雨の匂いがする。',
      price: 45,
      category: 'アクセサリー',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600&h=400',
      creator: '静かな観察者',
      createdAt: Date.now() - 500000
    },
    {
        id: 'sample-3',
        name: '星明かりの外套',
        description: '流れ星の糸で織られたマント。暗闇の中で微かに煌めく。',
        price: 350,
        category: '衣装',
        image: 'https://images.unsplash.com/photo-1574315042784-098cf311c6d3?auto=format&fit=crop&q=80&w=600&h=400',
        creator: '彷徨う商人',
        createdAt: Date.now() - 200000
    }
  ];
  
  function getProducts() {
    const data = localStorage.getItem(KEYS.PRODUCTS);
    let products = [];
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.length > 0) products = parsed;
    }
    
    if (products.length === 0) {
      products = [...SAMPLE_PRODUCTS];
    } else {
      // Migrate old English creator names to random Japanese names
      let migrated = false;
      products = products.map(p => {
        if (p.creator && p.creator.match(/^[a-zA-Z\s]+$/)) { // If creator is mostly ascii/english
          p.creator = generateName();
          migrated = true;
        }
        return p;
      });
      if (migrated) saveProducts(products);
    }
    
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
    return products;
  }
  
  function saveProducts(products) {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
  }
  
  function savePurchase(product) {
    const purchases = localStorage.getItem(KEYS.PURCHASES);
    const parsed = purchases ? JSON.parse(purchases) : [];
    parsed.push({ product: product.id, date: Date.now() });
    localStorage.setItem(KEYS.PURCHASES, JSON.stringify(parsed));
  }
  
  // --- UI / Render Layer ---
  let currentView = 'home'; // 'home' | 'add'
  let currentCategory = 'すべて';
  
  function showMessage(msg) {
    const container = document.getElementById('toast-layer');
    const toast = document.createElement('div');
    toast.className = 'quiet-toast';
    toast.innerText = msg;
    container.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 1s ease';
      setTimeout(() => toast.remove(), 1000);
    }, 4000);
  }
  
  function handlePurchase(product) {
    const user = getUser();
    if (user.coins >= product.price) {
      user.coins -= product.price;
      saveUser(user);
      savePurchase(product);
      showMessage('アイテムが静かにコレクションに加わりました。');
      render(); // Update balance
    } else {
      showMessage('この記憶を手に入れるにはコインが足りません...');
    }
  }
  
  function handleAddProduct(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const desc = form.desc.value.trim();
    const price = parseInt(form.price.value, 10);
    const cat = form.category.value;
    const image = form.image.value.trim();
    const creatorName = form.creator_name.value.trim();
  
    if (!name || isNaN(price) || !creatorName) return;
  
    const products = getProducts();
    // Use the new generator for new products so it's fresh each time, except creator is usually the current user's displayName.
    // The user requirement said "出品者はランダムで表記" ("Seller should be listed randomly"). Let's assign a new random name per product instead of using the user's display name.
    
    products.unshift({
      id: Date.now().toString(),
      name,
      description: desc,
      price,
      category: cat,
      image,
      creator: creatorName,
      createdAt: Date.now()
    });
    saveProducts(products);
  
    const user = getUser();
    user.coins += 100;
    saveUser(user);
  
    showMessage('捧げ物が受け入れられました。ささやかな報酬が追加されました。');
    currentView = 'home';
    render();
  }

  function showImageModal(src) {
    const overlay = document.createElement('div');
    overlay.className = 'image-modal-overlay';
    
    const img = document.createElement('img');
    img.className = 'image-modal-content';
    img.src = src;

    overlay.appendChild(img);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', () => {
        overlay.style.animation = 'none';
        overlay.style.opacity = '1';
        overlay.style.transition = 'opacity 0.3s ease';
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 300);
    });
  }
  
  // --- Templates ---
  function renderHeader() {
    const user = getUser();
    return `
      <div class="header-logo-area">
        <img src="/logo.png" class="site-logo" alt="深き森の雑貨市場" onerror="this.style.display='none'">
      </div>
      <div class="header-area">
        <div class="user-info">
          <div class="user-identity">${user.displayName}</div>
          <div class="user-balance">✨ ${user.coins} Astral Coins</div>
        </div>
        <div class="nav-actions">
          <button class="btn-nav ${currentView === 'home' ? 'active' : ''}" id="nav-home">マーケット</button>
          <button class="btn-nav ${currentView === 'add' ? 'active' : ''}" id="nav-add">出品する</button>
        </div>
      </div>
    `;
  }
  
  function renderFeed() {
    let products = getProducts();

    if (currentCategory !== 'すべて') {
        products = products.filter(p => p.category === currentCategory);
    }

    const filterHTML = `
      <div class="rules-notice" style="margin: 0 auto 24px auto; padding: 16px; background: rgba(142, 153, 245, 0.05); border: 1px solid rgba(142, 153, 245, 0.2); border-radius: 8px; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6;">
        登録された商品はフリー素材としてDLして自由に使えます。<br>
        節度を守り製作者に敬意を払って使用しましょう。
      </div>
      <div class="market-filter">
        <select id="category-filter">
            <option value="すべて" ${currentCategory === 'すべて' ? 'selected' : ''}>すべてのカテゴリ</option>
            ${CATEGORIES.map(c => `<option value="${c}" ${currentCategory === c ? 'selected' : ''}>${c}</option>`).join('')}
        </select>
      </div>
    `;

    if (products.length === 0) {
      return filterHTML + `<div class="empty-msg">虚空には何もありません...</div>`;
    }
  
    return `
      ${filterHTML}
      <div class="product-feed">
        ${products.map(p => `
          <div class="product-item">
            <div class="item-category">${p.category}</div>
            <div class="item-title">${escapeHtml(p.name)}</div>
            ${p.image ? `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" class="item-image" loading="lazy" data-modal-image="${escapeHtml(p.image)}"/>` : ''}
            <div class="item-desc">${escapeHtml(p.description)}</div>
            <div class="item-footer">
              <div class="item-meta">
                <span class="item-price">✨ ${p.price}</span>
                <span class="item-seller">${escapeHtml(p.creator)}</span>
              </div>
              <button class="btn-buy" data-id="${p.id}">受け取る</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
  
  function renderAddView() {
    return `
      <div class="rules-notice" style="margin: 0 auto 24px auto; max-width: 500px; padding: 16px; background: rgba(142, 153, 245, 0.05); border: 1px solid rgba(142, 153, 245, 0.2); border-radius: 8px; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6;">
        登録者は自分で作った画像のみを登録してください。<br>
        登録した画像はフリー素材として配布するものとします。
      </div>
      <form class="form-area" id="add-form">
        <div class="form-group">
          <label>出品者名</label>
          <div style="display: flex; gap: 8px;">
            <input name="creator_name" id="input-creator-name" class="form-control" type="text" style="flex-grow: 1;" value="${generateName()}" required />
            <button type="button" id="btn-random-name" class="btn-ghost" style="padding: 12px; border-radius: 6px; border: 1px solid var(--glass-border); color: var(--text-primary); cursor: pointer; background: rgba(0,0,0,0.4);">ランダム</button>
          </div>
        </div>
        <div class="form-group">
          <label>アイテム名</label>
          <input name="name" class="form-control" type="text" required />
        </div>
        <div class="form-group">
          <label>物語 / 説明</label>
          <textarea name="desc" class="form-control" maxlength="300"></textarea>
        </div>
        <div class="form-group">
          <label>対価 (Astral Coins)</label>
          <input name="price" class="form-control" type="number" min="1" max="9999" required />
        </div>
        <div class="form-group">
          <label>カテゴリ</label>
          <select name="category" class="form-control">
            ${CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>記憶の画像URL (任意)</label>
          <input name="image" class="form-control" type="url" placeholder="https://..." />
        </div>
        <button type="submit" class="btn-primary form-submit">虚空へ捧げる</button>
      </form>
    `;
  }
  
  function escapeHtml(str) {
    if (!str) return '';
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }
  
  // --- Main Render Logic ---
  function render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      ${renderHeader()}
      <div>
        ${currentView === 'home' ? renderFeed() : renderAddView()}
      </div>
    `;
  
    // Bind Events
    document.getElementById('nav-home').addEventListener('click', () => { currentView = 'home'; render(); });
    document.getElementById('nav-add').addEventListener('click', () => { currentView = 'add'; render(); });
  
    if (currentView === 'home') {
      // Category Filter Binding
      const filterSelect = document.getElementById('category-filter');
      if (filterSelect) {
        filterSelect.addEventListener('change', (e) => {
            currentCategory = e.target.value;
            render();
        });
      }

      const products = getProducts();
      const btns = document.querySelectorAll('.btn-buy');
      btns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.target.dataset.id;
          const prod = products.find(p => p.id === id);
          if (prod) handlePurchase(prod);
        });
      });

      // Image click bindings
      const images = document.querySelectorAll('.item-image');
      images.forEach(img => {
          img.addEventListener('click', (e) => {
              const src = e.target.getAttribute('data-modal-image');
              if (src) showImageModal(src);
          });
      })
    } else {
      document.getElementById('add-form').addEventListener('submit', handleAddProduct);
      document.getElementById('btn-random-name').addEventListener('click', () => {
        document.getElementById('input-creator-name').value = generateName();
      });
    }
  }
  
  // --- Init ---
  document.addEventListener('DOMContentLoaded', () => {
    // Migrate any existing english categories or non-japanese names by forcing sample replacement if needed
    // In this specific task, we'll let existing localstorage entries persist, but categories will mismatch.
    render();
  });
