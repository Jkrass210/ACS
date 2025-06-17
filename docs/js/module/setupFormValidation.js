export function setupFormValidation(form, submitSelector) {
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
}

