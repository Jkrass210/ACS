export function initHelpBtnToggle() {
  const helpBtns = document.querySelectorAll('.help-btn');

  if (!helpBtns.length) return;

  // Функция для перемещения блока кнопок в конкретной карточке
  const moveButtonGroup = (cardProduct, isHorizontal) => {
    const buttonGroup = cardProduct.querySelector('.btn-item-group');
    const cardBottom = cardProduct.querySelector('.card-product__bottom');
    const boxImg = cardProduct.querySelector('.box-img');

    if (!buttonGroup || !cardBottom || !boxImg) return;

    // Определяем текущее положение блока
    const isInBottom = buttonGroup.parentElement === cardBottom;

    if (isHorizontal && !isInBottom) {
      // Перемещаем вниз
      cardBottom.appendChild(buttonGroup);
    } else if (!isHorizontal && isInBottom) {
      // Возвращаем на место в box-img
      boxImg.appendChild(buttonGroup);
    }
  };

  // Функция для обработки всех карточек
  const processAllCards = (catalogList) => {
    const isHorizontal = catalogList.classList.contains('horizontal');
    document.querySelectorAll('.card-product').forEach(card => {
      moveButtonGroup(card, isHorizontal);
    });
  };

  helpBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const catalogList = this.closest('.box-catalog__list') ||
        document.querySelector('.box-catalog__list');

      if (!catalogList) return;

      // Переключаем классы
      if (catalogList.classList.contains('horizontal')) {
        catalogList.classList.remove('horizontal');
        catalogList.classList.add('vertical');
      } else if (catalogList.classList.contains('vertical')) {
        catalogList.classList.remove('vertical');
        catalogList.classList.add('horizontal');
      } else {
        catalogList.classList.add('horizontal');
      }

      // Обрабатываем все карточки
      processAllCards(catalogList);
    });
  });

  // Инициализация положения кнопок при загрузке
  document.addEventListener('DOMContentLoaded', function () {
    const catalogList = document.querySelector('.box-catalog__list');
    if (catalogList) {
      processAllCards(catalogList);
    }
  });
}