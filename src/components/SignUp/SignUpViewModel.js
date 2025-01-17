import InputValidator from "../Validator/InputValidator";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import db from '../Database/Database';
import { doc, setDoc } from "firebase/firestore";

class SignUpViewModel {

    async createUserInDatabase(firstName, lastName, email) {
        try {
        const auth = getAuth(); 
        const userId = auth.currentUser?.uid;
        if (!userId) {
            throw new Error("Ocurrió un error al obtener la sesión");
        }
        const userDocRef = doc(db, "users", userId);
        await setDoc(userDocRef, {
            id: userId,
            email: email,
            picture_url: "",
            province_id: "",
            neighbourhood: "",
            last_name: lastName,
            first_name: firstName,
            description: ""
        });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async createUserWithCredentials(firstName, lastName, email, password) {
        const auth = getAuth();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            await this.createUserInDatabase(firstName, lastName, email);
            return { valid: true };
        } catch (error) {
            return { valid: false, message: error.message };
        }
    }

    validateSignUp(firstName, lastName, email, password) {
        return InputValidator.validateSignUp(firstName, lastName, email, password);
    }
}

export default SignUpViewModel;
