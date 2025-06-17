export const initModal = (options) => {
  const {
    boxSelector,
    triggerSelector,
    modalWrapperSelector,
    modalContentSelector,
    closeBtnSelector,
    activeClass = 'active',
  } = options;

  const triggers = document.querySelectorAll(triggerSelector);
  
  if (!triggers.length) return;

  const handleOpenModal = (trigger) => {
    const box = trigger.closest(boxSelector);
    const modalWrapper = box.querySelector(modalWrapperSelector);
    if (!modalWrapper) return;

    modalWrapper.classList.add(activeClass);
    document.body.style.overflow = 'hidden';

    // Обработчики закрытия
    const modalContent = modalWrapper.querySelector(modalContentSelector);
    const closeBtn = modalWrapper.querySelector(closeBtnSelector);

    const handleCloseModal = () => {
      modalWrapper.classList.remove(activeClass);
      document.body.style.overflow = '';
      removeEventListeners();
    };

    const handleClickOutside = (e) => {
      // Проверяем, что клик был вне модалки и не по триггеру
      if (!modalContent.contains(e.target) && !trigger.contains(e.target)) {
        handleCloseModal();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };

    const removeEventListeners = () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      if (closeBtn) {
        closeBtn.removeEventListener('click', handleCloseModal);
      }
    };

    // Добавляем обработчики с небольшой задержкой, чтобы избежать немедленного срабатывания
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      if (closeBtn) {
        closeBtn.addEventListener('click', handleCloseModal);
      }
    }, 10);
  };

  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      handleOpenModal(trigger);
    });
  });
};