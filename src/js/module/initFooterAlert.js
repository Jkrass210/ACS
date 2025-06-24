export function initFooterAlert() {
  // Находим элементы только в контексте футера
  const footer = document.querySelector('.footer-alert');
  if (!footer) return;

  const container = footer.querySelector('.container');
  const boxLeftBottom = footer.querySelector('.box-left-1__bottom');
  const boxLeft1 = footer.querySelector('.box-left-1');
  
  if (!container || !boxLeftBottom || !boxLeft1) return;

  // Функция для проверки ширины экрана и перемещения элемента
  function moveElement() {
    if (window.innerWidth <= 1200) {
      // Если элемент еще не перемещен - перемещаем его в конец контейнера
      if (boxLeftBottom.parentNode === boxLeft1) {
        container.appendChild(boxLeftBottom);
      }
    } else {
      // Если экран больше 1200px и элемент не на своем месте - возвращаем обратно
      if (boxLeftBottom.parentNode !== boxLeft1) {
        const boxLeft1BottomDiv = boxLeft1.querySelector('.box-left-1__bottom + *') || boxLeft1.querySelector('.box-left-1__top');
        if (boxLeft1BottomDiv) {
          boxLeft1.insertBefore(boxLeftBottom, boxLeft1BottomDiv.nextSibling);
        } else {
          boxLeft1.appendChild(boxLeftBottom);
        }
      }
    }
  }

  // Вызываем при загрузке
  moveElement();

  // Добавляем обработчик на изменение размера окна с debounce для оптимизации
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(moveElement, 100);
  });
}