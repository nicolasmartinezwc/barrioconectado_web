import InputValidator from "../Validator/InputValidator";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

class RecoverPasswordViewModel {

    async sendPasswordResetEmail(email) {
        const auth = getAuth();
    
        try {
            await sendPasswordResetEmail(auth, email);
            return { valid: true, message: "Se envió correctamente el correo de recuperación de contraseña." };
        } catch (error) {
            return { valid: false, message: error.message };
        }
    }

    validateRecoverPassword(email) {
        return InputValidator.validateRecoverPassword(email);
    }
}

export default RecoverPasswordViewModel;
