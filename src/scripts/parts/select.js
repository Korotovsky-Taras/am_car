class AppSelect {
    constructor(el) {
        this.el = el;
        this.activePopup = null;
        this.selectedItems = new Set();
        this.initialSelectedItems = new Set();
        this.init();
    }

    get isMobile() {
        return window.matchMedia('(max-width: 1024px)').matches;
    }

    init() {
        this.setupSelect();
        this.loadInitialSelection();

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
        const selectView = this.el.querySelector('.app-select__view');
        const nativeSelect = this.el.querySelector('select');

        if (nativeSelect.dataset.multichoice) {
            this.el.classList.add('multi');
        }

        if (selectView) {
            selectView.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (this.activePopup) {
                    this.closePopup();
                } else {
                    const openPopups = document.querySelectorAll('.app-select__popup');
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
        const selectView = this.el.querySelector('.app-select__view');
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

        // Создаем popup
        const popup = document.createElement('div');
        popup.className = 'app-select__popup';

        if (this.isMobile) {
            const header = document.createElement('div');
            header.className = 'app-select__popup-header';

            const title = document.createElement('div');
            title.className = 'app-select__popup-title';
            title.textContent = this.el.querySelector('.app-select__view').textContent;

            const resetBtn = document.createElement('div');
            resetBtn.className = 'app-select__popup-reset';
            resetBtn.textContent = 'Сбросить';
            resetBtn.addEventListener('click', () => {
                this.resetSelection();
                this.applySelection();
                this.closePopup();
            });

            header.appendChild(title);
            header.appendChild(resetBtn);
            popup.appendChild(header);
        }

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'app-select__popup-options';

        this.populateOptions(optionsContainer, select);
        popup.appendChild(optionsContainer);

        if (select.hasAttribute('data-multichoice') || this.isMobile) {
            const applyBtn = document.createElement('div');
            applyBtn.className = 'app-select__popup-apply';
            applyBtn.textContent = 'Применить';

            if (!this.isMobile && select.hasAttribute('data-multichoice')) {
                applyBtn.style.display = 'none';
            }

            applyBtn.addEventListener('click', () => {
                this.applySelection();
                this.closePopup();
            });

            popup.appendChild(applyBtn);
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
                groupEl.className = 'app-select__optgroup';

                const labelEl = document.createElement('div');
                labelEl.className = 'app-select__optgroup-label';
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
        optionEl.className = 'app-select__option';
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
                const options = optionEl.closest('.app-select__popup').querySelectorAll('.app-select__option');
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

        const applyBtn = this.activePopup.querySelector('.app-select__popup-apply');
        if (!applyBtn) return;

        const currentSelection = new Set();
        this.activePopup.querySelectorAll('.app-select__option.active').forEach(option => {
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
        const selectView = this.el.querySelector('.app-select__view');
        const select = this.el.querySelector('select');

        const changeView = !select.hasAttribute('data-change-view') || select.getAttribute('data-change-view') !== 'false';

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
            } else {
                delete selectView.dataset.count;

                if (changeView) {
                    const placeholderOption = select.querySelector('option[value="placeholder"]');
                    if (placeholderOption) {
                        selectView.textContent = placeholderOption.textContent;
                    }
                }
            }
        }
    }

    resetSelection() {
        if (!this.activePopup) return;

        const options = this.activePopup.querySelectorAll('.app-select__option');
        options.forEach(option => {
            option.classList.remove('active');
        });

        this.selectedItems.clear();
    }

    positionPopup(popup) {
        const selectRect = this.el.getBoundingClientRect();
        const scrollTop = document.scrollingElement.scrollTop;
        const clientHeight = document.scrollingElement.clientHeight;
        const popupHeight = popup.offsetHeight;

        let top = scrollTop + selectRect.bottom;
        if (top + popupHeight > clientHeight) {
            top = scrollTop + selectRect.top - popupHeight;
        }

        popup.style.position = 'absolute';
        popup.style.top = `${top}px`;
        popup.style.left = `${selectRect.left}px`;
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