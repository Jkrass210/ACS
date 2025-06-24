export function initThreeCardSlider() {
  const sliders = $('.slider-three-card');

  if (!sliders.length) return;

  sliders.each(function() {
    const $slider = $(this);
    const isTwoCardSlider = $slider.hasClass('slider-two-card');
    
    const baseSettings = {
      slidesToScroll: 1,
      infinite: false,
      arrows: true,
      dots: false,
      responsive: [
        {
          breakpoint: 825,
          settings: {
            slidesToShow: isTwoCardSlider ? 1 : 2
          }
        },
        {
          breakpoint: 560,
          settings: {
            slidesToShow: 1
          }
        }
      ]
    };

    // Добавляем нужное количество слайдов в зависимости от класса
    const settings = {
      ...baseSettings,
      slidesToShow: isTwoCardSlider ? 2 : 3
    };

    $slider.slick(settings);
  });
}