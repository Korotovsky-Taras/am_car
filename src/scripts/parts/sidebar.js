export class AppSidebar {
    #PANEL_INIT_STYLE = "init";
    #ROOT_EXPANDED_STYLE = "ovhidden";
    #PANEL_EXPANDED_STYLE = "expanded";

    constructor(el) {
        this.el = el;
        this.init();
    }


    isReadyToUse() {
        return !!this.el
    }

    isMobile() {
        return 'matchMedia' in window && matchMedia("(max-width: 1024px)").matches;
    }

    init() {

        if (!this.isReadyToUse()) {
            return;
        }

        setTimeout(() => {
            this.el.classList.add(this.#PANEL_INIT_STYLE)
        }, 0);


        document.addEventListener('click', (e) => {
            const button = e.target.closest('.js-sidebar-button');
            if (button) {
                this.toggleExpand();
                return;
            }
            if (e.target.classList.contains('js-sidebar-button')) {
                this.toggleExpand();
            }
            if (!this.el.contains(e.target) && this.el.classList.contains(this.#PANEL_EXPANDED_STYLE)) {
                this.toggleExpand();
            }
        });


        let timeout;
        window.addEventListener('resize', (e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if (this.isMobile()) {
                    return;
                }
                this.expand(false);
            }, 50);
        });
    }

    toggleExpand() {
        const expand = !this.el.classList.contains(this.#PANEL_EXPANDED_STYLE);
        this.expand(expand);
    }

    expand(expand) {
        this.el.classList.toggle(this.#PANEL_EXPANDED_STYLE, expand);
        document.documentElement.classList.toggle(this.#ROOT_EXPANDED_STYLE, expand);
    }

}

window.AppSidebar = AppSidebar;


document.addEventListener("DOMContentLoaded", function() {
    let sidebar = document.querySelector(".js-sidebar-element");
    if (sidebar) {
        new AppSidebar(sidebar);
    }
});