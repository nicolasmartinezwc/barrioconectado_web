class InputValidator {
    static validateLogin(email, password) {
        const emailValidation = this.validateEmail(email);
        const passwordValidation = this.validatePassword(password);

        if (!emailValidation.valid) {
            return emailValidation;
        }

        if (!passwordValidation.valid) {
            return passwordValidation;
        }

        return { valid: true };
    }

    static validateSignUp(firstName, lastName, email, password) {
        const firstNameValidation = this.validateFirstName(firstName);
        const lastNameValidation = this.validateLastName(lastName);
        const emailValidation = this.validateEmail(email);
        const passwordValidation = this.validatePassword(password);

        if (!firstNameValidation.valid) {
            return firstNameValidation;
        }

        if (!lastNameValidation.valid) {
            return lastNameValidation;
        }

        if (!emailValidation.valid) {
            return emailValidation;
        }

        if (!passwordValidation.valid) {
            return passwordValidation;
        }

        return { valid: true };
    }

    static validateRecoverPassword(email) {
        const emailValidation = this.validateEmail(email);

        if (!emailValidation.valid) {
            return emailValidation;
        }

        return { valid: true };
    }

    static validateAnnouncementForm(title, description, phoneNumber, usePhoneNumber) {
        const titleValidation = this.validateAnnouncementTitle(title);
        const descriptionValidation = this.validateAnnouncementDescription(description);
        const phoneNumberValidation = this.validateAnnouncementPhoneNumber(phoneNumber, usePhoneNumber);

        if (!titleValidation.valid) {
            return titleValidation;
        }

        if (!descriptionValidation.valid) {
            return descriptionValidation;
        }

        if (!phoneNumberValidation.valid) {
            return phoneNumberValidation;
        }

        return { valid: true };
    }

    static validateEventData(title, description, location, category, day, month, year, allday, hour, minute) {
        const titleValidation = this.validateEventTitle(title);
        if (!titleValidation.valid) return titleValidation;

        const descriptionValidation = this.validateEventDescription(description);
        if (!descriptionValidation.valid) return descriptionValidation;

        const locationValidation = this.validateEventLocation(location);
        if (!locationValidation.valid) return locationValidation;

        const categoryValidation = this.validateEventCategory(category);
        if (!categoryValidation.valid) return categoryValidation;

        const dateValidation = this.validateEventDate(day, month, year, allday, hour, minute);
        if (!dateValidation.valid) return dateValidation;

        return { valid: true };
    }

    static validateEventDate(day, month, year, allday, hour, minute) {
        if (!day || !month || !year) {
            return { valid: false, message: "Selecciona una fecha." };
        }

        const today = new Date();
        const todayDateOnly = new Date(today.setHours(0, 0, 0, 0));
        const selectedDate = new Date(year, month - 1, day);

        if (selectedDate < todayDateOnly) {
            return { valid: false, message: "La fecha elegida debe ser de hoy o de un día posterior." };
        }

        const nextYear = today.getFullYear() + 1;
        if (year > nextYear) {
            return { valid: false, message: "Solo se pueden crear eventos de este año o del año siguiente." };
        }

        if (!allday) {
            if (!hour) {
                return { valid: false, message: "Selecciona una hora." };
            }

            if (!minute) {
                return { valid: false, message: "Selecciona los minutos." };
            }
        }

        return { valid: true };
    }

    static validateEventTitle(title) {
        if (!title) {
            return { valid: false, message: "El título del evento no puede estar vacío." };
        }

        if (title.length < 6) {
            return { valid: false, message: "El título debe tener al menos 6 caracteres." };
        }

        if (title.length > 50) {
            return { valid: false, message: "El título debe tener menos de 50 caracteres." };
        }

        return { valid: true };
    }

    static validateEventCategory(category) {
        if (!category) {
            return { valid: false, message: "Selecciona una categoría." };
        }

        return { valid: true };
    }

    static validateEventDescription(description) {
        if (!description) {
            return { valid: false, message: "La descripción del evento no puede estar vacía." };
        }

        if (description.length < 10) {
            return { valid: false, message: "La descripción debe tener al menos 10 caracteres." };
        }

        if (description.length > 100) {
            return { valid: false, message: "La descripción debe tener menos de 100 caracteres." };
        }

        return { valid: true };
    }

    static validateAnnouncementTitle(title) {
        if (!title) {
            return { valid: false, message: "El título del anuncio no puede estar vacío." };
        }

        if (title.length < 6) {
            return { valid: false, message: "El título debe tener al menos 6 caracteres." };
        }

        if (title.length > 50) {
            return { valid: false, message: "El título debe tener menos de 50 caracteres." };
        }

        return { valid: true };
    }

    static validateEventLocation(location) {
        if (!location) {
            return { valid: false, message: "La ubicación del evento no puede estar vacía." };
        }

        if (location.length < 6) {
            return { valid: false, message: "La ubicación debe tener al menos 6 caracteres." };
        }

        if (location.length > 100) {
            return { valid: false, message: "La ubicación debe tener menos de 100 caracteres." };
        }

        return { valid: true };
    }

    static validateAnnouncementDescription(description) {
        if (!description) {
            return { valid: false, message: "La descripción del anuncio no puede estar vacía." };
        }

        if (description.length < 10) {
            return { valid: false, message: "La descripción debe tener al menos 10 caracteres." };
        }

        if (description.length > 300) {
            return { valid: false, message: "La descripción debe tener menos de 300 caracteres." };
        }

        return { valid: true };
    }

    static validateAnnouncementPhoneNumber(phoneNumber, usePhoneNumber) {
        if (!usePhoneNumber) {
            return { valid: true }; // Si no se requiere el teléfono, no hay errores.
        }

        if (!phoneNumber) {
            return { valid: false, message: "El número de teléfono no puede estar vacío." };
        }

        if (phoneNumber.length < 8) {
            return { valid: false, message: "El número de teléfono debe tener al menos 8 caracteres." };
        }

        if (phoneNumber.length > 11) {
            return { valid: false, message: "El número de teléfono debe tener entre 8 y 11 caracteres." };
        }

        return { valid: true };
    }


    static validateEmail(email) {
        if (!email) {
            return { valid: false, message: "Ingresa tu e-mail." };
        }

        if (email.length < 10) {
            return { valid: false, message: "El e-mail debe tener al menos 10 caracteres." };
        }

        if (email.length > 50) {
            return { valid: false, message: "El e-mail debe tener menos de 50 caracteres." };
        }

        return { valid: true };
    }

    static validatePassword(password) {
        if (!password) {
            return { valid: false, message: "Ingresa una contraseña." };
        }

        if (password.length < 6) {
            return { valid: false, message: "La contraseña debe tener al menos 6 caracteres." };
        }

        if (password.length > 20) {
            return { valid: false, message: "La contraseña debe tener menos de 20 caracteres." };
        }

        return { valid: true };
    }

    static validateFirstName(firstName) {
        if (!firstName) {
            return { valid: false, message: "Ingresa tu nombre." };
        }

        if (firstName.length < 3) {
            return { valid: false, message: "El nombre debe tener al menos 3 caracteres." };
        }

        if (firstName.length > 20) {
            return { valid: false, message: "El nombre debe tener menos de 20 caracteres." };
        }

        return { valid: true };
    }

    static validateLastName(lastName) {
        if (!lastName) {
            // Empty last names are allowed.
            return { valid: true };
        }

        if (lastName.length < 3) {
            return { valid: false, message: "El apellido debe tener al menos 3 caracteres." };
        }

        if (lastName.length > 20) {
            return { valid: false, message: "El apellido debe tener menos de 20 caracteres." };
        }

        return { valid: true };
    }
}

export default InputValidator;
