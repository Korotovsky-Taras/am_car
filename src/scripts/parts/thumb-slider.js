document.addEventListener("DOMContentLoaded", () => {
    const allThumbSwipers = document.querySelectorAll(".js-thumb-swiper");

    Array.from(allThumbSwipers).forEach(swiper => {
        const paginationElement = swiper.querySelector('.swiper-pagination');
        const params = {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 0,
            pagination: {
                el: paginationElement,
                clickable: false,
                bulletClass: 'swiper-pagination-bullet',
                bulletActiveClass: 'swiper-pagination-bullet-active',
            },
            on: {
                init: function() {
                    swiper.classList.add('swiper-initialized');
                }
            }
        };

        Object.assign(swiper, params);

        swiper.initialize();

        const {swiper: sw} = swiper;

        // Handle touch events for better mobile experience
        swiper.addEventListener('swipertouchmove', (e) => {
            swiper.classList.toggle('touched', true);
        });

        swiper.addEventListener('swipertouchend', (e) => {
            swiper.classList.toggle('touched', false);
        });
    })
})