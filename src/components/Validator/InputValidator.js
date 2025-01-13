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