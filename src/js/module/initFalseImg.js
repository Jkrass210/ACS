export function initFalseImg() {
  document.querySelectorAll('.card-reviews').forEach(card => {
    const falseImg = card.querySelector('.false-img span');
    if (!falseImg) return;

    const title = card.querySelector('.name-title');
    if (!title) return;

    const firstLetter = title.textContent.trim().charAt(0);
    falseImg.textContent = firstLetter;
  });
}