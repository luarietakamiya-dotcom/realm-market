(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const u of i.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&s(u)}).observe(document,{childList:!0,subtree:!0});function n(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(a){if(a.ep)return;a.ep=!0;const i=n(a);fetch(a.href,i)}})();const d={USER:"quiet_user",PRODUCTS:"quiet_products",PURCHASES:"quiet_purchases",LIKES:"quiet_likes"},O=["ぬいぐるみ","フィギュア","衣装","靴","アクセサリー","帽子","フード","その他"],C=["旅人","収集家","観測者","商人","訪問者","記録者","目撃者","保管者","拾い主","放浪者","案内人","運び手","語り手","探し人","見張り","配達人","管理人","徘徊者","受取人","仲介者"],q=["静かな","名もなき","遠くから来た","通りすがりの","少し眠い","古い","忘れられた","夜に歩く","曖昧な","気のせいの","かすかな","どこかの","長く留まる","一度消えた","遅れてきた","影のような","ぼんやりした","名前を持たない","誰かだった","境界にいる"],B=["","","","","","","","","","","のようなもの","だった気がする","かもしれない","ではない何か","に似ている","のままでいる","だったはず","でしかない","になりかけた","の記憶"];function I(t){return t[Math.floor(Math.random()*t.length)]}function $(){return I(q)+I(C)+I(B)}function v(){const t=localStorage.getItem(d.USER);if(t)return JSON.parse(t);const e={displayName:$(),coins:1e3};return localStorage.setItem(d.USER,JSON.stringify(e)),e}function x(t){localStorage.setItem(d.USER,JSON.stringify(t))}const U=[{id:"sample-1",name:"忘れられたロケット",description:"小さな銀色のロケット。触れると冷たく、いくら力を込めても開くことはない。",price:120,category:"アクセサリー",image:"https://images.unsplash.com/photo-1614882068224-b5ab58ffb4d7?auto=format&fit=crop&q=80&w=600&h=400",creator:"遠くの旅人",createdAt:Date.now()-1e6},{id:"sample-2",name:"すり切れた手帳",description:"ページには几帳面な筆跡が残っているが、インクは色褪せて読むことができない。雨の匂いがする。",price:45,category:"アクセサリー",image:"https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600&h=400",creator:"静かな観察者",createdAt:Date.now()-5e5},{id:"sample-3",name:"星明かりの外套",description:"流れ星の糸で織られたマント。暗闇の中で微かに煌めく。",price:350,category:"衣装",image:"https://images.unsplash.com/photo-1574315042784-098cf311c6d3?auto=format&fit=crop&q=80&w=600&h=400",creator:"彷徨う商人",createdAt:Date.now()-2e5}];function E(){const t=localStorage.getItem(d.PRODUCTS);let e=[];if(t){const n=JSON.parse(t);n.length>0&&(e=n)}if(e.length===0)e=[...U];else{let n=!1;e=e.map(s=>(s.creator&&s.creator.match(/^[a-zA-Z\s]+$/)&&(s.creator=$(),n=!0),s)),n&&N(e)}return localStorage.setItem(d.PRODUCTS,JSON.stringify(e)),e}function N(t){localStorage.setItem(d.PRODUCTS,JSON.stringify(t))}function D(t){let e=E();e=e.filter(n=>n.id!==t),N(e)}function P(){const t=localStorage.getItem(d.PURCHASES);return t?JSON.parse(t):[]}function R(t){const e=P();e.push({...t,purchasedAt:Date.now()}),localStorage.setItem(d.PURCHASES,JSON.stringify(e))}function k(){const t=localStorage.getItem(d.LIKES);return t?JSON.parse(t):[]}function T(t){localStorage.setItem(d.LIKES,JSON.stringify(t))}function M(t){let e=k();e.includes(t)?e=e.filter(n=>n!==t):e.push(t),T(e)}let r="home",f="listed",b="すべて";function h(t){const e=document.getElementById("toast-layer"),n=document.createElement("div");n.className="quiet-toast",n.innerText=t,e.appendChild(n),setTimeout(()=>{n.style.opacity="0",n.style.transition="opacity 1s ease",setTimeout(()=>n.remove(),1e3)},4e3)}function J(t){const e=v();e.coins>=t.price?(e.coins-=t.price,x(e),R(t),h("アイテムが静かにコレクションに加わりました。"),l()):h("この記憶を手に入れるにはコインが足りません...")}function H(t){t.preventDefault();const e=t.target,n=e.name.value.trim(),s=e.desc.value.trim(),a=parseInt(e.price.value,10),i=e.category.value,u=e.image.value.trim(),g=e.creator_name.value.trim();if(!n||isNaN(a)||!g)return;const y=E();y.unshift({id:Date.now().toString(),name:n,description:s,price:a,category:i,image:u,creator:g,createdAt:Date.now()}),N(y);const L=v();L.coins+=100,x(L),h("捧げ物が受け入れられました。ささやかな報酬が追加されました。"),r="home",l()}function _(t){const e=document.createElement("div");e.className="image-modal-overlay";const n=document.createElement("img");n.className="image-modal-content",n.src=t,e.appendChild(n),document.body.appendChild(e),e.addEventListener("click",()=>{e.style.animation="none",e.style.opacity="1",e.style.transition="opacity 0.3s ease",e.style.opacity="0",setTimeout(()=>e.remove(),300)})}function z(){const t=v();return`
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
    `}function S(t,e=!0){const n=v(),s=k();return t.map(a=>{const i=s.includes(a.id),u=a.creator===n.displayName,g=n.displayName==="黒縄",y=u||g;return`
        <div class="product-item">
          <div class="item-header">
             <div class="item-category">${a.category}</div>
             <button class="btn-action btn-like ${i?"liked":""}" data-id="${a.id}" title="イイネ">♥</button>
          </div>
          <div class="item-title">${p(a.name)}</div>
          ${a.image?`<img src="${p(a.image)}" alt="${p(a.name)}" class="item-image" loading="lazy" data-modal-image="${p(a.image)}"/>`:""}
          <div class="item-desc">${p(a.description)}</div>
          <div class="item-footer">
            <div class="item-meta">
              <span class="item-price">✨ ${a.price}</span>
              <span class="item-seller">${p(a.creator)}</span>
            </div>
            <div class="footer-actions">
                ${y?`<button class="btn-action delete btn-delete" data-id="${a.id}" title="虚空へ還す">🗑</button>`:""}
                ${e?`<button class="btn-buy" data-id="${a.id}">受け取る</button>`:'<button class="btn-history">所持</button>'}
            </div>
          </div>
        </div>
      `}).join("")}function K(){let t=E();b!=="すべて"&&(t=t.filter(n=>n.category===b));const e=`
      <div class="rules-notice">
        登録された商品はフリー素材としてDLして自由に使えます。<br>
        節度を守り製作者に敬意を払って使用しましょう。
      </div>
      <div class="market-filter">
        <select id="category-filter">
            <option value="すべて" ${b==="すべて"?"selected":""}>すべてのカテゴリ</option>
            ${O.map(n=>`<option value="${n}" ${b===n?"selected":""}>${n}</option>`).join("")}
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
            ${O.map(t=>`<option value="${t}">${t}</option>`).join("")}
          </select>
        </div>
        <div class="form-group">
          <label>記憶の画像URL (任意)</label>
          <input name="image" class="form-control" type="url" placeholder="https://..." />
        </div>
        <button type="submit" class="btn-primary form-submit">虚空へ捧げる</button>
      </form>
    `}function F(){const t=v();let e="";const n=E();if(f==="listed"){const s=n.filter(a=>a.creator===t.displayName);s.length===0?e='<div class="empty-msg">まだ何も出品していません。</div>':e=`<div class="product-feed">${S(s,!0)}</div>`}else if(f==="purchased"){const s=P();s.length===0?e='<div class="empty-msg">まだ何も手に入れていません。</div>':e=`<div class="product-feed">${S(s,!1)}</div>`}else if(f==="liked"){const s=k(),a=n.filter(i=>s.includes(i.id));a.length===0?e='<div class="empty-msg">イイネした記憶はまだありません。</div>':e=`<div class="product-feed">${S(a,!0)}</div>`}return`
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
    `,document.getElementById("nav-home").addEventListener("click",()=>{r="home",l()}),document.getElementById("nav-add").addEventListener("click",()=>{r="add",l()}),document.getElementById("nav-profile").addEventListener("click",()=>{r="profile",f="listed",l()}),document.getElementById("nav-profile-header").addEventListener("click",()=>{r="profile",l()}),r==="home"||r==="profile"){const n=document.getElementById("category-filter");n&&n.addEventListener("change",o=>{b=o.target.value,l()}),document.querySelectorAll(".btn-subnav").forEach(o=>{o.addEventListener("click",c=>{f=c.target.dataset.tab,l()})});const a=document.getElementById("btn-save-username");a&&a.addEventListener("click",()=>{const o=document.getElementById("input-username").value.trim();if(o){const c=v();c.displayName=o,x(c),h("名前を更新しました。"),l()}});const i=E();document.querySelectorAll(".btn-buy").forEach(o=>{o.addEventListener("click",c=>{const m=c.target.dataset.id,A=i.find(w=>w.id===m);A&&J(A)})}),document.querySelectorAll(".btn-like").forEach(o=>{o.addEventListener("click",c=>{const m=c.target.dataset.id;M(m),l()})}),document.querySelectorAll(".btn-delete").forEach(o=>{o.addEventListener("click",c=>{if(confirm("この記憶を虚空へ還しますか？元には戻せません。")){const m=c.target.dataset.id;D(m),h("記憶は虚空へ消え去りました。"),l()}})}),document.querySelectorAll(".item-image").forEach(o=>{o.addEventListener("click",c=>{const m=c.target.getAttribute("data-modal-image");m&&_(m)})})}else r==="add"&&(document.getElementById("add-form").addEventListener("submit",H),document.getElementById("btn-random-name").addEventListener("click",()=>{document.getElementById("input-creator-name").value=$()}))}document.addEventListener("DOMContentLoaded",()=>{l()});
