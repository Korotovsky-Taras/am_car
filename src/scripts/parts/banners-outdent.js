document.addEventListener("DOMContentLoaded", () => {

    const header = document.querySelector("header");
    const banner = document.querySelector(".js-banner");

    if(!header || !banner) return;

    const updateBannerMargin = () => {
        if (header && banner) {
            const {height} = header.getBoundingClientRect();
            Object.assign(banner.style, {
                marginTop: `calc(-${height}px + var(--holder-gap))`
            });
        }
    };

    updateBannerMargin();

    if (header && banner) {
        const resizeObserver = new ResizeObserver(() => {
            updateBannerMargin();
        });
        resizeObserver.observe(header);

        document.body.classList.add("app-banner--mods")
    }
})