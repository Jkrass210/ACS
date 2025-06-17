export function counterAnim() {
  // Настройки анимации
  const ANIMATION_DURATION = 5000; // 5 секунд
  const FRAME_DURATION = 1000 / 60; // ~60 FPS
  
  // Получаем все блоки счетчиков
  const counterBlocks = document.querySelectorAll('.cardCounter');
  
  // Проверка видимости элемента
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) * 1.1 && // +10% для раннего срабатывания
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  
  // Анимация счетчика
  function animateCounter(counterBlock) {
    const hiddenNumberEl = counterBlock.querySelector('.cardCounter__number.hidden');
    const visibleNumberEl = counterBlock.querySelector('.cardCounter__number.number');
    const spanEl = visibleNumberEl.querySelector('span');
    
    // Получаем целевое число
    const targetNumber = parseInt(hiddenNumberEl.textContent.replace(/\s+/g, '').replace('+', ''));
    const totalFrames = Math.round(ANIMATION_DURATION / FRAME_DURATION);
    
    // Сохраняем оригинальный span
    const originalSpan = spanEl ? spanEl.outerHTML : '';
    
    let frame = 0;
    const animate = () => {
      frame++;
      const progress = Math.min(frame / totalFrames, 1);
      const currentNumber = Math.floor(targetNumber * progress);
      
      // Форматирование числа
      const formattedNumber = currentNumber.toLocaleString('ru-RU');
      
      // Обновляем только число, сохраняя span
      if (spanEl) {
        visibleNumberEl.innerHTML = formattedNumber + originalSpan;
      } else {
        visibleNumberEl.textContent = formattedNumber;
      }
      
      if (frame < totalFrames) {
        requestAnimationFrame(animate);
      } else {
        // Финализируем анимацию
        const finalNumber = targetNumber.toLocaleString('ru-RU');
        visibleNumberEl.innerHTML = spanEl 
          ? `${finalNumber}${originalSpan}`
          : finalNumber;
        
        // Добавляем класс active к span если он есть
        if (spanEl) {
          visibleNumberEl.querySelector('span').classList.add('active');
        }
      }
    };
    
    requestAnimationFrame(animate);
  }
  
  // Обработчик скролла
  function handleScroll() {
    let allAnimated = true;
    
    counterBlocks.forEach(block => {
      if (!block.classList.contains('animated') && isElementInViewport(block)) {
        animateCounter(block);
        block.classList.add('animated');
      }
      
      if (!block.classList.contains('animated')) {
        allAnimated = false;
      }
    });
    
    if (allAnimated) {
      window.removeEventListener('scroll', handleScroll);
    }
  }
  
  // Первичная проверка
  let needScrollListener = false;
  
  counterBlocks.forEach(block => {
    if (isElementInViewport(block)) {
      animateCounter(block);
      block.classList.add('animated');
    } else {
      needScrollListener = true;
    }
  });
  
  if (needScrollListener) {
    window.addEventListener('scroll', handleScroll);
  }
}