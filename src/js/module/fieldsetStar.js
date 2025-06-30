export function fieldsetStar() {
  const fieldset = document.querySelector('fieldset.box-star');
  
  // Если элемент не найден, просто выходим из функции
  if (!fieldset) {
    return;
  }

  fieldset.addEventListener('change', function (e) {
    // Проверяем, что событие вызвано чекбоксом с классом .star_input
    if (e.target.classList.contains('star_input')) {
      const checkboxes = Array.from(this.querySelectorAll('.star_input'));
      const clickedIndex = checkboxes.indexOf(e.target);

      // Устанавливаем checked для всех чекбоксов до кликнутого (включительно)
      checkboxes.forEach((checkbox, index) => {
        checkbox.checked = index <= clickedIndex;
      });
    }
  });
}