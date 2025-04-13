class AppSwiperZoom {
    #MODAL_CUSTOM_SELECTOR = 'app-modal-swiper-zoom';
    #MODAL_CONTAINER_SELECTOR = 'app-swiper-zoom-modal';
    #MODAL_CONTENT_SELECTOR = 'app-swiper-zoom-modal';
    #ENABLED_CLASS = 'app-swiper-zoom--enabled';
    #ZOOM_BUTTON_SELECTOR = 'app-swiper-zoom-button';
    #IMAGE_CONTAINER_SELECTOR = 'app-swiper-zoom-image-container';
    #IMAGE_SELECTOR = 'app-swiper-zoom-image';
    #PREV_BUTTON_SELECTOR = 'app-swiper-zoom-prev';
    #NEXT_BUTTON_SELECTOR = 'app-swiper-zoom-next';
    #COUNTER_SELECTOR = 'app-swiper-zoom-counter';
    #THUMBNAILS_CONTAINER_SELECTOR = 'app-swiper-zoom-thumbnails';
    #THUMBNAIL_SELECTOR = 'app-swiper-zoom-thumbnail';
    #THUMBNAIL_ACTIVE_CLASS = 'active';

    constructor(container) {
        this.container = container;
        
        this.container.classList.add(this.#ENABLED_CLASS);
        
        this.modal = new AppModal(this.#MODAL_CONTAINER_SELECTOR);
        this.modal.setCustomStyle(this.#MODAL_CUSTOM_SELECTOR)
        this.modal.setClosable(true);
        
        this.slides = Array.from(this.container.querySelectorAll('swiper-slide'));
        this.images = this.slides.map(slide => {
            const img = slide.querySelector('img');
            return img ? img.getAttribute('src') : null;
        }).filter(src => src !== null);
        
        this.currentIndex = 0;
        
        this._createModalContent();
        this._addZoomButtonsToSlides();
    }
    
    _createModalContent() {
        const modalHidden = document.createElement('div');
        modalHidden.classList.add("hidden");

        const modalContent = document.createElement('div');

        modalContent.id = this.#MODAL_CONTAINER_SELECTOR;
        modalContent.className = this.#MODAL_CONTENT_SELECTOR;
        
        const prevButton = this._createPrevButton();
        const nextButton = this._createNextButton();
        
        this.imageContainer = this._createImageContainer();
        
        this.counter = this._createCounter();
        
        this.thumbnailsContainer = this._createThumbnailsContainer();
        
        prevButton.addEventListener('click', () => this.showPrevImage());
        nextButton.addEventListener('click', () => this.showNextImage());
        
        const mainContent = document.createElement('div');
        mainContent.className = 'app-swiper-zoom-main-content';
        mainContent.appendChild(prevButton);
        mainContent.appendChild(this.imageContainer);
        mainContent.appendChild(nextButton);
        mainContent.appendChild(this.counter);
        
        modalContent.appendChild(mainContent);
        modalContent.appendChild(this.thumbnailsContainer);


        modalHidden.appendChild(modalContent)

        document.body.appendChild(modalHidden);
        
        this._createThumbnails();
    }
    
    _createCounter() {
        const counter = document.createElement('div');
        counter.className = this.#COUNTER_SELECTOR;
        this._updateCounter(counter);
        return counter;
    }
    
    _updateCounter(counterElement = null) {
        const counter = counterElement || this.counter;
        if (!counter) return;
        
        const current = this.currentIndex + 1;
        const total = this.images.length;
        counter.textContent = `${current} из ${total}`;
    }
    
    _createThumbnailsContainer() {
        const container = document.createElement('div');
        container.className = this.#THUMBNAILS_CONTAINER_SELECTOR;
        return container;
    }
    
    _createThumbnails() {
        if (!this.thumbnailsContainer) return;
        
        this.thumbnailsContainer.innerHTML = '';
        
        this.images.forEach((src, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = this.#THUMBNAIL_SELECTOR;
            if (index === this.currentIndex) {
                thumbnail.classList.add(this.#THUMBNAIL_ACTIVE_CLASS);
            }
            
            const img = document.createElement('img');
            img.src = src;
            thumbnail.appendChild(img);
            
            thumbnail.addEventListener('click', () => {
                this.currentIndex = index;
                this.updateImageInModal();
            });
            
            this.thumbnailsContainer.appendChild(thumbnail);
        });
    }
    
    _updateThumbnails() {
        const thumbnails = this.thumbnailsContainer?.querySelectorAll(`.${this.#THUMBNAIL_SELECTOR}`);
        if (!thumbnails) return;
        
        thumbnails.forEach((thumbnail, index) => {
            if (index === this.currentIndex) {
                thumbnail.classList.add(this.#THUMBNAIL_ACTIVE_CLASS);
            } else {
                thumbnail.classList.remove(this.#THUMBNAIL_ACTIVE_CLASS);
            }
        });
    }
    
    _createPrevButton() {
        const btn = document.createElement('button');
        btn.className = `app-btn btn-slider btn-size-xl app-desktop-visible ${this.#PREV_BUTTON_SELECTOR}`;
        btn.innerHTML = `<svg width="9" height="24"><use xlink:href="/app-sprite.svg#arrow-left"></use></svg>`;
        return btn;
    }
    
    _createImageContainer() {
        const container = document.createElement('div');
        container.className = this.#IMAGE_CONTAINER_SELECTOR;
        return container;
    }
    
    _createNextButton() {
        const btn = document.createElement('button');
        btn.className = `app-btn btn-slider btn-size-xl  app-desktop-visible ${this.#NEXT_BUTTON_SELECTOR}`;
        btn.innerHTML = `<svg width="9" height="24"><use xlink:href="/app-sprite.svg#arrow-right"></use></svg>`;
        return btn;
    }
    
    _createZoomButton() {
        const btn = document.createElement('button');
        btn.className = this.#ZOOM_BUTTON_SELECTOR;
        btn.innerHTML = `<svg width="24" height="24"><use xlink:href="/app-sprite.svg#zoom"></use></svg>`;
        return btn;
    }
    
    _addZoomButtonsToSlides() {
        this.slides.forEach((slide, index) => {
            const zoomButton = this._createZoomButton();
            
            zoomButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openZoom(index);
            });
            
            slide.appendChild(zoomButton);
        });
    }
    
    openZoom(index) {
        this.currentIndex = index;
        this.updateImageInModal();
        this.modal.open();
    }
    
    updateImageInModal() {
        if (!this.images[this.currentIndex]) return;
        
        this.imageContainer.innerHTML = '';
        
        const img = document.createElement('img');
        img.src = this.images[this.currentIndex];
        img.className = this.#IMAGE_SELECTOR;
        
        this.imageContainer.appendChild(img);
        
        this._updateCounter();
        this._updateThumbnails();
    }
    
    showPrevImage() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateImageInModal();
    }
    
    showNextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateImageInModal();
    }
}

window.AppSwiperZoom = AppSwiperZoom;

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('swiper-container.js-swiper-zoom').forEach(container => {
        new AppSwiperZoom(container);
    });
});