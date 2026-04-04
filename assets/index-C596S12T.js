(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function t(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(r){if(r.ep)return;r.ep=!0;const o=t(r);fetch(r.href,o)}})();const s={USER:"quiet_user",PRODUCTS:"quiet_products",PURCHASES:"quiet_purchases"},S=["ぬいぐるみ","フィギュア","衣装","靴","アクセサリー","帽子","フード","その他"],x=["旅人","収集家","観測者","商人","訪問者","記録者","目撃者","保管者","拾い主","放浪者","案内人","運び手","語り手","探し人","見張り","配達人","管理人","徘徊者","受取人","仲介者"],L=["静かな","名もなき","遠くから来た","通りすがりの","少し眠い","古い","忘れられた","夜に歩く","曖昧な","気のせいの","かすかな","どこかの","長く留まる","一度消えた","遅れてきた","影のような","ぼんやりした","名前を持たない","誰かだった","境界にいる"],O=["","","","","","","","","","","のようなもの","だった気がする","かもしれない","ではない何か","に似ている","のままでいる","だったはず","でしかない","になりかけた","の記憶"];function v(a){return a[Math.floor(Math.random()*a.length)]}function f(){return v(L)+v(x)+v(O)}function b(){const a=localStorage.getItem(s.USER);if(a)return JSON.parse(a);const e={displayName:f(),coins:1e3};return localStorage.setItem(s.USER,JSON.stringify(e)),e}function E(a){localStorage.setItem(s.USER,JSON.stringify(a))}const I=[{id:"sample-1",name:"忘れられたロケット",description:"小さな銀色のロケット。触れると冷たく、いくら力を込めても開くことはない。",price:120,category:"アクセサリー",image:"https://images.unsplash.com/photo-1614882068224-b5ab58ffb4d7?auto=format&fit=crop&q=80&w=600&h=400",creator:"遠くの旅人",createdAt:Date.now()-1e6},{id:"sample-2",name:"すり切れた手帳",description:"ページには几帳面な筆跡が残っているが、インクは色褪せて読むことができない。雨の匂いがする。",price:45,category:"アクセサリー",image:"https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600&h=400",creator:"静かな観察者",createdAt:Date.now()-5e5},{id:"sample-3",name:"星明かりの外套",description:"流れ星の糸で織られたマント。暗闇の中で微かに煌めく。",price:350,category:"衣装",image:"https://images.unsplash.com/photo-1574315042784-098cf311c6d3?auto=format&fit=crop&q=80&w=600&h=400",creator:"彷徨う商人",createdAt:Date.now()-2e5}];function h(){const a=localStorage.getItem(s.PRODUCTS);let e=[];if(a){const t=JSON.parse(a);t.length>0&&(e=t)}if(e.length===0)e=[...I];else{let t=!1;e=e.map(n=>(n.creator&&n.creator.match(/^[a-zA-Z\s]+$/)&&(n.creator=f(),t=!0),n)),t&&$(e)}return localStorage.setItem(s.PRODUCTS,JSON.stringify(e)),e}function $(a){localStorage.setItem(s.PRODUCTS,JSON.stringify(a))}function N(a){const e=localStorage.getItem(s.PURCHASES),t=e?JSON.parse(e):[];t.push({product:a.id,date:Date.now()}),localStorage.setItem(s.PURCHASES,JSON.stringify(t))}let d="home",p="すべて";function y(a){const e=document.getElementById("toast-layer"),t=document.createElement("div");t.className="quiet-toast",t.innerText=a,e.appendChild(t),setTimeout(()=>{t.style.opacity="0",t.style.transition="opacity 1s ease",setTimeout(()=>t.remove(),1e3)},4e3)}function A(a){const e=b();e.coins>=a.price?(e.coins-=a.price,E(e),N(a),y("アイテムが静かにコレクションに加わりました。"),m()):y("この記憶を手に入れるにはコインが足りません...")}function P(a){a.preventDefault();const e=a.target,t=e.name.value.trim(),n=e.desc.value.trim(),r=parseInt(e.price.value,10),o=e.category.value,i=e.image.value.trim(),c=e.creator_name.value.trim();if(!t||isNaN(r)||!c)return;const u=h();u.unshift({id:Date.now().toString(),name:t,description:n,price:r,category:o,image:i,creator:c,createdAt:Date.now()}),$(u);const g=b();g.coins+=100,E(g),y("捧げ物が受け入れられました。ささやかな報酬が追加されました。"),d="home",m()}function w(a){const e=document.createElement("div");e.className="image-modal-overlay";const t=document.createElement("img");t.className="image-modal-content",t.src=a,e.appendChild(t),document.body.appendChild(e),e.addEventListener("click",()=>{e.style.animation="none",e.style.opacity="1",e.style.transition="opacity 0.3s ease",e.style.opacity="0",setTimeout(()=>e.remove(),300)})}function C(){const a=b();return`
      <div class="header-logo-area">
        <img src="/logo.png" class="site-logo" alt="深き森の雑貨市場" onerror="this.style.display='none'">
      </div>
      <div class="header-area">
        <div class="user-info">
          <div class="user-identity">${a.displayName}</div>
          <div class="user-balance">✨ ${a.coins} Astral Coins</div>
        </div>
        <div class="nav-actions">
          <button class="btn-nav ${d==="home"?"active":""}" id="nav-home">マーケット</button>
          <button class="btn-nav ${d==="add"?"active":""}" id="nav-add">出品する</button>
        </div>
      </div>
    `}function U(){let a=h();p!=="すべて"&&(a=a.filter(t=>t.category===p));const e=`
      <div class="rules-notice" style="margin: 0 auto 24px auto; padding: 16px; background: rgba(142, 153, 245, 0.05); border: 1px solid rgba(142, 153, 245, 0.2); border-radius: 8px; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6;">
        登録された商品はフリー素材としてDLして自由に使えます。<br>
        節度を守り製作者に敬意を払って使用しましょう。
      </div>
      <div class="market-filter">
        <select id="category-filter">
            <option value="すべて" ${p==="すべて"?"selected":""}>すべてのカテゴリ</option>
            ${S.map(t=>`<option value="${t}" ${p===t?"selected":""}>${t}</option>`).join("")}
        </select>
      </div>
    `;return a.length===0?e+'<div class="empty-msg">虚空には何もありません...</div>':`
      ${e}
      <div class="product-feed">
        ${a.map(t=>`
          <div class="product-item">
            <div class="item-category">${t.category}</div>
            <div class="item-title">${l(t.name)}</div>
            ${t.image?`<img src="${l(t.image)}" alt="${l(t.name)}" class="item-image" loading="lazy" data-modal-image="${l(t.image)}"/>`:""}
            <div class="item-desc">${l(t.description)}</div>
            <div class="item-footer">
              <div class="item-meta">
                <span class="item-price">✨ ${t.price}</span>
                <span class="item-seller">${l(t.creator)}</span>
              </div>
              <button class="btn-buy" data-id="${t.id}">受け取る</button>
            </div>
          </div>
        `).join("")}
      </div>
    `}function D(){return`
      <div class="rules-notice" style="margin: 0 auto 24px auto; max-width: 500px; padding: 16px; background: rgba(142, 153, 245, 0.05); border: 1px solid rgba(142, 153, 245, 0.2); border-radius: 8px; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6;">
        登録者は自分で作った画像のみを登録してください。<br>
        登録した画像はフリー素材として配布するものとします。
      </div>
      <form class="form-area" id="add-form">
        <div class="form-group">
          <label>出品者名</label>
          <div style="display: flex; gap: 8px;">
            <input name="creator_name" id="input-creator-name" class="form-control" type="text" style="flex-grow: 1;" value="${f()}" required />
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
            ${S.map(a=>`<option value="${a}">${a}</option>`).join("")}
          </select>
        </div>
        <div class="form-group">
          <label>記憶の画像URL (任意)</label>
          <input name="image" class="form-control" type="url" placeholder="https://..." />
        </div>
        <button type="submit" class="btn-primary form-submit">虚空へ捧げる</button>
      </form>
    `}function l(a){if(!a)return"";const e=document.createElement("div");return e.textContent=a,e.innerHTML}function m(){const a=document.getElementById("app");if(a.innerHTML=`
      ${C()}
      <div>
        ${d==="home"?U():D()}
      </div>
    `,document.getElementById("nav-home").addEventListener("click",()=>{d="home",m()}),document.getElementById("nav-add").addEventListener("click",()=>{d="add",m()}),d==="home"){const e=document.getElementById("category-filter");e&&e.addEventListener("change",o=>{p=o.target.value,m()});const t=h();document.querySelectorAll(".btn-buy").forEach(o=>{o.addEventListener("click",i=>{const c=i.target.dataset.id,u=t.find(g=>g.id===c);u&&A(u)})}),document.querySelectorAll(".item-image").forEach(o=>{o.addEventListener("click",i=>{const c=i.target.getAttribute("data-modal-image");c&&w(c)})})}else document.getElementById("add-form").addEventListener("submit",P),document.getElementById("btn-random-name").addEventListener("click",()=>{document.getElementById("input-creator-name").value=f()})}document.addEventListener("DOMContentLoaded",()=>{m()});
