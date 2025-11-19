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
