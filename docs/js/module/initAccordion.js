export function initAccordion(options) {
  const {
    accordionListClass = 'box-tabs-question__list',
    itemClass = 'box-tabs-question__item',
    buttonClass = 'box-tabs-question__btn',
    contentClass = 'box-tabs-question__desc',
    activeClass = 'active'
  } = options || {};

  const accordions = document.querySelectorAll(`.${accordionListClass}`);

  if (!accordions.length) return;

  accordions.forEach(accordion => {
    const items = accordion.querySelectorAll(`.${itemClass}`);
    let activeItem = null;

    function closeAllItems() {
      items.forEach(item => {
        const button = item.querySelector(`.${buttonClass}`);
        const content = item.querySelector(`.${contentClass}`);
        button.classList.remove(activeClass);
        content.style.display = 'none';
      });
      activeItem = null;
    }

    function toggleItem(item) {
      const button = item.querySelector(`.${buttonClass}`);
      const content = item.querySelector(`.${contentClass}`);

      if (activeItem === item) {
        button.classList.remove(activeClass);
        content.style.display = 'none';
        activeItem = null;
      } else {
        closeAllItems();
        button.classList.add(activeClass);
        content.style.display = 'block';
        activeItem = item;
      }
    }

    // Инициализация - скрываем все контенты
    items.forEach(item => {
      const content = item.querySelector(`.${contentClass}`);
      content.style.display = 'none';
    });

    // Обработчики кликов
    items.forEach(item => {
      const button = item.querySelector(`.${buttonClass}`);
      
      button.addEventListener('click', (e) => {
        e.preventDefault();
        toggleItem(item);
      });
    });

    // Закрытие по Esc
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllItems();
      }
    });
  });
}