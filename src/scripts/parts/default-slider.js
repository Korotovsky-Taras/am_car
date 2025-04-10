document.addEventListener("DOMContentLoaded", () => {
    const allSliders = document.querySelectorAll(".js-default-swiper");

    Array.from(allSliders).forEach(swiper => {

        const slidePrevButton = swiper.querySelector('div[slot=\'container-start\'] .swiper-left');
        const slideNextButton = swiper.querySelector('div[slot=\'container-end\'] .swiper-right');

        const params = {
            loop: false,
            slidesPerView: "auto",
            spaceBetween: 8,
            breakpoints: {
                1024: {
                    spaceBetween: 32,
                },
            },
            injectStyles: [
                `:host .swiper{
                    overflow: visible;
                  }`,
            ],
        };

        Object.assign(swiper, params);

        swiper.initialize();

        const toggleSlideButtonsStatus = (s) => {
            if (!s) {
                return;
            }
            slidePrevButton.classList.toggle('active', !s.isBeginning);
            slideNextButton.classList.toggle('active', !s.isEnd);
        }

        const {swiper: sw} = swiper;

        toggleSlideButtonsStatus(sw);

        if (slideNextButton && slidePrevButton) {
            slideNextButton.addEventListener('click', () => {
                if (!sw) return;
                sw.slideNext();
            })
            slidePrevButton.addEventListener('click', () => {
                if (!sw) return;
                sw.slidePrev();
            })
            swiper.addEventListener('swiperslidechange', (e) => {
                const [swiper, _] = e.detail;
                toggleSlideButtonsStatus(swiper);
            });
            swiper.addEventListener('swipertouchmove', (e) => {
                swiper.classList.toggle('touched', true);
            });
            swiper.addEventListener('swipertouchend', (e) => {
                swiper.classList.toggle('touched', false);
            });
        }
    })
})