const track = document.querySelector('.reviews__track');
const slides = Array.from(track.children);
const nextButton = document.querySelector('.carousel__btn--next_reviews');
const prevButton = document.querySelector('.carousel__btn--prev_reviews');

let currentIndex = 0;
let autoSlideInterval;

// Функция переключения слайдов
function moveToSlide(index) {
  const slideWidth = slides[0].getBoundingClientRect().width;
  track.style.transform = `translateX(-${slideWidth * index}px)`;
}

// Кнопки
function nextSlide() {
  currentIndex = (currentIndex + 1) % slides.length;
  moveToSlide(currentIndex);
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  moveToSlide(currentIndex);
}

// Автопрокрутка
// function startAutoSlide() {
//   stopAutoSlide();
//   autoSlideInterval = setInterval(nextSlide, 5000);
// }

function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

// Обработчики кнопок
nextButton.addEventListener('click', () => {
  nextSlide();
  // startAutoSlide();
});

prevButton.addEventListener('click', () => {
  prevSlide();
  // startAutoSlide();
});

// Пересчёт при ресайзе
window.addEventListener('resize', () => moveToSlide(currentIndex));

// --- ✅ Добавляем свайп на мобильных ---
let startX = 0;
let moveX = 0;
let isSwiping = false;

track.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
  isSwiping = true;
  stopAutoSlide(); // останавливаем автопрокрутку во время свайпа
});

track.addEventListener('touchmove', (e) => {
  if (!isSwiping) return;
  moveX = e.touches[0].clientX - startX;
});

track.addEventListener('touchend', () => {
  if (!isSwiping) return;
  isSwiping = false;

  const threshold = 50; // минимальная длина свайпа в пикселях
  if (moveX > threshold) {
    prevSlide(); // свайп вправо
  } else if (moveX < -threshold) {
    nextSlide(); // свайп влево
  }

  // startAutoSlide(); // перезапускаем автопрокрутку
});

// Запуск при загрузке
// startAutoSlide();
