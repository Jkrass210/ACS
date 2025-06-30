export function certificateChanges() {
  const helpBtn = document.querySelector('.box-certificate .help-btn');
    
    helpBtn?.addEventListener('click', function() {
        const list = document.querySelector('.box-certificate__list');
        
        list?.classList.toggle('vertical');
        list?.classList.toggle('horizontal');
    });
}