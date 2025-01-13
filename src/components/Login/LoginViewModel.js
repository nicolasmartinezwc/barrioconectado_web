import InputValidator from "../Validator/InputValidator";

class LoginViewModel {
    validateLogin(email, password) {
        const result = InputValidator.validateLogin(email, password);

        if (result.valid) {
            // iniciar sesion
        } else {
            // mostrar error
        }

        return result;
    }
}

export default LoginViewModel;
