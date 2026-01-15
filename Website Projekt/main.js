// Bootstrap form validation
(() => {
  'use strict';
  const forms = document.querySelectorAll('.needs-validation');

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        event.preventDefault();
        alert("Demo: Formular wurde validiert (nicht wirklich gesendet).");
        form.reset();
        form.classList.remove('was-validated');
      }
      form.classList.add('was-validated');
    }, false);
  });
})();

// Gallery filter + modal
(() => {
  const buttons = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-item');

  if (buttons.length && items.length) {
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        items.forEach(item => {
          const cat = item.dataset.category;
          item.classList.toggle('is-hidden', filter !== 'all' && cat !== filter);
        });
      });
    });
  }

  const modal = document.getElementById('imgModal');
  if (modal) {
    modal.addEventListener('show.bs.modal', event => {
      const trigger = event.relatedTarget;
      const imgUrl = trigger?.getAttribute('data-img');
      const title = trigger?.getAttribute('data-title') || 'Bild';

      const modalImg = document.getElementById('imgModalImg');
      const modalTitle = document.getElementById('imgModalTitle');

      modalTitle.textContent = title;
      modalImg.src = imgUrl;
      modalImg.alt = title;
    });
  }
})();
