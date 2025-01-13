import InputValidator from "../Validator/InputValidator";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

class LoginViewModel {

    async loginWithCredentials(email, password) {
        const auth = getAuth();
        try {
            await signInWithEmailAndPassword(auth, email, password)
            return { valid: true };
        } catch (error) {
            return { valid: false, message: error.message };
        }
    }

    validateLogin(email, password) {
        return InputValidator.validateLogin(email, password);
    }
}

export default LoginViewModel;
