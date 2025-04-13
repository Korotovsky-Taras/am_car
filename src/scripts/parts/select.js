

class AppSelect {
    #POPUP_SELECTOR = 'app-select__popup';
    #POPUP_CONTENT_SELECTOR = 'app-select__popup-content';
    #POPUP_ROOT_STYLE = '.' + this.#POPUP_SELECTOR;
    #POPUP_OPTION_SELECTOR = 'app-select__option';
    #POPUP_OPTION_STYLE = '.' + this.#POPUP_OPTION_SELECTOR;
    #POPUP_HEADER_SELECTOR = 'app-select__popup-header';
    #POPUP_HEADER_TITLE_SELECTOR = 'app-select__popup-header-title';
    #POPUP_HEADER_RESET_SELECTOR = 'app-select__popup-header-reset';
    #POPUP_OPTIONS_CONTAINER_SELECTOR = 'app-select__popup-options';
    #POPUP_OPTION_GROUP_SELECTOR = 'app-select__optgroup';
    #POPUP_OPTION_GROUP_LABEL_SELECTOR = 'app-select__optgroup-label';
    #POPUP_APPLY_SELECTOR = 'app-select__popup-apply';
    #POPUP_APPLY_STYLE = '.' + this.#POPUP_APPLY_SELECTOR;

    #POPUP_ANCHOR_SELECTOR = 'app-select__view';
    #POPUP_ANCHOR_STYLE = '.' + this.#POPUP_ANCHOR_SELECTOR;
    #POPUP_PLACEHOLDER_SELECTOR = 'app-select__placeholder';
    #WITH_PLACEHOLDER_CLASS = 'app-select--with-placeholder';
    #WITH_COUNT_CLASS = 'app-select--with-count';

