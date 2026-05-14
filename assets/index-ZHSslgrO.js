const SUPABASE_URL = "https://rgxgyctjldxaussfnpoa.supabase.co";
const SUPABASE_KEY = "sb_publishable__QTQ21rRG0gLV_SySkFOKQ_61b2aqV0";
const PRODUCTS_ENDPOINT = `${SUPABASE_URL}/rest/v1/products`;
const STORAGE_BUCKET = "product-images";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const storageKeys = {
  USER: "quiet_user",
  PURCHASES: "quiet_purchases",
  LIKES: "quiet_likes"
};

const categories = ["ぬいぐるみ", "フィギュア", "衣装", "靴", "アクセサリー", "帽子", "フード", "その他"];
const nouns = ["旅人", "収集家", "観測者", "商人", "訪問者", "記録者", "目撃者", "保管者", "拾い主", "放浪者", "案内人", "運び手", "語り手", "探し人", "見張り", "配達人", "管理人", "徘徊者", "受取人", "仲介者"];
const prefixes = ["静かな", "名もなき", "遠くから来た", "通りすがりの", "少し眠い", "古い", "忘れられた", "夜に歩く", "曖昧な", "気のせいの", "かすかな", "どこかの", "長く留まる", "一度消えた", "遅れてきた", "影のような", "ぼんやりした", "名前を持たない", "誰かだった", "境界にいる"];
const suffixes = ["", "", "", "", "", "", "", "", "", "", "のようなもの", "だった気がする", "かもしれない", "ではない何か", "に似ている", "のままでいる", "だったはず", "でしかない", "になりかけた", "の記憶"];

let currentPage = "home";
let profileTab = "listed";
let currentCategory = "すべて";
let productCache = [];

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function randomName() {
  return pick(prefixes) + pick(nouns) + pick(suffixes);
}

function getUser() {
  const raw = localStorage.getItem(storageKeys.USER);
  if (raw) {
    const user = JSON.parse(raw);
    if (!user.id) {
      user.id = "user_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
      saveUser(user);
    }
    return user;
  }
  const user = {
    id: "user_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
    displayName: randomName(),
    coins: 1000
  };
  saveUser(user);
  return user;
}

function saveUser(user) {
  localStorage.setItem(storageKeys.USER, JSON.stringify(user));
}

function getPurchases() {
  const raw = localStorage.getItem(storageKeys.PURCHASES);
  return raw ? JSON.parse(raw) : [];
}

function savePurchase(product) {
  const purchases = getPurchases();
  purchases.push({ ...product, purchasedAt: Date.now() });
  localStorage.setItem(storageKeys.PURCHASES, JSON.stringify(purchases));
}

function getLikes() {
  const raw = localStorage.getItem(storageKeys.LIKES);
  return raw ? JSON.parse(raw) : [];
}

function saveLikes(likes) {
  localStorage.setItem(storageKeys.LIKES, JSON.stringify(likes));
}

function toggleLike(id) {
  let likes = getLikes();
  likes = likes.includes(id) ? likes.filter((itemId) => itemId !== id) : [...likes, id];
  saveLikes(likes);
}

function apiHeaders(extra = {}) {
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    ...extra
  };
}

function normalizeProduct(row) {
  return {
    id: row.id,
    name: row.name || "",
    description: row.description || "",
    price: Number(row.price || 0),
    category: row.category || "その他",
    image: row.image_url || "",
    creator: row.creator || "名もなき出品者",
    ownerId: row.owner_id || "",
    createdAt: row.created_at ? new Date(row.created_at).getTime() : Date.now()
  };
}

