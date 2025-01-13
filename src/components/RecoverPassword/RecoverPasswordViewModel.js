import InputValidator from "../Validator/InputValidator";

class RecoverPasswordViewModel {
    validateRecoverPassword(email) {
        const result = InputValidator.validateRecoverPassword(email);

        if (result.valid) {
            // enviar email de recuperacion
        } else {
            // mostrar error
        }

        return result;
    }
}

export default RecoverPasswordViewModel;
