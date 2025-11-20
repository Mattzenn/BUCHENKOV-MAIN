const form = document.getElementById("contactForm");
const phoneInput = document.getElementById("phone");
const successMessage = document.getElementById("formSuccessMessage");

// ===================== МАСКА ТЕЛЕФОНА =====================

if (phoneInput) {
  phoneInput.addEventListener("input", onPhoneInput);
  phoneInput.addEventListener("blur", onPhoneBlur);
  phoneInput.addEventListener("keydown", onPhoneKeyDown);
}

// Форматирование номера по цифрам
function formatPhone(digits) {
  if (!digits) return "";

  // Гарантируем, что первая цифра — 7
  if (!digits.startsWith("7")) {
    digits = "7" + digits.replace(/^7+/, "");
  }

  let formatted = "+7 ";

  if (digits.length > 1) {
    formatted += "(" + digits.substring(1, 4);
  }
  if (digits.length >= 4) {
    formatted += ") " + digits.substring(4, 7);
  }
  if (digits.length >= 7) {
    formatted += "-" + digits.substring(7, 9);
  }
  if (digits.length >= 9) {
    formatted += "-" + digits.substring(9, 11);
  }

  return formatted;
}

// Обработка обычного ввода (цифр)
function onPhoneInput(e) {
  const target = e.target;
  let digits = target.value.replace(/\D/g, "");

  // Ограничим максимум 11 цифр (7 + 10)
  if (digits.length > 11) {
    digits = digits.substring(0, 11);
  }

  target.value = formatPhone(digits);
}

// При потере фокуса — очищаем, если номер неполный
function onPhoneBlur(e) {
  const target = e.target;
  const digits = target.value.replace(/\D/g, "");

  // Если меньше 11 цифр (неполный номер) — очищаем поле
  if (digits.length > 0 && digits.length < 11) {
    target.value = "";
  }
}

// Удаление по одному символу, без "залипания" на маске
function onPhoneKeyDown(e) {
  if (e.key !== "Backspace" && e.key !== "Delete") return;

  e.preventDefault(); // блокируем стандартное удаление

  let digits = phoneInput.value.replace(/\D/g, "");
  if (!digits.length) {
    phoneInput.value = "";
    return;
  }

  // Удаляем последнюю цифру
  digits = digits.slice(0, -1);

  // Переформатируем
  phoneInput.value = formatPhone(digits);
}

// ===================== ВАЛИДАЦИЯ ФОРМЫ =====================

form.addEventListener("submit", function (e) {
  let isValid = true;

  const name = document.getElementById("name");
  const phone = document.getElementById("phone");
  const email = document.getElementById("email");

  clearErrors();

  // При новой попытке отправки убираем старое сообщение об успехе
  if (successMessage) {
    successMessage.textContent = "";
    successMessage.classList.remove("form__success-message--visible");
  }

  // Имя
  if (name.value.trim().length < 2) {
    showError(name, "Введите корректное имя");
    isValid = false;
  } else {
    markSuccess(name);
  }

  // Телефон
  const phonePattern = /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;
  if (!phonePattern.test(phone.value.trim())) {
    showError(phone, "Введите корректный номер телефона");
    isValid = false;
  } else {
    markSuccess(phone);
  }

  // Email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value.trim())) {
    showError(email, "Введите корректный email");
    isValid = false;
  } else {
    markSuccess(email);
  }

  // Если невалидно — блокируем отправку вообще
  if (!isValid) {
    e.preventDefault();
    return;
  }

  // ✅ Если всё ок:
  // 1) показываем сообщение
  if (successMessage) {
    successMessage.textContent =
      "Данные успешно отправлены! В ближайшее время я свяжусь с Вами.";
    successMessage.classList.add("form__success-message--visible");
  }

  // 2) НЕ делаем reset и НЕ вызываем preventDefault —
  //    дальше сработает мост, заберёт значения и отправит форму в Tilda

  // Если нужна чистка формs после отправки —
  // можно включить вот это (асинхронно, чтобы не мешать мосту):
  /*
  setTimeout(() => {
    form.reset();
    clearVisuals();
  }, 500);
  */
});



