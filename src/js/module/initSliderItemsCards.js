export function initSliderItemsCards() {
  // Находим все слайдеры на странице
  const $sliders = $('.slider-items-cards');
  
  // Если нет ни одного слайдера - выходим
  if (!$sliders.length) return;

  // Инициализируем каждый найденный слайдер
  $sliders.each(function() {
    $(this).slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      infinite: false,
      arrows: true,
      dots: false,
      responsive: [
        {
          breakpoint: 825,
          settings: {
            slidesToShow: 2
          }
        },
        {
          breakpoint: 560,
          settings: {
            slidesToShow: 1
          }
        }
      ]
    });
  });
}