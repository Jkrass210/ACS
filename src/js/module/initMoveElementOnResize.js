export function initMoveElementOnResize(options) {
    const defaultOptions = {
      breakpoint: 825,
      moves: [
        // Первое перемещение (город)
        {
          element: '.header-alert__box-form-city',
          source: '.header-alert__line-top-wrapper',
          target: '.header-alert__left-wrapper',
          position: 'append'
        },
        // Второе перемещение (телефон)
        {
          element: '.header-alert__link.phone',
          source: '.header-alert__box-connect',
          target: '.header-alert__line-bottom-wrapper',
          position: 'insert',
          insertPosition: 1 // Вставляем вторым элементом
        },
        // Третье перемещение (кнопка каталога)
        {
          element: '.btn-catalog',
          source: '.header-alert__box-btn-catalog',
          target: '.header-alert__right-wrapper',
          position: 'prepend'
        }
      ]
    };

    // Объединяем переданные настройки с дефолтными
    const config = { ...defaultOptions, ...options };

    // Инициализируем все перемещения
    config.moves.forEach(move => {
      setupElementMove(move, config.breakpoint);
    });

    /**
     * Настраивает перемещение для одного элемента
     * @param {Object} move - Конфигурация перемещения
     * @param {number} breakpoint - Ширина срабатывания
     */
    function setupElementMove(move, breakpoint) {
      const element = document.querySelector(move.element);
      const sourceBlock = document.querySelector(move.source);
      const targetBlock = document.querySelector(move.target);

      if (!element || !sourceBlock || !targetBlock) {
        console.warn(`Elements not found for selector: ${move.element}`);
        return;
      }

      let isMoved = false;

      function checkAndMoveElement() {
        const viewportWidth = window.innerWidth;

        if (viewportWidth <= breakpoint && !isMoved) {
          // Перемещаем элемент в целевой блок
          if (move.position === 'insert' && move.insertPosition !== undefined) {
            const children = targetBlock.children;
            if (children.length > move.insertPosition) {
              targetBlock.insertBefore(element, children[move.insertPosition]);
            } else {
              targetBlock.appendChild(element);
            }
          } else if (move.position === 'prepend') {
            targetBlock.insertBefore(element, targetBlock.firstChild);
          } else {
            targetBlock.appendChild(element);
          }
          isMoved = true;
        } else if (viewportWidth > breakpoint && isMoved) {
          // Возвращаем элемент в исходный блок
          if (move.sourcePosition === 'prepend') {
            sourceBlock.insertBefore(element, sourceBlock.firstChild);
          } else {
            sourceBlock.appendChild(element);
          }
          isMoved = false;
        }
      }

      // Первая проверка при загрузке
      checkAndMoveElement();

      // Обработчик изменения размера с debounce
      let resizeTimeout;
      window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(checkAndMoveElement, 100);
      });
    }
  }

  // Экспорт функции
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = initMoveElementOnResize;
  } else {
    window.initMoveElementOnResize = initMoveElementOnResize;
  }