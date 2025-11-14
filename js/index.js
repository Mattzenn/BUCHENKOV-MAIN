const openMenuButton = document.querySelector('.burger-menu__button')
const burgerMenu = document.querySelector('.burger-menu__nav')
const closeMenuButton = document.querySelector('.burger-menu__button_close')


openMenuButton.addEventListener('click', openPopupMenu)

function openPopupMenu(event) {

    closeMenuButton.classList.toggle('burger-menu_active');
    // openMenuButton.classList.toggle('burger-menu_active');
    burgerMenu.classList.toggle('burger-menu__nav_active');
    
}

closeMenuButton.addEventListener('click', closePopupMenu)

function closePopupMenu(event) {

    closeMenuButton.classList.remove('burger-menu_active');
    burgerMenu.classList.remove('burger-menu__nav_active');
    
}

document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll("[data-animate]");

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("_visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  animatedElements.forEach(el => observer.observe(el));
});

document.querySelectorAll('.faq__item').forEach(item => {
  const answer = item.querySelector('.faq__answer');

  item.addEventListener('toggle', () => {
    if (item.open) {
      const height = answer.scrollHeight;
      answer.style.maxHeight = height + 'px';
      answer.style.opacity = '1';
      answer.style.padding = '20px 24px 24px';
    } else {
      answer.style.maxHeight = '0';
      answer.style.opacity = '0';
      answer.style.padding = '0 24px';
    }
  });
});


// блок faq, плавное открытие окно
document.querySelectorAll('.faq__item').forEach(item => {
  const question = item.querySelector('.faq__question');
  const answer = item.querySelector('.faq__answer');

  question.addEventListener('click', () => {
    const isActive = item.classList.contains('active');

    if (isActive) {
      // === Плавное закрытие ===
      const startHeight = answer.scrollHeight;
      answer.style.maxHeight = startHeight + 'px'; // фиксируем текущую высоту
      answer.offsetHeight; // форсируем reflow
      answer.style.maxHeight = '0';
      answer.style.opacity = '0';

      item.classList.remove('active');

      answer.addEventListener(
        'transitionend',
        () => {
          answer.style.maxHeight = '';
        },
        { once: true }
      );
    } else {
      // === Плавное открытие ===
      item.classList.add('active');
      const endHeight = answer.scrollHeight;
      answer.style.maxHeight = endHeight + 'px';
      answer.style.opacity = '1';

      // после анимации убираем ограничение, чтобы текст не обрезался при ресайзе
      answer.addEventListener(
        'transitionend',
        () => {
          answer.style.maxHeight = 'none';
        },
        { once: true }
      );
    }
  });
});

//звезды
document.addEventListener("DOMContentLoaded", () => {
  const stars = document.querySelectorAll(".star");
  const windowHeight = window.innerHeight;
  let ticking = false; // защита от перегрузки

  // ставим стартовые позиции
  stars.forEach(star => {
    star.style.left = star.dataset.startX;
    star.style.top = star.dataset.startY;
  });

  function updateStars() {
    const windowHeight = window.innerHeight;

    stars.forEach(star => {
      const parent = star.closest("section");
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      const isVisible = rect.bottom > 0 && rect.top < windowHeight;
      if (!isVisible) return;

      const speedY = parseFloat(star.dataset.speedY) || 0.5;
      const speedX = parseFloat(star.dataset.speedX) || 0;
      const progress = windowHeight - rect.top;

      const moveY = progress * speedY;
      const moveX = progress * speedX;

      star.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(updateStars); // плавная отрисовка
      ticking = true;
    }
  });
});
