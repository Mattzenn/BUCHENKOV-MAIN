const form = document.getElementById("contactForm");
const phoneInput = document.getElementById("phone");

// ===== Маска телефона =====
phoneInput.addEventListener("input", onPhoneInput);
phoneInput.addEventListener("focus", onPhoneInput);
phoneInput.addEventListener("blur", onPhoneBlur);

function onPhoneInput(e) {
  let input = e.target.value.replace(/\D/g, "");
  if (!input.startsWith("7")) input = "7" + input;

  let formatted = "+7 ";
  if (input.length > 1) formatted += "(" + input.substring(1, 4);
  if (input.length >= 4) formatted += ") " + input.substring(4, 7);
  if (input.length >= 7) formatted += "-" + input.substring(7, 9);
  if (input.length >= 9) formatted += "-" + input.substring(9, 11);

  e.target.value = formatted;
}

function onPhoneBlur(e) {
  if (e.target.value.length < 18) {
    e.target.value = "";
  }
}

// ===== Валидация =====
form.addEventListener("submit", function (e) {
  e.preventDefault();

  let isValid = true;
  const name = document.getElementById("name");
  const phone = document.getElementById("phone");
  const email = document.getElementById("email");

  clearErrors();

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
    alert("Форма успешно отправлена!");
    e.target.reset();
    clearVisuals();
  }
});

function showError(input, message) {
  const error = input.parentElement.querySelector(".form__error");
  error.textContent = message;
  input.classList.add("form__input--error");
}

function markSuccess(input) {
  input.classList.add("form__input--success");
}

function clearErrors() {
  document.querySelectorAll(".form__error").forEach((el) => (el.textContent = ""));
  document
    .querySelectorAll(".form__input, .form__textarea")
    .forEach((el) => el.classList.remove("form__input--error", "form__input--success"));
}

function clearVisuals() {
  document
    .querySelectorAll(".form__input, .form__textarea")
    .forEach((el) => el.classList.remove("form__input--success"));
}
