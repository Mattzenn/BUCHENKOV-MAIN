const trackCertificate = document.querySelector('.carousel__track_certificates');
const slidesCertificate = Array.from(trackCertificate.children);
const nextButtonCertificate = document.querySelector('.carousel__btn--next_certificates');
const prevButtonCertificate = document.querySelector('.carousel__btn--prev_certificates');

let currentIndexCertificate = 0;
let autoSlideIntervalCertificate;

// Функция переключения слайдов
function moveToSlideCertificate(index) {
  const slideWidthCertificate = slidesCertificate[0].getBoundingClientRect().width;
  trackCertificate.style.transform = `translateX(-${slideWidthCertificate * index}px)`;
}

// Кнопки
function nextSlideCertificate() {
  currentIndexCertificate = (currentIndexCertificate + 1) % slidesCertificate.length;
  moveToSlideCertificate(currentIndexCertificate);
}

function prevSlideCertificate() {
  currentIndexCertificate = (currentIndexCertificate - 1 + slidesCertificate.length) % slidesCertificate.length;
  moveToSlideCertificate(currentIndexCertificate);
}

// Автопрокрутка
function startAutoSlideCertificate() {
  stopAutoSlideCertificate();
  autoSlideIntervalCertificate = setInterval(nextSlideCertificate, 5000);
}

function stopAutoSlideCertificate() {
  clearInterval(autoSlideIntervalCertificate);
}

// Обработчики кнопок
nextButtonCertificate.addEventListener('click', () => {
  nextSlideCertificate();
  startAutoSlideCertificate();
});

prevButtonCertificate.addEventListener('click', () => {
  prevSlideCertificate();
  startAutoSlideCertificate();
});

// Пересчёт при ресайзе
window.addEventListener('resize', () => moveToSlideCertificate(currentIndexCertificate));

// --- ✅ Добавляем свайп на мобильных ---
let startXCertificate = 0;
let moveXCertificate = 0;
let isSwipingCertificate = false;

trackCertificate.addEventListener('touchstart', (e) => {
  startXCertificate = e.touches[0].clientX;
  isSwipingCertificate = true;
  stopAutoSlideCertificate();
});

trackCertificate.addEventListener('touchmove', (e) => {
  if (!isSwipingCertificate) return;
  moveXCertificate = e.touches[0].clientX - startXCertificate;
});

trackCertificate.addEventListener('touchend', () => {
  if (!isSwipingCertificate) return;
  isSwipingCertificate = false;

  const threshold = 50;
  if (moveXCertificate > threshold) {
    prevSlideCertificate();
  } else if (moveXCertificate < -threshold) {
    nextSlideCertificate();
  }

  startAutoSlideCertificate();
});

// Запуск при загрузке
startAutoSlideCertificate();