async function fetchProducts() {
  const url = `${PRODUCTS_ENDPOINT}?select=*&order=created_at.desc`;
  const response = await fetch(url, { headers: apiHeaders() });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Supabase error: ${response.status}`);
  }
  const rows = await response.json();
  productCache = rows.map(normalizeProduct);
  return productCache;
}

async function insertProduct(product) {
  const body = {
    name: product.name,
    description: product.description,
    price: Number(product.price || 0),
    category: product.category,
    image_url: product.image,
    creator: product.creator,
    owner_id: getUser().id
  };

  const response = await fetch(PRODUCTS_ENDPOINT, {
    method: "POST",
    headers: apiHeaders({
      "Content-Type": "application/json",
      Prefer: "return=representation"
    }),
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Supabase insert error: ${response.status}`);
  }
  const rows = await response.json();
  return rows[0] ? normalizeProduct(rows[0]) : null;
}

async function deleteProduct(id) {
  const response = await fetch(`${PRODUCTS_ENDPOINT}?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: apiHeaders()
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Supabase delete error: ${response.status}`);
  }
}

async function uploadProductImage(file) {
  if (!file) throw new Error("画像ファイルが選択されていません。");
  if (!file.type || !file.type.startsWith("image/")) {
    throw new Error("画像ファイルを選択してください。");
  }
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("画像サイズは5MB以下にしてください。");
  }

  const user = getUser();
  const originalName = file.name || "image.png";
  const extMatch = originalName.match(/\.([a-zA-Z0-9]+)$/);
  const ext = extMatch ? extMatch[1].toLowerCase() : "png";
  const safeExt = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext) ? ext : "png";
  const filePath = `${user.id}/${Date.now()}_${Math.random().toString(36).slice(2)}.${safeExt}`;

  const safePath = encodeURIComponent(filePath).replace(/%2F/g, "/");
  const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${safePath}`;
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: apiHeaders({
      "Content-Type": file.type,
      "x-upsert": "false"
    }),
    body: file
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `画像アップロードエラー: ${response.status}`);
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${safePath}`;
}

function toast(message) {
  const layer = document.getElementById("toast-layer");
  if (!layer) return;
  const item = document.createElement("div");
  item.className = "quiet-toast";
  item.innerText = message;
  layer.appendChild(item);
  setTimeout(() => {
    item.style.opacity = "0";
    item.style.transition = "opacity 1s ease";
    setTimeout(() => item.remove(), 1000);
  }, 4000);
}

