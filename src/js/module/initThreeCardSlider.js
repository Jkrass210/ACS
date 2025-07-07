/*export function initThreeCardSlider() {
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
}*/

/*export function initThreeCardSlider() {
  const sliders = $('.slider-three-card');

  if (!sliders.length) return;

  // Добавляем прелоадер ко всем слайдерам
  sliders.each(function() {
    const $slider = $(this);
    $slider.css('position', 'absolute');
    $slider.css('opacity', '0');
    $slider.before('<div class="min-preloader"><div class="loader"></div></div>');
  });

  // Создаем наблюдатель за пересечениями
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const $slider = $(entry.target);
        const $preloader = $slider.prev('.min-preloader');
        
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

        const settings = {
          ...baseSettings,
          slidesToShow: isTwoCardSlider ? 2 : 3
        };

        // Инициализируем слайдер
        $slider.on('init', function() {
          // После инициализации скрываем прелоадер
          $preloader.remove();
          $slider.css('position', 'relative');
          $slider.css('opacity', '1');
        });

        $slider.slick(settings);
        
        // Прекращаем наблюдение за этим элементом
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.01 // Срабатывает когда 1% элемента видно
  });

  // Начинаем наблюдение за всеми слайдерами
  sliders.each(function() {
    observer.observe(this);
  });
}*/

export function initThreeCardSlider() {
  const sliders = $('.slider-three-card');

  if (!sliders.length) return;

  // Добавляем прелоадер ко всем слайдерам
  sliders.each(function() {
    const $slider = $(this);
    $slider.css({
      'position': 'absolute',
      'opacity': '0'
    });
    $slider.before('<div class="min-preloader"><div class="loader"></div></div>');
  });

  // Функция для определения текущего количества слайдов
  const getCurrentSlidesToShow = (isTwoCardSlider) => {
    const windowWidth = window.innerWidth;
    
    if (windowWidth <= 560) return 1;
    if (windowWidth <= 825) return isTwoCardSlider ? 1 : 2;
    return isTwoCardSlider ? 2 : 3;
  };

  // Создаем наблюдатель за пересечениями
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const $slider = $(entry.target);
        const $preloader = $slider.prev('.min-preloader');
        
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
                slidesToShow: isTwoCardSlider ? 1 : 2,
                //arrows: window.innerWidth <= 825 ? false : true
              }
            },
            {
              breakpoint: 560,
              settings: {
                slidesToShow: 1,
                //arrows: false
              }
            }
          ]
        };

        // Определяем начальное количество слайдов на основе текущей ширины
        const initialSlides = getCurrentSlidesToShow(isTwoCardSlider);
        
        const settings = {
          ...baseSettings,
          slidesToShow: initialSlides
        };

        // Инициализируем слайдер
        $slider.on('init', function() {
          $preloader.remove();
          $slider.css({
            'position': 'relative',
            'opacity': '1'
          });
        });

        $slider.slick(settings);
        
        // Обработчик изменения размера окна
        $(window).on('resize', () => {
          const newSlides = getCurrentSlidesToShow(isTwoCardSlider);
          $slider.slick('slickSetOption', 'slidesToShow', newSlides, true);
        });
        
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.01
  });

  sliders.each(function() {
    observer.observe(this);
  });
}