function showError(input, message) {
  const error = input.parentElement.querySelector(".form__error");
  if (error) {
    error.textContent = message;
  }
  input.classList.add("form__input--error");
}

function markSuccess(input) {
  input.classList.add("form__input--success");
}

function clearErrors() {
  document
    .querySelectorAll(".form__error")
    .forEach((el) => (el.textContent = ""));
  document
    .querySelectorAll(".form__input, .form__textarea")
    .forEach((el) =>
      el.classList.remove("form__input--error", "form__input--success")
    );
}

function clearVisuals() {
  document
    .querySelectorAll(".form__input, .form__textarea")
    .forEach((el) => el.classList.remove("form__input--success"));
}

function initCarousel({
  trackSelector,
  nextButtonSelector,
  prevButtonSelector,
  interval = 5000
}) {
  const track = document.querySelector(trackSelector);
  if (!track) return; // если такого блока нет на странице

  const slides = Array.from(track.children);
  const nextButton = document.querySelector(nextButtonSelector);
  const prevButton = document.querySelector(prevButtonSelector);

  let currentIndex = 0;
  let autoSlideInterval;

  // --- Переключение слайда ---
  function moveToSlide(index) {
    const slideWidth = slides[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${slideWidth * index}px)`;
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    moveToSlide(currentIndex);
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    moveToSlide(currentIndex);
  }

  // --- Автопрокрутка ---
  // function startAutoSlide() {
  //   stopAutoSlide();
  //   autoSlideInterval = setInterval(nextSlide, interval);
  // }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  // --- Кнопки ---
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      nextSlide();
      // startAutoSlide();
    });
  }

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      prevSlide();
      // startAutoSlide();
    });
  }

  // --- Свайпы (мобильные) ---
  let startX = 0;
  let moveX = 0;
  let isSwiping = false;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isSwiping = true;
    // stopAutoSlide();
  });

  track.addEventListener('touchmove', (e) => {
    if (!isSwiping) return;
    moveX = e.touches[0].clientX - startX;
  });

  track.addEventListener('touchend', () => {
    if (!isSwiping) return;
    isSwiping = false;

    const threshold = 50;
    if (moveX > threshold) {
      prevSlide();
    } else if (moveX < -threshold) {
      nextSlide();
    }
    // startAutoSlide();
  });

  // --- При ресайзе пересчитать позицию ---
  window.addEventListener('resize', () => moveToSlide(currentIndex));

  // --- Старт ---
  // startAutoSlide();
}

// Инициализация двух независимых слайдеров:
initCarousel({
  trackSelector: '.carousel__track_certificates',
  nextButtonSelector: '.carousel__btn--next_certificates',
  prevButtonSelector: '.carousel__btn--prev_certificates',
  interval: 5000
});

initCarousel({
  trackSelector: '.reviews__track',
  nextButtonSelector: '.carousel__btn--next_reviews',
  prevButtonSelector: '.carousel__btn--prev_reviews',
  interval: 5000
});

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


  (function () {
    const blockedCss = [
      'tilda-grid-3.0.min.css',
      'tilda-blocks-page93322206.min.css'
    ];

    function shouldRemove(href) {
      return blockedCss.some(name => href.includes(name));
    }

    function cleanExisting() {
      document.querySelectorAll('link[rel="stylesheet"]').forEach(function (link) {
        const href = link.getAttribute('href') || '';
        if (shouldRemove(href)) {
          link.parentNode.removeChild(link);
        }
      });
    }

    // 1. Убираем уже существующие <link>
    document.addEventListener('DOMContentLoaded', cleanExisting);

    // 2. Следим за новыми <link>, которые могут появляться
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (node.tagName === 'LINK' && node.rel === 'stylesheet') {
            const href = node.getAttribute('href') || '';
            if (shouldRemove(href)) {
              node.parentNode.removeChild(node);
            }
          }
        });
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  })();