function escapeHtml(value) {
  if (!value) return "";
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function headerHtml() {
  const user = getUser();
  return `
    <div class="header-logo-area">
      <img src="./logo.png" class="site-logo" alt="深き森の雑貨市場" onerror="this.style.display='none'">
    </div>
    <div class="header-area">
      <div class="user-info" id="nav-profile-header">
        <div class="user-identity">${escapeHtml(user.displayName)}</div>
        <div class="user-balance">✨ ${user.coins} Astral Coins</div>
      </div>
      <div class="nav-actions">
        <button class="btn-nav ${currentPage === "home" ? "active" : ""}" id="nav-home">マーケット</button>
        <button class="btn-nav ${currentPage === "add" ? "active" : ""}" id="nav-add">出品する</button>
        <button class="btn-nav ${currentPage === "profile" ? "active" : ""}" id="nav-profile">記録の書</button>
      </div>
    </div>
  `;
}

function productCards(products, showBuy = true) {
  const user = getUser();
  const likes = getLikes();
  return products.map((product) => {
    const liked = likes.includes(product.id);
    const isOwner = product.ownerId === user.id || (!product.ownerId && product.creator === user.displayName);
    const isAdmin = user.displayName === "黒縄";
    const canDelete = isOwner || isAdmin;
    return `
      <div class="product-item">
        <div class="item-header">
           <div class="item-category">${escapeHtml(product.category)}</div>
           <button class="btn-action btn-like ${liked ? "liked" : ""}" data-id="${escapeHtml(product.id)}" title="イイネ">♥</button>
        </div>
        <div class="item-title">${escapeHtml(product.name)}</div>
        ${product.image ? `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" class="item-image" loading="lazy" data-modal-image="${escapeHtml(product.image)}"/>` : ""}
        <div class="item-desc">${escapeHtml(product.description)}</div>
        <div class="item-footer">
          <div class="item-meta">
            <span class="item-price">✨ ${product.price}</span>
            <span class="item-seller">${escapeHtml(product.creator)}</span>
          </div>
          <div class="footer-actions">
              ${canDelete ? `<button class="btn-action delete btn-delete" data-id="${escapeHtml(product.id)}" title="虚空へ還す">🗑</button>` : ""}
              ${showBuy ? `<button class="btn-buy" data-id="${escapeHtml(product.id)}">受け取る</button>` : `<button class="btn-history">所持</button>`}
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function rulesNoticeHtml() {
  return `
    <div class="rules-notice">
      登録された商品はフリー素材としてDLして自由に使えます。<br>
      節度を守り、製作者に敬意を払って使用しましょう。<br><br>

      登録できる画像は、自分で作成した画像のみです。<br>
      また、フリー素材として配布しても問題ない画像だけを登録してください。<br><br>

      出品時に画像ファイルをアップロードできます(5MBまで)。<br>
      画像を使うときは、商品画像を右クリックして保存するのが正しい受け取り方です。<br>
      「受け取る」ボタンはRP用の演出で、実際のダウンロード機能ではありません。
    </div>
  `;
}

function marketHtml(products) {
  let filtered = products;
  if (currentCategory !== "すべて") {
    filtered = products.filter((product) => product.category === currentCategory);
  }
  const controls = `
    ${rulesNoticeHtml()}
    <div class="market-filter">
      <select id="category-filter">
        <option value="すべて" ${currentCategory === "すべて" ? "selected" : ""}>すべてのカテゴリ</option>
        ${categories.map((category) => `<option value="${category}" ${currentCategory === category ? "selected" : ""}>${category}</option>`).join("")}
      </select>
    </div>
  `;
  if (filtered.length === 0) {
    return controls + '<div class="empty-msg">まだ商品がありません...</div>';
  }
  return `
    ${controls}
    <div class="product-feed">
      ${productCards(filtered, true)}
    </div>
  `;
}

function addFormHtml() {
  return `
    <div class="rules-notice">
      登録者は自分で作った画像のみを登録してください。<br>
      登録した画像はフリー素材として配布するものとします。<br>
      画像は5MB以下推奨です。jpg / png / webp / gif に対応しています。
    </div>
    <form class="form-area" id="add-form">
      <div class="form-group">
        <label>出品者名 (変更可能)</label>
        <div style="display: flex; gap: 8px;">
          <input name="creator_name" id="input-creator-name" class="form-control" type="text" style="flex-grow: 1;" value="${escapeHtml(randomName())}" required />
          <button type="button" id="btn-random-name" class="btn-ghost" style="padding: 12px; border-radius: 6px; border: 1px solid var(--glass-border); color: var(--text-primary); cursor: pointer; background: rgba(0,0,0,0.4);">ランダム</button>
        </div>
      </div>
      <div class="form-group">
        <label>アイテム名</label>
        <input name="name" class="form-control" type="text" required />
      </div>
      <div class="form-group">
        <label>物語 / 説明</label>
        <textarea name="desc" class="form-control" maxlength="300" required></textarea>
      </div>
      <div class="form-group">
        <label>対価 (Astral Coins)</label>
        <input name="price" class="form-control" type="number" min="0" max="9999" value="0" required />
      </div>
      <div class="form-group">
        <label>カテゴリ</label>
        <select name="category" class="form-control">
          ${categories.map((category) => `<option value="${category}">${category}</option>`).join("")}
        </select>
      </div>
      <div class="form-group">
        <label>画像ファイル</label>
        <input name="image_file" class="form-control" type="file" accept="image/*" required />
      </div>
      <button type="submit" class="btn-primary form-submit">虚空へ捧げる</button>
    </form>
  `;
}

function profileHtml(products) {
  const user = getUser();
  let content = "";
  if (profileTab === "listed") {
    const listed = products.filter((product) => product.ownerId === user.id || (!product.ownerId && product.creator === user.displayName));
    content = listed.length === 0 ? '<div class="empty-msg">まだ何も出品していません。</div>' : `<div class="product-feed">${productCards(listed, true)}</div>`;
  } else if (profileTab === "purchased") {
    const purchases = getPurchases();
    content = purchases.length === 0 ? '<div class="empty-msg">まだ何も手に入れていません。</div>' : `<div class="product-feed">${productCards(purchases, false)}</div>`;
  } else if (profileTab === "liked") {
    const likes = getLikes();
    const likedProducts = products.filter((product) => likes.includes(product.id));
    content = likedProducts.length === 0 ? '<div class="empty-msg">イイネした記憶はまだありません。</div>' : `<div class="product-feed">${productCards(likedProducts, true)}</div>`;
  }

  return `
    <div class="profile-layout">
      <div class="profile-intro">
        <h2 style="font-family: var(--font-heading); margin-bottom: 12px; font-weight: normal;">記録の書</h2>
        <div style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 20px;">
          ここでは、受け取ったもの、イイネしたもの、出品したものを確認できます。
        </div>
        <div class="form-group" style="max-width: 400px;">
          <label>閲覧者の名前を変更する</label>
          <div style="display: flex; gap: 8px;">
            <input id="input-username" class="form-control" type="text" style="flex-grow: 1;" value="${escapeHtml(user.displayName)}" />
            <button type="button" id="btn-save-username" class="btn-primary" style="padding: 10px 16px; font-size: 0.9rem;">更新</button>
          </div>
          <small style="color: var(--text-muted); font-size: 0.75rem; margin-top: 4px;">※ 名前を変えると、名前だけで判定している古い出品の表示に影響することがあります</small>
        </div>
      </div>
      <div class="profile-nav">
         <button class="btn-subnav ${profileTab === "listed" ? "active" : ""}" data-tab="listed">出品したもの</button>
         <button class="btn-subnav ${profileTab === "purchased" ? "active" : ""}" data-tab="purchased">受け取り履歴</button>
         <button class="btn-subnav ${profileTab === "liked" ? "active" : ""}" data-tab="liked">イイネ</button>
      </div>
      <div class="profile-content">${content}</div>
    </div>
  `;
}

function imageModal(url) {
  const overlay = document.createElement("div");
  overlay.className = "image-modal-overlay";
  const image = document.createElement("img");
  image.className = "image-modal-content";
  image.src = url;
  overlay.appendChild(image);
  document.body.appendChild(overlay);
  overlay.addEventListener("click", () => {
    overlay.style.animation = "none";
    overlay.style.opacity = "1";
    overlay.style.transition = "opacity 0.3s ease";
    overlay.style.opacity = "0";
    setTimeout(() => overlay.remove(), 300);
  });
}

function buyProduct(product) {
  const user = getUser();
  if (user.coins >= product.price) {
    user.coins -= product.price;
    saveUser(user);
    savePurchase(product);
    toast("アイテムが静かにコレクションに加わりました。");
    render();
  } else {
    toast("この記憶を手に入れるにはコインが足りません...");
  }
}

async function handleAddProduct(event) {
  event.preventDefault();
  const form = event.target;
  const imageFile = form.image_file && form.image_file.files ? form.image_file.files[0] : null;

  const product = {
    name: form.name.value.trim(),
    description: form.desc.value.trim(),
    price: parseInt(form.price.value, 10),
    category: form.category.value,
    image: "",
    creator: form.creator_name.value.trim()
  };

  if (!product.name || !product.description || Number.isNaN(product.price) || !product.creator || !imageFile) {
    toast("未入力の項目があります。画像ファイルも選択してください。");
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.innerText = "アップロード中...";
  }

  try {
    const imageUrl = await uploadProductImage(imageFile);
    product.image = imageUrl;

    await insertProduct(product);
    const user = getUser();
    user.coins += 100;
    saveUser(user);
    toast("捧げ物が受け入れられました。ささやかな報酬が追加されました。");
    currentPage = "home";
    await render();
  } catch (error) {
    console.error(error);
    toast(error.message || "出品に失敗しました。Supabase設定を確認してください。");
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.innerText = "虚空へ捧げる";
    }
  }
}

async function render() {
  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = `${headerHtml()}<div class="empty-msg">読み込み中...</div>`;
  let products = productCache;
  if (currentPage !== "add") {
    try {
      products = await fetchProducts();
    } catch (error) {
      console.error(error);
      app.innerHTML = `${headerHtml()}<div class="empty-msg">商品一覧を読み込めませんでした。SupabaseのURL・キー・RLSを確認してください。</div>`;
      bindGlobalEvents();
      return;
    }
  }

  let content = "";
  if (currentPage === "home") content = marketHtml(products);
  if (currentPage === "add") content = addFormHtml();
  if (currentPage === "profile") content = profileHtml(products);

  app.innerHTML = `${headerHtml()}<div>${content}</div>`;
  bindGlobalEvents();
  bindPageEvents(products);
}

function bindGlobalEvents() {
  const home = document.getElementById("nav-home");
  const add = document.getElementById("nav-add");
  const profile = document.getElementById("nav-profile");
  const profileHeader = document.getElementById("nav-profile-header");

  if (home) home.addEventListener("click", () => { currentPage = "home"; render(); });
  if (add) add.addEventListener("click", () => { currentPage = "add"; render(); });
  if (profile) profile.addEventListener("click", () => { currentPage = "profile"; profileTab = "listed"; render(); });
  if (profileHeader) profileHeader.addEventListener("click", () => { currentPage = "profile"; render(); });
}

function bindPageEvents(products) {
  const categoryFilter = document.getElementById("category-filter");
  if (categoryFilter) {
    categoryFilter.addEventListener("change", (event) => {
      currentCategory = event.target.value;
      render();
    });
  }

  document.querySelectorAll(".btn-subnav").forEach((button) => {
    button.addEventListener("click", (event) => {
      profileTab = event.target.dataset.tab;
      render();
    });
  });

  const saveNameButton = document.getElementById("btn-save-username");
  if (saveNameButton) {
    saveNameButton.addEventListener("click", () => {
      const input = document.getElementById("input-username");
      const name = input ? input.value.trim() : "";
      if (name) {
        const user = getUser();
        user.displayName = name;
        saveUser(user);
        toast("名前を更新しました。");
        render();
      }
    });
  }

  document.querySelectorAll(".btn-buy").forEach((button) => {
    button.addEventListener("click", (event) => {
      const id = event.target.dataset.id;
      const product = products.find((item) => item.id === id);
      if (product) buyProduct(product);
    });
  });

  document.querySelectorAll(".btn-like").forEach((button) => {
    button.addEventListener("click", (event) => {
      toggleLike(event.target.dataset.id);
      render();
    });
  });

  document.querySelectorAll(".btn-delete").forEach((button) => {
    button.addEventListener("click", async (event) => {
      if (!confirm("この記憶を虚空へ還しますか？元には戻せません。")) return;
      try {
        await deleteProduct(event.target.dataset.id);
        toast("記憶は虚空へ消え去りました。");
        await render();
      } catch (error) {
        console.error(error);
        toast("削除できませんでした。管理者はSupabaseのTable Editorから削除できます。");
      }
    });
  });

  document.querySelectorAll(".item-image").forEach((image) => {
    image.addEventListener("click", (event) => {
      const url = event.target.getAttribute("data-modal-image");
      if (url) imageModal(url);
    });
  });

  const addForm = document.getElementById("add-form");
  if (addForm) addForm.addEventListener("submit", handleAddProduct);

  const randomButton = document.getElementById("btn-random-name");
  if (randomButton) {
    randomButton.addEventListener("click", () => {
      const input = document.getElementById("input-creator-name");
      if (input) input.value = randomName();
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  render();
});
