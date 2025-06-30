/*export function setupFormValidation(form, submitSelector) {
    const inputs = form.querySelectorAll("input");
    const submitButton = form.querySelector(submitSelector);
    const checkbox = form.querySelector("input[type='checkbox']");

    // Настраиваем маску для телефона
    const phoneInput = form.querySelector("input[name='phone']");
    if (phoneInput) {
        new Cleave(phoneInput, {
            prefix: "+7",
            delimiters: [" (", ") ", "-", "-"],
            blocks: [2, 3, 3, 2, 2],
            numericOnly: true
        });
    }

    // Функция валидации имени, фамилии, должности, организации (общая)
    function validateText(input) {
        const value = input.value.trim();
        const isValid = /^[A-Za-zА-Яа-яЁё\s]{2,}$/.test(value);
        toggleValidation(input, isValid);
        return isValid;
    }

    // Валидация email
    function validateEmail(input) {
        const value = input.value.trim();
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        toggleValidation(input, isValid);
        return isValid;
    }

    // Валидация телефона
    function validatePhone(input) {
        const value = input.value.trim();
        const isValid = /\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}/.test(value);
        toggleValidation(input, isValid);
        return isValid;
    }

    // Валидация чекбокса
    function validateCheckbox() {
        if (checkbox) {
            return checkbox.checked;
        }
        return true; // если чекбокса нет (например, в первом типе формы), считаем его валидным
    }

    // Функция смены стилей при валидации
    function toggleValidation(input, isValid) {
        input.style.outline = isValid ? "" : "2px solid red";
    }

    // Проверяем всю форму на валидность
    function checkFormValidity() {
        let isFormValid = true;

        inputs.forEach(input => {
            const { name } = input;

            if (["name", "surname", "post", "orgName"].includes(name)) {
                isFormValid = validateText(input) && isFormValid;
            } else if (name === "email") {
                isFormValid = validateEmail(input) && isFormValid;
            } else if (name === "phone") {
                isFormValid = validatePhone(input) && isFormValid;
            }
        });

        if (checkbox && !validateCheckbox()) {
            isFormValid = false;
        }

        submitButton.classList.toggle("disabled", !isFormValid);
    }

    // Привязываем события к инпутам
    if (!inputs.length || !submitButton) return;

    inputs.forEach(input => {
        input.addEventListener("input", checkFormValidity);
    });

    if (checkbox) {
        checkbox.addEventListener("change", checkFormValidity);
    }

    form.addEventListener("submit", function (event) {
        checkFormValidity();
        if (submitButton.classList.contains("disabled")) {
            event.preventDefault();
        }
    });
}*/

export function setupFormValidation(form, submitSelector) {
    const inputs = form.querySelectorAll("input");
    const textareas = form.querySelectorAll("textarea");
    const submitButton = form.querySelector(submitSelector);
    const checkboxes = form.querySelectorAll("input[type='checkbox']"); // Теперь получаем все чекбоксы

    // Настраиваем маску для телефона
    const phoneInput = form.querySelector("input[name='phone']");
    if (phoneInput) {
        const cleave = new Cleave(phoneInput, {
            delimiters: [" (", ") ", "-", "-"],
            blocks: [2, 3, 3, 2, 2],
            numericOnly: true,
            noImmediatePrefix: true,
            prefix: "+7"
        });

        phoneInput.addEventListener('focus', () => {
            if (!phoneInput.value.startsWith('+7')) {
                cleave.setRawValue('+7');
            }
        });
    }

    // Функция валидации текстовых полей (имя, фамилия, сообщение и т. д.)
    function validateText(field) {
        const value = field.value.trim();
        const isValid = /^[A-Za-zА-Яа-яЁё\s]{2,}$/.test(value);
        toggleValidation(field, isValid);
        return isValid;
    }

    // Валидация email
    function validateEmail(input) {
        const value = input.value.trim();
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        toggleValidation(input, isValid);
        return isValid;
    }

    // Валидация телефона
    function validatePhone(input) {
        const value = input.value.trim();
        const isValid = /\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}/.test(value);
        toggleValidation(input, isValid);
        return isValid;
    }

    // Валидация чекбоксов (хотя бы один должен быть выбран)
    function validateCheckboxes() {
        if (checkboxes.length === 0) return true; // Если чекбоксов нет, пропускаем проверку

        let atLeastOneChecked = false;
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                atLeastOneChecked = true;
            }
        });

        // Подсвечиваем все чекбоксы, если ни один не выбран
        if (!atLeastOneChecked) {
            checkboxes.forEach(checkbox => {
                checkbox.classList.add('error');
                checkbox.classList.remove('valid');
            });
        } else {
            checkboxes.forEach(checkbox => {
                checkbox.classList.remove('error');
                checkbox.classList.add('valid');
            });
        }

        return atLeastOneChecked;
    }

    // Функция смены стилей при валидации
    function toggleValidation(field, isValid) {
        if (!isValid) {
            field.classList.remove('valid');
            field.classList.add('error');
        } else {
            field.classList.add('valid');
            field.classList.remove('error');
        }
    }

    // Проверяем всю форму на валидность
    function checkFormValidity() {
        let isFormValid = true;

        // Проверяем инпуты
        inputs.forEach(input => {
            const { name } = input;

            if (["name", "surname", "message", "orgName"].includes(name)) {
                isFormValid = validateText(input) && isFormValid;
            } else if (name === "email") {
                isFormValid = validateEmail(input) && isFormValid;
            } else if (name === "phone") {
                isFormValid = validatePhone(input) && isFormValid;
            }
        });

        // Проверяем textarea с name="message"
        textareas.forEach(textarea => {
            if (textarea.name === "message") {
                isFormValid = validateText(textarea) && isFormValid;
            }
        });

        // Проверяем чекбоксы (хотя бы один должен быть выбран)
        isFormValid = validateCheckboxes() && isFormValid;

        // Блокируем/разблокируем кнопку отправки
        submitButton.classList.toggle("disabled", !isFormValid);
    }

    // Привязываем события к полям формы
    if ((!inputs.length && !textareas.length) || !submitButton) return;

    inputs.forEach(input => {
        input.addEventListener("input", checkFormValidity);
    });

    textareas.forEach(textarea => {
        textarea.addEventListener("input", checkFormValidity);
    });

    // Вешаем обработчик на все чекбоксы
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", checkFormValidity);
    });

    // Обработчик отправки формы
    form.addEventListener("submit", function (event) {
        checkFormValidity();
        if (submitButton.classList.contains("disabled")) {
            event.preventDefault();
        }
    });
}