    constructor(el) {
        this.el = el;
        this.activePopup = null;
        this.selectedItems = new Set();
        this.initialSelectedItems = new Set();

        const selectView = this.el.querySelector(this.#POPUP_ANCHOR_STYLE);
        this.initialTitle = selectView ? selectView.textContent : '';

        const select = this.el.querySelector('select');
        const placeholderOption = select ? select.querySelector('option[value="placeholder"]') : null;
        this.initialPlaceholder = placeholderOption ? placeholderOption.textContent : '';
        
        this.init();
    }

    get isMobile() {
        return window.matchMedia('(max-width: 1024px)').matches;
    }


    _createHeaderTitle(titleText) {
        const title = document.createElement('div');
        title.innerHTML = `<svg width="9" height="24"><use xlink:href="/app-sprite.svg#arrow-left"></use></svg> <span>${titleText}</span>`;
        title.className = this.#POPUP_HEADER_TITLE_SELECTOR;
        return title;
    }
    
    _createPlaceholder(text) {
        const placeholder = document.createElement('div');
        placeholder.className = this.#POPUP_PLACEHOLDER_SELECTOR;
        placeholder.textContent = text;
        return placeholder;
    }

    _createResetButton(text) {
        const btn = document.createElement('button');
        btn.innerHTML = `<span>${text}</span> <svg width="14" height="24"><use xlink:href="./app-sprite.svg#close"></use></svg>`;
        btn.className = this.#POPUP_HEADER_RESET_SELECTOR;
        return btn;
    }

    init() {
        this.setupSelect();

        document.addEventListener('click', (e) => {
            if (this.activePopup) {
                const clickedOnSelect = this.el.contains(e.target);
                const clickedOnPopup = this.activePopup.contains(e.target);

                if (!clickedOnSelect && !clickedOnPopup) {
                    if (!this.isMobile) {
                        this.closePopup();
                    }
                    else if (!this.el.querySelector('select').hasAttribute('data-multichoice')) {
                        this.closePopup();
                    }
                }
            }
        });

        window.addEventListener('resize', () => {
            if (this.activePopup) {
                this.positionPopup(this.activePopup);
            }
        });
    }

    loadInitialSelection() {
        const select = this.el.querySelector('select');
        const selectedOptions = select.querySelectorAll('option:checked');

        selectedOptions.forEach(option => {
            if (option.value !== 'placeholder') {
                this.selectedItems.add(option.value);
            }
        });
    }


    setupSelect() {
        const selectView = this.el.querySelector(this.#POPUP_ANCHOR_STYLE);
        const nativeSelect = this.el.querySelector('select');
        const placeholderOption = nativeSelect.querySelector('option[value="placeholder"]');

        if (nativeSelect.dataset.multichoice) {
            this.el.classList.add('multi');
        }
        
        if (nativeSelect.getAttribute('data-change-view') === 'false') {
            this.el.classList.add(this.#WITH_COUNT_CLASS);
        }
        
        if (placeholderOption) {
            this.el.classList.add(this.#WITH_PLACEHOLDER_CLASS);
        }
        
        let placeholderElement = this.el.querySelector(`.${this.#POPUP_PLACEHOLDER_SELECTOR}`);
        if (!placeholderElement && this.initialPlaceholder) {
            placeholderElement = this._createPlaceholder(this.initialPlaceholder);
            selectView.after(placeholderElement);
        }

        if (selectView) {
            selectView.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (this.activePopup) {
                    this.closePopup();
                } else {
                    const openPopups = document.querySelectorAll(this.#POPUP_ROOT_STYLE);
                    openPopups.forEach(popup => {
                        if (popup !== this.activePopup) {
                            const selectInstance = window.appSelectInstances?.find(
                                instance => instance.activePopup === popup
                            );
                            selectInstance?.closePopup();
                        }
                    });

                    this.openPopup();
                }
            });
        }

        this.setInitialValue();
    }

    setInitialValue() {
        const selectView = this.el.querySelector(this.#POPUP_ANCHOR_STYLE);
        const select = this.el.querySelector('select');
        const placeholderOption = select.querySelector('option[value="placeholder"]');

        if (selectView && placeholderOption) {
            if (!select.hasAttribute('data-change-view') || select.getAttribute('data-change-view') !== 'false') {
                selectView.textContent = placeholderOption.textContent;
            }
        }

        if (this.selectedItems.size > 0) {
            this.updateViewText();
        }
    }

    openPopup() {
        const select = this.el.querySelector('select');

        this.initialSelectedItems = new Set(this.selectedItems);

        const popup = document.createElement('div');
        const popupContent = document.createElement('div');
        popup.className = this.#POPUP_SELECTOR;
        popupContent.className = this.#POPUP_CONTENT_SELECTOR;


        if (this.isMobile) {
            const header = document.createElement('div');
            header.className = this.#POPUP_HEADER_SELECTOR;

            const title = this._createHeaderTitle(this.initialTitle);
            title.addEventListener('click', () => {
                this.closePopup();
            })

            const resetBtn = this._createResetButton('Сбросить');
            resetBtn.addEventListener('click', () => {
                this.resetSelection();
                this.applySelection();
                this.closePopup();
            });

            header.appendChild(title);
            header.appendChild(resetBtn);
            popup.appendChild(header);
        }


        popup.appendChild(popupContent);

        const optionsContainer = document.createElement('div');
        optionsContainer.className = this.#POPUP_OPTIONS_CONTAINER_SELECTOR;

        this.populateOptions(optionsContainer, select);
        popupContent.appendChild(optionsContainer);

        if (select.hasAttribute('data-multichoice') || this.isMobile) {
            const applyBtn = document.createElement('div');
            applyBtn.className = this.#POPUP_APPLY_SELECTOR;
            applyBtn.textContent = 'Применить';

            if (!this.isMobile && select.hasAttribute('data-multichoice')) {
                applyBtn.style.display = 'none';
            }

            applyBtn.addEventListener('click', () => {
                this.applySelection();
                this.closePopup();
            });

            popupContent.appendChild(applyBtn);
        }

        document.body.appendChild(popup);
        this.activePopup = popup;

        this.positionPopup(popup);
    }

    populateOptions(container, select) {
        const options = select.querySelectorAll(':scope > option, :scope > optgroup');
        const isMulti = select.hasAttribute('data-multichoice');

        options.forEach(option => {
            if (option.tagName === 'OPTGROUP') {
                const groupEl = document.createElement('div');
                groupEl.className = this.#POPUP_OPTION_GROUP_SELECTOR;

                const labelEl = document.createElement('div');
                labelEl.className = this.#POPUP_OPTION_GROUP_LABEL_SELECTOR;
                labelEl.textContent = option.getAttribute('label');
                groupEl.appendChild(labelEl);

                const groupOptions = option.querySelectorAll(':scope > option');
                groupOptions.forEach(groupOption => {
                    if (groupOption.value !== 'placeholder') {
                        const optionEl = this.createOptionElement(groupOption, isMulti);
                        groupEl.appendChild(optionEl);
                    }
                });

                container.appendChild(groupEl);
            } else if (option.tagName === 'OPTION' && option.value !== 'placeholder') {
                const optionEl = this.createOptionElement(option, isMulti);
                container.appendChild(optionEl);
            }
        });
    }

    createOptionElement(option, isMulti) {
        const optionEl = document.createElement('div');
        optionEl.className = this.#POPUP_OPTION_SELECTOR;
        optionEl.dataset.value = option.value;
        optionEl.textContent = option.textContent;

        if (this.selectedItems.has(option.value)) {
            optionEl.classList.add('active');
        }

        optionEl.addEventListener('click', (e) => {
            e.stopPropagation();

            if (isMulti) {
                optionEl.classList.toggle('active');

                if (!this.isMobile) {
                    this.updateApplyButtonVisibility();
                }
            } else {
                const options = optionEl.closest(this.#POPUP_ROOT_STYLE).querySelectorAll(this.#POPUP_OPTION_STYLE);
                options.forEach(opt => opt.classList.remove('active'));
                optionEl.classList.add('active');

                if (!this.isMobile) {
                    this.applySelection();
                    this.closePopup();
                }
            }
        });

        return optionEl;
    }

    updateApplyButtonVisibility() {
        if (!this.activePopup || this.isMobile) return;

        const select = this.el.querySelector('select');
        if (!select.hasAttribute('data-multichoice')) return;

        const applyBtn = this.activePopup.querySelector(this.#POPUP_APPLY_STYLE);
        if (!applyBtn) return;

        const currentSelection = new Set();
        this.activePopup.querySelectorAll('.' + this.#POPUP_OPTION_SELECTOR + '.active').forEach(option => {
            currentSelection.add(option.dataset.value);
        });

        let hasChanges = false;

        if (currentSelection.size !== this.initialSelectedItems.size) {
            hasChanges = true;
        } else {
            for (const value of currentSelection) {
                if (!this.initialSelectedItems.has(value)) {
                    hasChanges = true;
                    break;
                }
            }
        }

        applyBtn.style.display = hasChanges ? 'block' : 'none';
    }

    applySelection() {
        if (!this.activePopup) return;

        const select = this.el.querySelector('select');
        const activeOptions = this.activePopup.querySelectorAll('.app-select__option.active');

        this.selectedItems.clear();

        select.querySelectorAll('option').forEach(option => {
            option.selected = false;
        });

        const selectedTexts = [];
        activeOptions.forEach(option => {
            const value = option.dataset.value;

            Array.from(select.querySelectorAll('option')).forEach(nativeOption => {
                if (nativeOption.value === value) {
                    nativeOption.selected = true;
                    this.selectedItems.add(value);
                    selectedTexts.push(nativeOption.textContent);
                }
            });
        });

        this.updateViewText(selectedTexts);

        const event = new Event('change', { bubbles: true });
        select.dispatchEvent(event);
    }

    updateViewText(selectedTexts) {
        const selectView = this.el.querySelector(this.#POPUP_ANCHOR_STYLE);
        const select = this.el.querySelector('select');
        const placeholderElement = this.el.querySelector(`.${this.#POPUP_PLACEHOLDER_SELECTOR}`);

        const changeView = !select.hasAttribute('data-change-view') || select.getAttribute('data-change-view') !== 'false';
        const useTitleAsPlaceholder = select.getAttribute('data-change-view') === 'true';

        if (!selectedTexts) {
            selectedTexts = [];
            this.selectedItems.forEach(value => {
                const option = select.querySelector(`option[value="${value}"]`);
                if (option) {
                    selectedTexts.push(option.textContent);
                }
            });
        }

        if (selectView) {
            const count = this.selectedItems.size;

            if (count > 0) {
                selectView.dataset.count = count;

                if (changeView) {
                    selectView.innerHTML = `<span class="ellipsis">${selectedTexts.join(", ")}</span>`;
                }
                
                if (placeholderElement && useTitleAsPlaceholder) {
                    placeholderElement.textContent = this.initialTitle;
                }
            } else {
                delete selectView.dataset.count;

                if (changeView) {
                    const placeholderOption = select.querySelector('option[value="placeholder"]');
                    if (placeholderOption) {
                        selectView.textContent = placeholderOption.textContent;
                    }
                }
                
                if (placeholderElement && useTitleAsPlaceholder) {
                    placeholderElement.textContent = this.initialPlaceholder;
                }
            }
        }
    }

    resetSelection() {
        if (!this.activePopup) return;

        const options = this.activePopup.querySelectorAll(this.#POPUP_OPTION_STYLE);
        options.forEach(option => {
            option.classList.remove('active');
        });

        this.selectedItems.clear();
    }

    positionPopup(popup) {
        const selectRect = this.el.getBoundingClientRect();
        const scrollableParent = this.findScrollableParent(this.el);
        const parentRect = scrollableParent.getBoundingClientRect();

        const relativeTop = selectRect.top - parentRect.top + scrollableParent.scrollTop;
        let relativeLeft = selectRect.left - parentRect.left;

        const spaceBelow = parentRect.height - (selectRect.bottom - parentRect.top);
        const spaceAbove = selectRect.top - parentRect.top;
        const popupHeight = Math.min(popup.offsetHeight, parentRect.height * 0.8);

        let top;
        if (spaceBelow >= popupHeight || spaceBelow >= spaceAbove) {
            top = relativeTop + selectRect.height;
        } else {
            top = relativeTop - popupHeight;
        }

        const select = this.el.querySelector('select');
        if (select.hasAttribute('data-horizontal-pos') && select.getAttribute('data-horizontal-pos') === 'right') {
            relativeLeft = selectRect.right - popup.offsetWidth
        }

        const maxTop = parentRect.height - popupHeight;
        top = Math.max(0, Math.min(top, maxTop));

        popup.style.position = 'absolute';
        popup.style.top = `${top}px`;
        popup.style.left = `${relativeLeft}px`;
        popup.style.width = `${selectRect.width}px`;
        popup.style.maxHeight = `${parentRect.height * 0.8}px`;
        popup.style.overflowY = 'auto';

        if (!this.isMobile) {
            scrollableParent.appendChild(popup);
        }
    }

    findScrollableParent(element) {
        let parent = element.parentElement;
        while (parent) {
            const style = window.getComputedStyle(parent);
            if (style.overflowY === 'auto' || style.overflowY === 'scroll' ||
                style.overflow === 'auto' || style.overflow === 'scroll') {
                return parent;
            }
            parent = parent.parentElement;
        }
        return document.body;
    }

    closePopup() {
        if (this.activePopup) {
            this.activePopup.remove();
            this.activePopup = null;
        }
    }

}

window.AppSelect = AppSelect;

document.addEventListener('DOMContentLoaded', () => {
    window.appSelectInstances = [];
    document.querySelectorAll('.app-select').forEach(select => {
        window.appSelectInstances.push(new AppSelect(select));
    });
});