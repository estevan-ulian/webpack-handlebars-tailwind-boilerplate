import Swiper from "swiper";
import { A11y, Autoplay, Navigation, Pagination } from "swiper/modules";

$(() => {
  const swiper = new Swiper(".swiper", {
    modules: [Navigation, Pagination, Autoplay, A11y],
    speed: 400,
    // autoplay: {
    //     delay: 3000,
    //     disableOnInteraction: false,
    // },
    spaceBetween: 100,
    loop: true,
    grabCursor: true,
    slidesPerView: 1,
    a11y: {
      prevSlideMessage: "Slide anterior",
      nextSlideMessage: "Próximo slide",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  swiper.init();
});
