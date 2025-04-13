var F=c=>{throw TypeError(c)};var Q=(c,e,t)=>e.has(c)||F("Cannot "+t);var a=(c,e,t)=>(Q(c,e,"read from private field"),t?t.call(c):e.get(c)),r=(c,e,t)=>e.has(c)?F("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(c):e.set(c,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const l of n.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function t(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=t(i);fetch(i.href,n)}})();document.addEventListener("DOMContentLoaded",()=>{const c=document.querySelectorAll(".js-default-swiper");Array.from(c).forEach(e=>{const t=e.querySelector("div[slot='container-start'] .swiper-left"),s=e.querySelector("div[slot='container-end'] .swiper-right"),i={loop:!1,slidesPerView:"auto",spaceBetween:8,breakpoints:{1024:{spaceBetween:e.dataset.space||32}},injectStyles:[`:host .swiper{
                    overflow: visible;
                  }`]};Object.assign(e,i),e.initialize();const n=o=>{o&&(t.classList.toggle("active",!o.isBeginning),s.classList.toggle("active",!o.isEnd))},{swiper:l}=e;n(l),s&&t&&(s.addEventListener("click",()=>{l&&l.slideNext()}),t.addEventListener("click",()=>{l&&l.slidePrev()}),e.addEventListener("swiperslidechange",o=>{const[d,h]=o.detail;n(d)}),e.addEventListener("swipertouchmove",o=>{e.classList.toggle("touched",!0)}),e.addEventListener("swipertouchend",o=>{e.classList.toggle("touched",!1)}))})});document.addEventListener("DOMContentLoaded",()=>{const c=document.querySelectorAll(".js-review-swiper");Array.from(c).forEach(e=>{const t=e.querySelector("div[slot='container-start'] .swiper-left"),s=e.querySelector("div[slot='container-end'] .swiper-right");Object.assign(e,{loop:!1,slidesPerView:"auto",spaceBetween:8,breakpoints:{1024:{spaceBetween:16}},injectStyles:[`:host .swiper{
                        overflow: visible;
                      }`]}),e.initialize();const n=o=>{o&&(t.classList.toggle("active",!o.isBeginning),s.classList.toggle("active",!o.isEnd))},{swiper:l}=e;n(l),s&&t&&(s.addEventListener("click",()=>{l&&l.slideNext()}),t.addEventListener("click",()=>{l&&l.slidePrev()}),e.addEventListener("swiperslidechange",o=>{const[d,h]=o.detail;n(d)}),e.addEventListener("swipertouchmove",o=>{e.classList.toggle("touched",!0)}),e.addEventListener("swipertouchend",o=>{e.classList.toggle("touched",!1)}))})});document.addEventListener("DOMContentLoaded",()=>{const c=document.querySelector("header"),e=document.querySelector(".js-banner");if(!c||!e)return;const t=()=>{if(c&&e){const{height:s}=c.getBoundingClientRect();Object.assign(e.style,{marginTop:`calc(-${s}px + var(--holder-gap))`})}};t(),c&&e&&(new ResizeObserver(()=>{t()}).observe(c),document.body.classList.add("app-banner--mods"))});let ee=class{constructor(e){this.contentId=e,this.contentNodes=null,this.isOpen=!1,this.closable=!1,this.modalElement=this._createModalElement(),this.wrapperElement=this._createWrapperPanel(),this.contentPanel=this._createContentPanel(),this.closeButton=this._createCloseButton(),this.wrapperElement.append(this.closeButton),this.wrapperElement.append(this.contentPanel),this.modalElement.append(this.wrapperElement),this._setupEvents()}_createModalElement(){const e=document.createElement("div");return e.className="app-modal",e}_createCloseButton(){const e=document.createElement("button");return e.innerHTML='<svg width="14" height="24"><use xlink:href="/app-sprite.svg#close"></use></svg>',e.className="app-modal__close",e}_createWrapperPanel(){const e=document.createElement("div");return e.className="app-modal__wrapper",e}_createContentPanel(){const e=document.createElement("div");return e.className="app-modal__content",e}_setupEvents(){this.closeButton.addEventListener("click",()=>this.close()),this.modalElement.addEventListener("click",e=>{if(this.closable&&!this.wrapperElement.contains(e.target)){this.close();return}if(e.target.closest(".js-modal-close")){this.close();return}e.target.classList.contains("js-modal-close")&&this.close()}),this.modalElement.addEventListener("touchmove",e=>e.preventDefault(),{passive:!1})}_animate(e="show"){const t=[this.modalElement],s=i=>{document.body.style.overflow="hidden",this.startTime||(this.startTime=i);const n=(i-this.startTime)/300;t.forEach(l=>{l.style.opacity=e==="show"?Math.min(n,1):Math.max(1-n,0)}),n<1?requestAnimationFrame(s):(this.startTime=null,e==="hide"&&(this._removeFromDOM(),document.body.style.overflow=null))};requestAnimationFrame(s)}_addToDOM(e){document.body.append(this.modalElement),this.contentPanel.append(e)}_removeFromDOM(){this.modalElement.remove()}_insertContentNodes(e){const t=document.getElementById(this.contentId);!t||!t.hasChildNodes()||(this.contentNodes==null&&(this.contentNodes=Array.from(t.childNodes)),this.contentNodes.forEach(s=>{s.nodeType===Node.ELEMENT_NODE&&e(s)}))}open(){this.isOpen||(this.isOpen=!0,this._insertContentNodes(e=>this._addToDOM(e)),this._animate("show"))}close(){this.isOpen&&(this._animate("hide"),this.isOpen=!1)}setClosable(e){this.closable=e}setCustomStyle(e,t=!0){this.modalElement.classList.toggle(e,t)}};window.AppModal=ee;document.addEventListener("DOMContentLoaded",()=>{const c=document.querySelectorAll(".app-input");function e(s){let i=s.replace(/\D/g,"");i.startsWith("375")&&(i=i.substring(3)),i.length>9&&(i=i.substring(0,9));let n="+375 (";return i.length>0&&(n+=i.substring(0,2)),i.length>2&&(n+=") "+i.substring(2,5)),i.length>5&&(n+="-"+i.substring(5,7)),i.length>7&&(n+="-"+i.substring(7,9)),n}function t(s){return i=>{const n=i.querySelector(s);function l(o){i.classList.toggle("empty",o)}n&&(l(n.value.length===0),n.addEventListener("blur",function(o){l(o.target.value.length===0)}),n.addEventListener("input",function(o){var h,p;if(l(o.target.value.length===0),o.target.getAttribute("type")==="phone"){const y=((h=o.inputType)==null?void 0:h.includes("delete"))||o.target.value.length<((p=this.previousValue)==null?void 0:p.length);this.previousValue=o.target.value,y||(o.target.value=e(o.target.value))}}),n.addEventListener("keydown",function(o){if(o.target.getAttribute("type")==="phone"){if([8,46,9,27,13].includes(o.keyCode)||(o.ctrlKey||o.metaKey)&&[65,67,86,88].includes(o.keyCode))return;(o.keyCode<48||o.keyCode>57)&&(o.keyCode<96||o.keyCode>105)&&o.preventDefault()}}))}}Array.from(c).forEach(t("input")),Array.from(c).forEach(t("textarea"))});var v,b,_,m,L,O,w,T,A,N,I,P,x,M,u,E,R,q;class G{constructor(e){r(this,v,"app-select__popup");r(this,b,"app-select__popup-content");r(this,_,"."+a(this,v));r(this,m,"app-select__option");r(this,L,"."+a(this,m));r(this,O,"app-select__popup-header");r(this,w,"app-select__popup-header-title");r(this,T,"app-select__popup-header-reset");r(this,A,"app-select__popup-options");r(this,N,"app-select__optgroup");r(this,I,"app-select__optgroup-label");r(this,P,"app-select__popup-apply");r(this,x,"."+a(this,P));r(this,M,"app-select__view");r(this,u,"."+a(this,M));r(this,E,"app-select__placeholder");r(this,R,"app-select--with-placeholder");r(this,q,"app-select--with-count");this.el=e,this.activePopup=null,this.selectedItems=new Set,this.initialSelectedItems=new Set;const t=this.el.querySelector(a(this,u));this.initialTitle=t?t.textContent:"";const s=this.el.querySelector("select"),i=s?s.querySelector('option[value="placeholder"]'):null;this.initialPlaceholder=i?i.textContent:"",this.init()}get isMobile(){return window.matchMedia("(max-width: 1024px)").matches}_createHeaderTitle(e){const t=document.createElement("div");return t.innerHTML=`<svg width="9" height="24"><use xlink:href="/app-sprite.svg#arrow-left"></use></svg> <span>${e}</span>`,t.className=a(this,w),t}_createPlaceholder(e){const t=document.createElement("div");return t.className=a(this,E),t.textContent=e,t}_createResetButton(e){const t=document.createElement("button");return t.innerHTML=`<span>${e}</span> <svg width="14" height="24"><use xlink:href="/app-sprite.svg#close"></use></svg>`,t.className=a(this,T),t}init(){this.setupSelect(),document.addEventListener("click",e=>{if(this.activePopup){const t=this.el.contains(e.target),s=this.activePopup.contains(e.target);!t&&!s&&(this.isMobile?this.el.querySelector("select").hasAttribute("data-multichoice")||this.closePopup():this.closePopup())}}),window.addEventListener("resize",()=>{this.activePopup&&this.positionPopup(this.activePopup)})}loadInitialSelection(){this.el.querySelector("select").querySelectorAll("option:checked").forEach(s=>{s.value!=="placeholder"&&this.selectedItems.add(s.value)})}setupSelect(){const e=this.el.querySelector(a(this,u)),t=this.el.querySelector("select"),s=t.querySelector('option[value="placeholder"]');t.dataset.multichoice&&this.el.classList.add("multi"),t.getAttribute("data-change-view")==="false"&&this.el.classList.add(a(this,q)),s&&this.el.classList.add(a(this,R));let i=this.el.querySelector(`.${a(this,E)}`);!i&&this.initialPlaceholder&&(i=this._createPlaceholder(this.initialPlaceholder),e.after(i)),e&&e.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),this.activePopup?this.closePopup():(document.querySelectorAll(a(this,_)).forEach(o=>{var d;if(o!==this.activePopup){const h=(d=window.appSelectInstances)==null?void 0:d.find(p=>p.activePopup===o);h==null||h.closePopup()}}),this.openPopup())}),this.setInitialValue()}setInitialValue(){const e=this.el.querySelector(a(this,u)),t=this.el.querySelector("select"),s=t.querySelector('option[value="placeholder"]');e&&s&&(!t.hasAttribute("data-change-view")||t.getAttribute("data-change-view")!=="false")&&(e.textContent=s.textContent),this.selectedItems.size>0&&this.updateViewText()}openPopup(){const e=this.el.querySelector("select");this.initialSelectedItems=new Set(this.selectedItems);const t=document.createElement("div"),s=document.createElement("div");if(t.className=a(this,v),s.className=a(this,b),this.isMobile){const n=document.createElement("div");n.className=a(this,O);const l=this._createHeaderTitle(this.initialTitle);l.addEventListener("click",()=>{this.closePopup()});const o=this._createResetButton("Сбросить");o.addEventListener("click",()=>{this.resetSelection(),this.applySelection(),this.closePopup()}),n.appendChild(l),n.appendChild(o),t.appendChild(n)}t.appendChild(s);const i=document.createElement("div");if(i.className=a(this,A),this.populateOptions(i,e),s.appendChild(i),e.hasAttribute("data-multichoice")||this.isMobile){const n=document.createElement("div");n.className=a(this,P),n.textContent="Применить",!this.isMobile&&e.hasAttribute("data-multichoice")&&(n.style.display="none"),n.addEventListener("click",()=>{this.applySelection(),this.closePopup()}),s.appendChild(n)}document.body.appendChild(t),this.activePopup=t,this.positionPopup(t)}populateOptions(e,t){const s=t.querySelectorAll(":scope > option, :scope > optgroup"),i=t.hasAttribute("data-multichoice");s.forEach(n=>{if(n.tagName==="OPTGROUP"){const l=document.createElement("div");l.className=a(this,N);const o=document.createElement("div");o.className=a(this,I),o.textContent=n.getAttribute("label"),l.appendChild(o),n.querySelectorAll(":scope > option").forEach(h=>{if(h.value!=="placeholder"){const p=this.createOptionElement(h,i);l.appendChild(p)}}),e.appendChild(l)}else if(n.tagName==="OPTION"&&n.value!=="placeholder"){const l=this.createOptionElement(n,i);e.appendChild(l)}})}createOptionElement(e,t){const s=document.createElement("div");return s.className=a(this,m),s.dataset.value=e.value,s.textContent=e.textContent,this.selectedItems.has(e.value)&&s.classList.add("active"),s.addEventListener("click",i=>{i.stopPropagation(),t?(s.classList.toggle("active"),this.isMobile||this.updateApplyButtonVisibility()):(s.closest(a(this,_)).querySelectorAll(a(this,L)).forEach(l=>l.classList.remove("active")),s.classList.add("active"),this.isMobile||(this.applySelection(),this.closePopup()))}),s}updateApplyButtonVisibility(){if(!this.activePopup||this.isMobile||!this.el.querySelector("select").hasAttribute("data-multichoice"))return;const t=this.activePopup.querySelector(a(this,x));if(!t)return;const s=new Set;this.activePopup.querySelectorAll("."+a(this,m)+".active").forEach(n=>{s.add(n.dataset.value)});let i=!1;if(s.size!==this.initialSelectedItems.size)i=!0;else for(const n of s)if(!this.initialSelectedItems.has(n)){i=!0;break}t.style.display=i?"block":"none"}applySelection(){if(!this.activePopup)return;const e=this.el.querySelector("select"),t=this.activePopup.querySelectorAll(".app-select__option.active");this.selectedItems.clear(),e.querySelectorAll("option").forEach(n=>{n.selected=!1});const s=[];t.forEach(n=>{const l=n.dataset.value;Array.from(e.querySelectorAll("option")).forEach(o=>{o.value===l&&(o.selected=!0,this.selectedItems.add(l),s.push(o.textContent))})}),this.updateViewText(s);const i=new Event("change",{bubbles:!0});e.dispatchEvent(i)}updateViewText(e){const t=this.el.querySelector(a(this,u)),s=this.el.querySelector("select"),i=this.el.querySelector(`.${a(this,E)}`),n=!s.hasAttribute("data-change-view")||s.getAttribute("data-change-view")!=="false",l=s.getAttribute("data-change-view")==="true";if(e||(e=[],this.selectedItems.forEach(o=>{const d=s.querySelector(`option[value="${o}"]`);d&&e.push(d.textContent)})),t){const o=this.selectedItems.size;if(o>0)t.dataset.count=o,n&&(t.innerHTML=`<span class="ellipsis">${e.join(", ")}</span>`),i&&l&&(i.textContent=this.initialTitle);else{if(delete t.dataset.count,n){const d=s.querySelector('option[value="placeholder"]');d&&(t.textContent=d.textContent)}i&&l&&(i.textContent=this.initialPlaceholder)}}}resetSelection(){if(!this.activePopup)return;this.activePopup.querySelectorAll(a(this,L)).forEach(t=>{t.classList.remove("active")}),this.selectedItems.clear()}positionPopup(e){const t=this.el.getBoundingClientRect(),s=this.findScrollableParent(this.el),i=s.getBoundingClientRect(),n=t.top-i.top+s.scrollTop;let l=t.left-i.left;const o=i.height-(t.bottom-i.top),d=t.top-i.top,h=Math.min(e.offsetHeight,i.height*.8);let p;o>=h||o>=d?p=n+t.height:p=n-h;const y=this.el.querySelector("select");y.hasAttribute("data-horizontal-pos")&&y.getAttribute("data-horizontal-pos")==="right"&&(l=t.right-e.offsetWidth);const J=i.height-h;p=Math.max(0,Math.min(p,J)),e.style.position="absolute",e.style.top=`${p}px`,e.style.left=`${l}px`,e.style.width=`${t.width}px`,e.style.maxHeight=`${i.height*.8}px`,e.style.overflowY="auto",this.isMobile||s.appendChild(e)}findScrollableParent(e){let t=e.parentElement;for(;t;){const s=window.getComputedStyle(t);if(s.overflowY==="auto"||s.overflowY==="scroll"||s.overflow==="auto"||s.overflow==="scroll")return t;t=t.parentElement}return document.body}closePopup(){this.activePopup&&(this.activePopup.remove(),this.activePopup=null)}}v=new WeakMap,b=new WeakMap,_=new WeakMap,m=new WeakMap,L=new WeakMap,O=new WeakMap,w=new WeakMap,T=new WeakMap,A=new WeakMap,N=new WeakMap,I=new WeakMap,P=new WeakMap,x=new WeakMap,M=new WeakMap,u=new WeakMap,E=new WeakMap,R=new WeakMap,q=new WeakMap;window.AppSelect=G;document.addEventListener("DOMContentLoaded",()=>{window.appSelectInstances=[],document.querySelectorAll(".app-select").forEach(c=>{window.appSelectInstances.push(new G(c))})});var B,k,f;class K{constructor(e){r(this,B,"init");r(this,k,"ovhidden");r(this,f,"expanded");this.el=e,this.init()}isReadyToUse(){return!!this.el}isMobile(){return"matchMedia"in window&&matchMedia("(max-width: 1024px)").matches}init(){if(!this.isReadyToUse())return;setTimeout(()=>{this.el.classList.add(a(this,B))},0),document.addEventListener("click",t=>{if(t.target.closest(".js-sidebar-button")){this.toggleExpand();return}t.target.classList.contains("js-sidebar-button")&&this.toggleExpand(),!this.el.contains(t.target)&&this.el.classList.contains(a(this,f))&&this.toggleExpand()});let e;window.addEventListener("resize",t=>{clearTimeout(e),e=setTimeout(()=>{this.isMobile()||this.expand(!1)},50)})}toggleExpand(){const e=!this.el.classList.contains(a(this,f));this.expand(e)}expand(e){this.el.classList.toggle(a(this,f),e),document.documentElement.classList.toggle(a(this,k),e)}}B=new WeakMap,k=new WeakMap,f=new WeakMap;window.AppSidebar=K;document.addEventListener("DOMContentLoaded",function(){let c=document.querySelector(".js-sidebar-element");c&&new K(c)});var z,C,D,U,H,V,$,j,Y,Z,W,S,g;class X{constructor(e){r(this,z,"app-modal-swiper-zoom");r(this,C,"app-swiper-zoom-modal");r(this,D,"app-swiper-zoom-modal");r(this,U,"app-swiper-zoom--enabled");r(this,H,"app-swiper-zoom-button");r(this,V,"app-swiper-zoom-image-container");r(this,$,"app-swiper-zoom-image");r(this,j,"app-swiper-zoom-prev");r(this,Y,"app-swiper-zoom-next");r(this,Z,"app-swiper-zoom-counter");r(this,W,"app-swiper-zoom-thumbnails");r(this,S,"app-swiper-zoom-thumbnail");r(this,g,"active");this.container=e,this.container.classList.add(a(this,U)),this.modal=new AppModal(a(this,C)),this.modal.setCustomStyle(a(this,z)),this.modal.setClosable(!0),this.slides=Array.from(this.container.querySelectorAll("swiper-slide")),this.images=this.slides.map(t=>{const s=t.querySelector("img");return s?s.getAttribute("src"):null}).filter(t=>t!==null),this.currentIndex=0,this._createModalContent(),this._addZoomButtonsToSlides()}_createModalContent(){const e=document.createElement("div");e.classList.add("hidden");const t=document.createElement("div");t.id=a(this,C),t.className=a(this,D);const s=this._createPrevButton(),i=this._createNextButton();this.imageContainer=this._createImageContainer(),this.counter=this._createCounter(),this.thumbnailsContainer=this._createThumbnailsContainer(),s.addEventListener("click",()=>this.showPrevImage()),i.addEventListener("click",()=>this.showNextImage());const n=document.createElement("div");n.className="app-swiper-zoom-main-content",n.appendChild(s),n.appendChild(this.imageContainer),n.appendChild(i),n.appendChild(this.counter),t.appendChild(n),t.appendChild(this.thumbnailsContainer),e.appendChild(t),document.body.appendChild(e),this._createThumbnails()}_createCounter(){const e=document.createElement("div");return e.className=a(this,Z),this._updateCounter(e),e}_updateCounter(e=null){const t=e||this.counter;if(!t)return;const s=this.currentIndex+1,i=this.images.length;t.textContent=`${s} из ${i}`}_createThumbnailsContainer(){const e=document.createElement("div");return e.className=a(this,W),e}_createThumbnails(){this.thumbnailsContainer&&(this.thumbnailsContainer.innerHTML="",this.images.forEach((e,t)=>{const s=document.createElement("div");s.className=a(this,S),t===this.currentIndex&&s.classList.add(a(this,g));const i=document.createElement("img");i.src=e,s.appendChild(i),s.addEventListener("click",()=>{this.currentIndex=t,this.updateImageInModal()}),this.thumbnailsContainer.appendChild(s)}))}_updateThumbnails(){var t;const e=(t=this.thumbnailsContainer)==null?void 0:t.querySelectorAll(`.${a(this,S)}`);e&&e.forEach((s,i)=>{i===this.currentIndex?s.classList.add(a(this,g)):s.classList.remove(a(this,g))})}_createPrevButton(){const e=document.createElement("button");return e.className=`app-btn btn-slider btn-size-xl app-desktop-visible ${a(this,j)}`,e.innerHTML='<svg width="9" height="24"><use xlink:href="/app-sprite.svg#arrow-left"></use></svg>',e}_createImageContainer(){const e=document.createElement("div");return e.className=a(this,V),e}_createNextButton(){const e=document.createElement("button");return e.className=`app-btn btn-slider btn-size-xl  app-desktop-visible ${a(this,Y)}`,e.innerHTML='<svg width="9" height="24"><use xlink:href="/app-sprite.svg#arrow-right"></use></svg>',e}_createZoomButton(){const e=document.createElement("button");return e.className=a(this,H),e.innerHTML='<svg width="24" height="24"><use xlink:href="/app-sprite.svg#zoom"></use></svg>',e}_addZoomButtonsToSlides(){this.slides.forEach((e,t)=>{const s=this._createZoomButton();s.addEventListener("click",i=>{i.preventDefault(),i.stopPropagation(),this.openZoom(t)}),e.appendChild(s)})}openZoom(e){this.currentIndex=e,this.updateImageInModal(),this.modal.open()}updateImageInModal(){if(!this.images[this.currentIndex])return;this.imageContainer.innerHTML="";const e=document.createElement("img");e.src=this.images[this.currentIndex],e.className=a(this,$),this.imageContainer.appendChild(e),this._updateCounter(),this._updateThumbnails()}showPrevImage(){this.currentIndex=(this.currentIndex-1+this.images.length)%this.images.length,this.updateImageInModal()}showNextImage(){this.currentIndex=(this.currentIndex+1)%this.images.length,this.updateImageInModal()}}z=new WeakMap,C=new WeakMap,D=new WeakMap,U=new WeakMap,H=new WeakMap,V=new WeakMap,$=new WeakMap,j=new WeakMap,Y=new WeakMap,Z=new WeakMap,W=new WeakMap,S=new WeakMap,g=new WeakMap;window.AppSwiperZoom=X;document.addEventListener("DOMContentLoaded",()=>{document.querySelectorAll("swiper-container.js-swiper-zoom").forEach(c=>{new X(c)})});
