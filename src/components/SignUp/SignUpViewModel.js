import InputValidator from "../Validator/InputValidator";

class SignUpViewModel {
    validateSignUp(firstName, lastName, email, password) {
        const result = InputValidator.validateSignUp(firstName, lastName, email, password);

        if (result.valid) {
            // crear cuenta
        } else {
            // mostrar error
        }

        return result;
    }
}

export default SignUpViewModel;
