export function initBurgerMenu() {
  const burgerButton = document.getElementById('burger');
  const burgerMenu = document.getElementById('burgerMemu');
  
  if (!burgerButton || !burgerMenu) return;

  // Функция для переключения состояния меню
  function toggleMenu() {
    burgerButton.classList.toggle('active');
    burgerMenu.classList.toggle('active');
    
    if (burgerMenu.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  // Функция для закрытия меню
  function closeMenu() {
    burgerButton.classList.remove('active');
    burgerMenu.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Обработчик клика по бургер-кнопке
  burgerButton.addEventListener('click', function(e) {
    e.stopPropagation(); // Предотвращаем всплытие, чтобы не сработал document.click
    toggleMenu();
  });

  // Обработчик клика по документу (закрытие при клике вне меню)
  document.addEventListener('click', function(e) {
    if (burgerMenu.classList.contains('active') && 
        !e.target.closest('#burgerMemu') && 
        !e.target.closest('#burger')) {
      closeMenu();
    }
  });

  // Обработчик нажатия клавиши Esc
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && burgerMenu.classList.contains('active')) {
      closeMenu();
    }
  });

  // Предотвращаем всплытие кликов внутри меню
  burgerMenu.addEventListener('click', function(e) {
    e.stopPropagation();
  });
}