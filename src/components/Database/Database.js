import app from '../../firebaseConfig.js';
import { getFirestore } from "firebase/firestore";
const db = getFirestore(app);
export default db;