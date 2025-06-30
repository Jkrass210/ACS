import { initModal } from './module/initModal.js';
import { setupFormValidation } from './module/setupFormValidation.js';
import { dropdown2 } from './module/dropdown2.js';
import { counterAnim } from './module/counterAnim.js';
import { initAccordion } from './module/initAccordion.js';
import { initThreeCardSlider } from './module/initThreeCardSlider.js';
import { initFalseImg } from './module/initFalseImg.js';
import { initSliderItemsCards } from './module/initSliderItemsCards.js';
import { initHelpBtnToggle } from './module/initHelpBtnToggle.js';
import { initMoveElementOnResize } from './module/initMoveElementOnResize.js';
import { initFooterAlert } from './module/initFooterAlert.js';
import { initBurgerMenu } from './module/initBurgerMenu.js';
import { fieldsetStar } from './module/fieldsetStar.js';
import { certificateChanges } from './module/certificateChanges.js';


if (document.querySelectorAll('.box-call__btn')) {
  initModal({
    boxSelector: '.box-call',
    triggerSelector: '.box-call__btn',
    modalWrapperSelector: '.box-call__modal-wrapper',
    modalContentSelector: '.box-call__modal',
    closeBtnSelector: '.btn-close',
    activeClass: 'active'
  });
}

if (document.querySelectorAll('.box-ack-form__btn')) {
  initModal({
    boxSelector: '.box-ack-form',
    triggerSelector: '.box-ack-form__btn',
    modalWrapperSelector: '.box-ack-form__modal-wrapper',
    modalContentSelector: '.box-ack-form__modal',
    closeBtnSelector: '.btn-close',
    activeClass: 'active'
  });
}

if (document.querySelectorAll('.box-become-partner__btn')) {
  initModal({
    boxSelector: '.box-become-partner',
    triggerSelector: '.box-become-partner__btn',
    modalWrapperSelector: '.box-become-partner__modal-wrapper',
    modalContentSelector: '.box-become-partner__modal',
    closeBtnSelector: '.btn-close',
    activeClass: 'active'
  });
}

if (document.querySelectorAll('.box-leave-review__btn')) {
  initModal({
    boxSelector: '.box-leave-review',
    triggerSelector: '.box-leave-review__btn',
    modalWrapperSelector: '.box-leave-review__modal-wrapper',
    modalContentSelector: '.box-leave-review__modal',
    closeBtnSelector: '.btn-close',
    activeClass: 'active'
  });
}

if (document.querySelectorAll('.box-call__form')) {
  document.querySelectorAll(".box-call__form").forEach(form => {
    setupFormValidation(form, ".box-call__submit");
  });
}

if (document.querySelectorAll('.box-leave-review__form')) {
  document.querySelectorAll(".box-leave-review__form").forEach(form => {
    setupFormValidation(form, ".box-leave-review__submit");
  });
}

if (document.querySelectorAll('.box-payment-order__form')) {
  document.querySelectorAll(".box-payment-order__form").forEach(form => {
    setupFormValidation(form, ".slide-content__link");
  });
}

if (document.querySelectorAll('.box-ack-form__form')) {
  document.querySelectorAll(".box-ack-form__form").forEach(form => {
    setupFormValidation(form, ".box-ack-form__submit");
  });
}

if (document.querySelectorAll('.box-become-partner__form')) {
  document.querySelectorAll(".box-become-partner__form").forEach(form => {
    setupFormValidation(form, ".box-become-partner__submit");
  });
}

if (document.querySelector('.box-hero__main-banner-slider')) {
  $('.box-hero__main-banner-slider').slick({
    dots: true,
    infinite: false,
    //speed: 500,
    //fade: true,
    cssEase: 'linear',
    slidesToShow: 2,  // Показывать 2 слайда одновременно
    slidesToScroll: 2, // Прокручивать по 2 слайда
    responsive: [
      {
        breakpoint: 825,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  });
}

if (document.querySelectorAll('.drop-down-2')) {
  dropdown2('.drop-down-2')
}

if (document.querySelectorAll('.box-banner-counter')) {
  counterAnim()
}

if (document.querySelectorAll('.box-tabs-question')) {
  initAccordion();
}

if (document.querySelectorAll('.slider-three-card')) {
  initThreeCardSlider()
}

if (document.querySelectorAll('.box-manufacturers__slider')) {
  $('.box-manufacturers__slider').each(function () {
    $(this).slick({
      slidesToShow: 7,
      slidesToScroll: 1,
      infinite: false,
      arrows: true,
      dots: false,
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 5
          }
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 4
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 3
          }
        },
        {
          breakpoint: 576,
          settings: {
            slidesToShow: 2
          }
        }
      ]
    });
  });
}

if (document.querySelectorAll('.card-reviews')) {
  initFalseImg();
}

if (document.querySelectorAll('.slider-items-cards')) {
  initSliderItemsCards();
}

if (document.querySelectorAll('.help-btn')) {
  initHelpBtnToggle()
}

if (document.querySelectorAll('.slider-five-card__list')) {
  document.querySelectorAll('.slider-five-card__list').forEach((slider) => {
    $(slider).slick({
      slidesToShow: 5,       // Показывать 5 слайдов одновременно
      slidesToScroll: 5,     // Прокручивать по 5 слайдов
      infinite: false,       // Бесконечная прокрутка отключена
      dots: false,            // Показывать точки-индикаторы
      arrows: true,          // Показывать стрелки навигации
      responsive: [          // Адаптивные настройки
        {
          breakpoint: 1200,  // При ширине экрана меньше 1200px
          settings: {
            slidesToShow: 4,
            slidesToScroll: 4
          }
        },
        {
          breakpoint: 992,   // При ширине экрана меньше 992px
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3
          }
        },
        {
          breakpoint: 768,   // При ширине экрана меньше 768px
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        },
      ]
    });
  });
}

if (document.querySelector('.header-alert__line-top-wrapper' && '.header-alert__left-wrapper')) {
  initMoveElementOnResize({
    breakpoint: 825
  });
}

if (document.querySelectorAll('.footer-alert .box-left-1__bottom')) {
  initFooterAlert();
};

if (document.querySelector('#burger')){
  initBurgerMenu()
}

if (document.querySelectorAll('fieldset.box-star')) {
  fieldsetStar()
}

if (document.querySelector('.box-certificate .help-btn')){
  certificateChanges()
}
