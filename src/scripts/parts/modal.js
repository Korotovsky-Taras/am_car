class AppModal {
    constructor(contentId) {
        this.contentId = contentId;
        this.modalContent = null;

        this.isOpen = false;
        this.closable = false;

        this.modalElement = this._createModalElement();
        this.wrapperElement = this._createWrapperPanel();
        this.contentPanel = this._createContentPanel();
        this.closeButton = this._createCloseButton();

        this.wrapperElement.append(this.closeButton);
        this.wrapperElement.append(this.contentPanel);
        this.modalElement.append(this.wrapperElement);

        this._setupEvents();
    }

    _createModalElement() {
        const div = document.createElement('div');
        div.className = 'app-modal';
        return div;
    }

    _createCloseButton() {
        const btn = document.createElement('button');
        btn.innerHTML = `<svg width="14" height="24"><use xlink:href="/app-sprite.svg#close"></use></svg>`;
        btn.className = 'app-modal__close';
        return btn;
    }

    _createWrapperPanel() {
        const div = document.createElement('div');
        div.className = 'app-modal__wrapper';
        return div;
    }

    _createContentPanel() {
        const div = document.createElement('div');
        div.className = 'app-modal__content';
        return div;
    }


    _setupEvents() {
        this.closeButton.addEventListener('click', () => this.close());
        this.modalElement.addEventListener('click', (e) => {
            if (this.closable && !this.wrapperElement.contains(e.target)) {
                this.close();
                return;
            }

            const closeButton = e.target.closest('.js-modal-close');
            if (closeButton) {
                this.close();
                return;
            }

            if (e.target.classList.contains('js-modal-close')) {
                this.close();
            }
        });
        this.modalElement.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
    }

    _animate(type = 'show') {
        const elements = [this.modalElement];

        const animate = (timestamp) => {
            document.body.style.overflow =  'hidden';

            if (!this.startTime) this.startTime = timestamp;

            const progress = (timestamp - this.startTime) / 300;
            elements.forEach(el => {
                el.style.opacity = type === 'show'
                    ? Math.min(progress, 1)
                    : Math.max(1 - progress, 0);
            });

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.startTime = null;
                if (type === 'hide') {
                    this._removeFromDOM();
                    document.body.style.overflow = null;
                }
            }
        };

        requestAnimationFrame(animate);
    }

    _addToDOM(contentElement) {
        document.body.append(this.modalElement);
        this.contentPanel.append(contentElement);
    }

    _removeFromDOM() {
        this.modalElement.remove();
    }

    _getModalContentElement() {
        if (this.modalContent == null) {
            this.modalContent = document.getElementById(this.contentId) || null;
        }
        return this.modalContent;
    }

    open() {
        const contentElement = this._getModalContentElement();

        if (this.isOpen || contentElement == null) return;

        this.isOpen = true;

        this._addToDOM(contentElement);
        this._animate('show');
    }

    close() {
        if (!this.isOpen) return;
        this._animate('hide');
        this.isOpen = false;
    }

    setClosable(state) {
        this.closable = state;
    }


}

window.AppModal = AppModal;