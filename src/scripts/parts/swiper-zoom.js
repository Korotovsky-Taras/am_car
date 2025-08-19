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
    #THUMBNAILS_WRAPPER_SELECTOR = 'app-swiper-zoom-t-wrapper';
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
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.swipeThreshold = 50;

        this._createModalContent();
        this._addZoomButtonsToSlides();
        this._initSwipeEvents();

        this._handleResize = this._handleResize.bind(this);
        window.addEventListener('resize', this._handleResize);
    }

    _initSwipeEvents() {
        setTimeout(() => {
            this._setupSwipeHandlers();
        }, 100);
    }

    _setupSwipeHandlers() {
        const imageContainer = this.imageContainer;
        if (!imageContainer) return;

        // Touch events для свайпов
        imageContainer.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
        }, { passive: true });

        imageContainer.addEventListener('touchmove', (e) => {
            if (!this.touchStartX) return;

            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const diffX = currentX - this.touchStartX;
            const diffY = currentY - this.touchStartY;

            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
                e.preventDefault();
            }
        }, { passive: false });

        imageContainer.addEventListener('touchend', (e) => {
            if (!this.touchStartX) return;

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = endX - this.touchStartX;
            const diffY = endY - this.touchStartY;

            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > this.swipeThreshold) {
                if (diffX > 0) {
                    this.showPrevImage();
                } else {
                    this.showNextImage();
                }
            }

            this.touchStartX = 0;
            this.touchStartY = 0;
        }, { passive: true });
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
        this.thumbnailsWrapper = this._createThumbnailsWrapper();

        prevButton.addEventListener('click', () => this.showPrevImage());
        nextButton.addEventListener('click', () => this.showNextImage());

        const mainContent = document.createElement('div');
        mainContent.className = 'app-swiper-zoom-main-content';
        mainContent.appendChild(prevButton);
        mainContent.appendChild(this.imageContainer);
        mainContent.appendChild(nextButton);
        mainContent.appendChild(this.counter);

        modalContent.appendChild(mainContent);
        this.thumbnailsWrapper.appendChild(this.thumbnailsContainer);
        modalContent.appendChild(this.thumbnailsWrapper);

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

    _createThumbnailsWrapper() {
        const container = document.createElement('div');
        container.className = this.#THUMBNAILS_WRAPPER_SELECTOR;
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

    _scrollToActiveThumbnail() {
        if (!this.thumbnailsContainer || this.images.length <= 1) return;

        const activeThumb = this.thumbnailsContainer.querySelector(`.${this.#THUMBNAIL_ACTIVE_CLASS}`);
        if (!activeThumb) return;

        const container = this.thumbnailsContainer;
        const thumbWidth = activeThumb.offsetWidth;
        const gap = 10;
        const containerWidth = container.offsetWidth;
        const scrollLeft = container.scrollLeft;

        const activeIndex = Array.from(container.children).indexOf(activeThumb);
        const activePosition = activeIndex * (thumbWidth + gap);

        const isFullyVisible = activePosition >= scrollLeft &&
            activePosition + thumbWidth <= scrollLeft + containerWidth;

        if (!isFullyVisible) {
            let targetScroll = activePosition - (containerWidth - thumbWidth) / 2;

            targetScroll = Math.max(0, Math.min(targetScroll, container.scrollWidth - containerWidth));

            container.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        }
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
        btn.innerHTML = `<svg width="9" height="24"><use xlink:href="./app-sprite.svg#arrow-right"></use></svg>`;
        return btn;
    }

    _createZoomButton() {
        const btn = document.createElement('button');
        btn.className = this.#ZOOM_BUTTON_SELECTOR;
        btn.innerHTML = `<svg width="24" height="24"><use xlink:href="./app-sprite.svg#zoom"></use></svg>`;
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

        this._scrollToActiveThumbnail();
    }

    showPrevImage() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateImageInModal();
    }

    showNextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateImageInModal();
    }

    _handleResize() {
        this._scrollToActiveThumbnail();
    }

    destroy() {
        window.removeEventListener('resize', this._handleResize);
    }
}

window.AppSwiperZoom = AppSwiperZoom;

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('swiper-container.js-swiper-zoom').forEach(container => {
        new AppSwiperZoom(container);
    });
});