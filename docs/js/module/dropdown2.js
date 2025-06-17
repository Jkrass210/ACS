export function dropdown2 (classDropdown) {
  const dropdowns = document.querySelectorAll(classDropdown);
  
  dropdowns.forEach(dropdown => {
    const btn = dropdown.querySelector('.drop-down-2__btn');
    const input = dropdown.querySelector('.drop-down-2__input');
    const list = dropdown.querySelector('.drop-down-2__list');
    const items = list.querySelectorAll('li');
    
    // Функция для закрытия всех выпадающих списков
    function closeAllDropdowns() {
      document.querySelectorAll('.drop-down-2__btn').forEach(dropdownBtn => {
        dropdownBtn.classList.remove('active');
      });
    }
    
    // Функция для проверки и добавления класса disabled
    function checkSelectedItem() {
      items.forEach(item => {
        item.classList.remove('disabled');
        if (item.textContent.trim() === input.value.trim()) {
          item.classList.add('disabled');
        }
      });
    }
    
    // Обработчик клика по кнопке
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Закрываем все другие выпадающие списки
      closeAllDropdowns();
      
      // Открываем/закрываем текущий
      if (this.classList.contains('active')) {
        this.classList.remove('active');
      } else {
        this.classList.add('active');
        checkSelectedItem();
      }
    });
    
    // Обработчик клика по элементам списка
    items.forEach(item => {
      item.addEventListener('click', function() {
        input.value = this.textContent;
        btn.classList.remove('active');
        checkSelectedItem();
      });
    });
    
    // Закрытие при клике вне списка
    document.addEventListener('click', function(e) {
      if (!dropdown.contains(e.target)) {
        btn.classList.remove('active');
      }
    });
    
    // Закрытие при нажатии Esc
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        btn.classList.remove('active');
      }
    });
    
    // Закрытие при скролле
    window.addEventListener('scroll', function() {
      btn.classList.remove('active');
    }, { passive: true });
  });
}