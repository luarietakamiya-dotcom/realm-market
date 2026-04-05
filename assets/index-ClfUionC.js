(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const u of s.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&i(u)}).observe(document,{childList:!0,subtree:!0});function a(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(n){if(n.ep)return;n.ep=!0;const s=a(n);fetch(n.href,s)}})();const d={USER:"quiet_user",PRODUCTS:"quiet_products",PURCHASES:"quiet_purchases",LIKES:"quiet_likes"},A=["ぬいぐるみ","フィギュア","衣装","靴","アクセサリー","帽子","フード","その他"],C=["旅人","収集家","観測者","商人","訪問者","記録者","目撃者","保管者","拾い主","放浪者","案内人","運び手","語り手","探し人","見張り","配達人","管理人","徘徊者","受取人","仲介者"],q=["静かな","名もなき","遠くから来た","通りすがりの","少し眠い","古い","忘れられた","夜に歩く","曖昧な","気のせいの","かすかな","どこかの","長く留まる","一度消えた","遅れてきた","影のような","ぼんやりした","名前を持たない","誰かだった","境界にいる"],D=["","","","","","","","","","","のようなもの","だった気がする","かもしれない","ではない何か","に似ている","のままでいる","だったはず","でしかない","になりかけた","の記憶"];function w(t){return t[Math.floor(Math.random()*t.length)]}function $(){return w(q)+w(C)+w(D)}function v(){const t=localStorage.getItem(d.USER);if(t){const a=JSON.parse(t);return a.id||(a.id="user_"+Date.now()+"_"+Math.floor(Math.random()*1e3),L(a)),a}const e={id:"user_"+Date.now()+"_"+Math.floor(Math.random()*1e3),displayName:$(),coins:1e3};return localStorage.setItem(d.USER,JSON.stringify(e)),e}function L(t){localStorage.setItem(d.USER,JSON.stringify(t))}const B=[{id:"sample-1",name:"忘れられたロケット",description:"小さな銀色のロケット。触れると冷たく、いくら力を込めても開くことはない。",price:120,category:"アクセサリー",image:"https://images.unsplash.com/photo-1614882068224-b5ab58ffb4d7?auto=format&fit=crop&q=80&w=600&h=400",creator:"遠くの旅人",createdAt:Date.now()-1e6},{id:"sample-2",name:"すり切れた手帳",description:"ページには几帳面な筆跡が残っているが、インクは色褪せて読むことができない。雨の匂いがする。",price:45,category:"アクセサリー",image:"https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600&h=400",creator:"静かな観察者",createdAt:Date.now()-5e5},{id:"sample-3",name:"星明かりの外套",description:"流れ星の糸で織られたマント。暗闇の中で微かに煌めく。",price:350,category:"衣装",image:"https://images.unsplash.com/photo-1574315042784-098cf311c6d3?auto=format&fit=crop&q=80&w=600&h=400",creator:"彷徨う商人",createdAt:Date.now()-2e5}];function E(){const t=localStorage.getItem(d.PRODUCTS);let e=[];if(t){const a=JSON.parse(t);a.length>0&&(e=a)}if(e.length===0)e=[...B];else{let a=!1;e=e.map(i=>(i.creator&&i.creator.match(/^[a-zA-Z\s]+$/)&&(i.creator=$(),a=!0),i)),a&&x(e)}return localStorage.setItem(d.PRODUCTS,JSON.stringify(e)),e}function x(t){localStorage.setItem(d.PRODUCTS,JSON.stringify(t))}function U(t){let e=E();e=e.filter(a=>a.id!==t),x(e)}function O(){const t=localStorage.getItem(d.PURCHASES);return t?JSON.parse(t):[]}function M(t){const e=O();e.push({...t,purchasedAt:Date.now()}),localStorage.setItem(d.PURCHASES,JSON.stringify(e))}function N(){const t=localStorage.getItem(d.LIKES);return t?JSON.parse(t):[]}function R(t){localStorage.setItem(d.LIKES,JSON.stringify(t))}function T(t){let e=N();e.includes(t)?e=e.filter(a=>a!==t):e.push(t),R(e)}let r="home",f="listed",b="すべて";function h(t){const e=document.getElementById("toast-layer"),a=document.createElement("div");a.className="quiet-toast",a.innerText=t,e.appendChild(a),setTimeout(()=>{a.style.opacity="0",a.style.transition="opacity 1s ease",setTimeout(()=>a.remove(),1e3)},4e3)}function _(t){const e=v();e.coins>=t.price?(e.coins-=t.price,L(e),M(t),h("アイテムが静かにコレクションに加わりました。"),l()):h("この記憶を手に入れるにはコインが足りません...")}function J(t){t.preventDefault();const e=t.target,a=e.name.value.trim(),i=e.desc.value.trim(),n=parseInt(e.price.value,10),s=e.category.value,u=e.image.value.trim(),g=e.creator_name.value.trim();if(!a||isNaN(n)||!g)return;const y=E();y.unshift({id:Date.now().toString(),name:a,description:i,price:n,category:s,image:u,creator:g,ownerId:v().id,createdAt:Date.now()}),x(y);const I=v();I.coins+=100,L(I),h("捧げ物が受け入れられました。ささやかな報酬が追加されました。"),r="home",l()}function H(t){const e=document.createElement("div");e.className="image-modal-overlay";const a=document.createElement("img");a.className="image-modal-content",a.src=t,e.appendChild(a),document.body.appendChild(e),e.addEventListener("click",()=>{e.style.animation="none",e.style.opacity="1",e.style.transition="opacity 0.3s ease",e.style.opacity="0",setTimeout(()=>e.remove(),300)})}function z(){const t=v();return`
      <div class="header-logo-area">
        <img src="./logo.png" class="site-logo" alt="深き森の雑貨市場" onerror="this.style.display='none'">
      </div>
      <div class="header-area">
        <div class="user-info" id="nav-profile-header">
          <div class="user-identity">${t.displayName}</div>
          <div class="user-balance">✨ ${t.coins} Astral Coins</div>
        </div>
        <div class="nav-actions">
          <button class="btn-nav ${r==="home"?"active":""}" id="nav-home">マーケット</button>
          <button class="btn-nav ${r==="add"?"active":""}" id="nav-add">出品する</button>
          <button class="btn-nav ${r==="profile"?"active":""}" id="nav-profile">記録の書</button>
        </div>
      </div>
    `}function S(t,e=!0){const a=v(),i=N();return t.map(n=>{const s=i.includes(n.id),u=n.ownerId===a.id||!n.ownerId&&n.creator===a.displayName,g=a.displayName==="黒縄",y=u||g;return`
        <div class="product-item">
          <div class="item-header">
             <div class="item-category">${n.category}</div>
             <button class="btn-action btn-like ${s?"liked":""}" data-id="${n.id}" title="イイネ">♥</button>
          </div>
          <div class="item-title">${p(n.name)}</div>
          ${n.image?`<img src="${p(n.image)}" alt="${p(n.name)}" class="item-image" loading="lazy" data-modal-image="${p(n.image)}"/>`:""}
          <div class="item-desc">${p(n.description)}</div>
          <div class="item-footer">
            <div class="item-meta">
              <span class="item-price">✨ ${n.price}</span>
              <span class="item-seller">${p(n.creator)}</span>
            </div>
            <div class="footer-actions">
                ${y?`<button class="btn-action delete btn-delete" data-id="${n.id}" title="虚空へ還す">🗑</button>`:""}
                ${e?`<button class="btn-buy" data-id="${n.id}">受け取る</button>`:'<button class="btn-history">所持</button>'}
            </div>
          </div>
        </div>
      `}).join("")}function K(){let t=E();b!=="すべて"&&(t=t.filter(a=>a.category===b));const e=`
      <div class="rules-notice">
        登録された商品はフリー素材としてDLして自由に使えます。<br>
        節度を守り製作者に敬意を払って使用しましょう。
      </div>
      <div class="market-filter">
        <select id="category-filter">
            <option value="すべて" ${b==="すべて"?"selected":""}>すべてのカテゴリ</option>
            ${A.map(a=>`<option value="${a}" ${b===a?"selected":""}>${a}</option>`).join("")}
        </select>
      </div>
    `;return t.length===0?e+'<div class="empty-msg">虚空には何もありません...</div>':`
      ${e}
      <div class="product-feed">
        ${S(t,!0)}
      </div>
    `}function j(){return`
      <div class="rules-notice">
        登録者は自分で作った画像のみを登録してください。<br>
        登録した画像はフリー素材として配布するものとします。
      </div>
      <form class="form-area" id="add-form">
        <div class="form-group">
          <label>出品者名 (変更可能)</label>
          <div style="display: flex; gap: 8px;">
            <input name="creator_name" id="input-creator-name" class="form-control" type="text" style="flex-grow: 1;" value="${$()}" required />
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
            ${A.map(t=>`<option value="${t}">${t}</option>`).join("")}
          </select>
        </div>
        <div class="form-group">
          <label>記憶の画像URL (任意)</label>
          <input name="image" class="form-control" type="url" placeholder="https://..." />
        </div>
        <button type="submit" class="btn-primary form-submit">虚空へ捧げる</button>
      </form>
    `}function F(){const t=v();let e="";const a=E();if(f==="listed"){const i=a.filter(n=>n.ownerId===t.id||!n.ownerId&&n.creator===t.displayName);i.length===0?e='<div class="empty-msg">まだ何も出品していません。</div>':e=`<div class="product-feed">${S(i,!0)}</div>`}else if(f==="purchased"){const i=O();i.length===0?e='<div class="empty-msg">まだ何も手に入れていません。</div>':e=`<div class="product-feed">${S(i,!1)}</div>`}else if(f==="liked"){const i=N(),n=a.filter(s=>i.includes(s.id));n.length===0?e='<div class="empty-msg">イイネした記憶はまだありません。</div>':e=`<div class="product-feed">${S(n,!0)}</div>`}return`
      <div class="profile-layout">
        <div class="profile-intro">
            <h2 style="font-family: var(--font-heading); margin-bottom: 12px; font-weight: normal;">記録の書</h2>
            <div style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 20px;">
                ここではあなたの足跡を辿ることができます。
            </div>
            
            <div class="form-group" style="max-width: 400px;">
              <label>閲覧者の名前を変更する</label>
              <div style="display: flex; gap: 8px;">
                <input id="input-username" class="form-control" type="text" style="flex-grow: 1;" value="${p(t.displayName)}" />
                <button type="button" id="btn-save-username" class="btn-primary" style="padding: 10px 16px; font-size: 0.9rem;">更新</button>
              </div>
              <small style="color: var(--text-muted); font-size: 0.75rem; margin-top: 4px;">※ パスワードがある場合はここに入力してください</small>
            </div>
        </div>

        <div class="profile-nav">
           <button class="btn-subnav ${f==="listed"?"active":""}" data-tab="listed">出品リスト</button>
           <button class="btn-subnav ${f==="purchased"?"active":""}" data-tab="purchased">購入履歴</button>
           <button class="btn-subnav ${f==="liked"?"active":""}" data-tab="liked">イイネ</button>
        </div>

        <div class="profile-content">
            ${e}
        </div>
      </div>
    `}function p(t){if(!t)return"";const e=document.createElement("div");return e.textContent=t,e.innerHTML}function l(){const t=document.getElementById("app");let e="";if(r==="home"?e=K():r==="add"?e=j():r==="profile"&&(e=F()),t.innerHTML=`
      ${z()}
      <div>
        ${e}
      </div>
    `,document.getElementById("nav-home").addEventListener("click",()=>{r="home",l()}),document.getElementById("nav-add").addEventListener("click",()=>{r="add",l()}),document.getElementById("nav-profile").addEventListener("click",()=>{r="profile",f="listed",l()}),document.getElementById("nav-profile-header").addEventListener("click",()=>{r="profile",l()}),r==="home"||r==="profile"){const a=document.getElementById("category-filter");a&&a.addEventListener("change",o=>{b=o.target.value,l()}),document.querySelectorAll(".btn-subnav").forEach(o=>{o.addEventListener("click",c=>{f=c.target.dataset.tab,l()})});const n=document.getElementById("btn-save-username");n&&n.addEventListener("click",()=>{const o=document.getElementById("input-username").value.trim();if(o){const c=v();c.displayName=o,L(c),h("名前を更新しました。"),l()}});const s=E();document.querySelectorAll(".btn-buy").forEach(o=>{o.addEventListener("click",c=>{const m=c.target.dataset.id,k=s.find(P=>P.id===m);k&&_(k)})}),document.querySelectorAll(".btn-like").forEach(o=>{o.addEventListener("click",c=>{const m=c.target.dataset.id;T(m),l()})}),document.querySelectorAll(".btn-delete").forEach(o=>{o.addEventListener("click",c=>{if(confirm("この記憶を虚空へ還しますか？元には戻せません。")){const m=c.target.dataset.id;U(m),h("記憶は虚空へ消え去りました。"),l()}})}),document.querySelectorAll(".item-image").forEach(o=>{o.addEventListener("click",c=>{const m=c.target.getAttribute("data-modal-image");m&&H(m)})})}else r==="add"&&(document.getElementById("add-form").addEventListener("submit",J),document.getElementById("btn-random-name").addEventListener("click",()=>{document.getElementById("input-creator-name").value=$()}))}document.addEventListener("DOMContentLoaded",()=>{l()});
