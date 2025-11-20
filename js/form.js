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
  e.preventDefault();

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

  if (isValid) {
    if (successMessage) {
      successMessage.textContent =
        "Данные успешно отправлены! В ближайшее время я свяжусь с Вами.";
      successMessage.classList.add("form__success-message--visible");
    }

    e.target.reset();
    clearVisuals();
  }
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
