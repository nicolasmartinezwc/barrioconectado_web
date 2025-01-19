
import InputValidator from "../Validator/InputValidator";
import db from '../Database/Database';
import { collection, query, where, orderBy, getDocs, doc, updateDoc } from "firebase/firestore";

class HomeViewModel {

    constructor(userData) {
        this.userData = userData;
    }

    validateDescription(description) {
        return InputValidator.validateHomeDescription(description);
    }

    async editDescription(description, userId) {
        const userRef = doc(db, "users", userId);
        try {
            await updateDoc(userRef, { description });
        } catch (error) {
            console.error("Error updating description:", error);
            throw error;
        }
    }   

    async fetchPosts() {
        const userId = this.userData.id;
        const neighbourhoodId = this.userData.neighbourhood;
        if (!userId || !neighbourhoodId) {
            throw new Error("User or neighbourhood data is missing.");
        }
        try {
            const announcementsRef = collection(db, "posts");
            const q = query(
                announcementsRef,
                where("neighbourhood", "==", neighbourhoodId),
                orderBy("created_at", "desc")
            );

            const querySnapshot = await getDocs(q);
            let posts = [];
            querySnapshot.forEach((document) => {
                const postData = document.data();
                posts.push(postData);
            });
            return posts;
        } catch (error) {
            console.error("Error fetching posts:", error);
            return null
        }
    }

    async fetchNeighbourhoodData() {
        try {
            const neighbourhoodId = this.userData.neighbourhood;
            if (!neighbourhoodId) {
                throw new Error("Neighbourhood ID is missing.");
            }
            const neighbourhoodRef = collection(db, "neighbourhoods");
            const q = query(
                neighbourhoodRef,
                where("id", "==", neighbourhoodId)
            );
            const querySnapshot = await getDocs(q);
    
            if (querySnapshot.empty) {
                throw new Error("No neighbourhood found with the given ID.");
            }
    
            const neighbourhoodDoc = querySnapshot.docs[0];
            return neighbourhoodDoc.data();
        } catch (error) {
            console.error("Error fetching neighbourhood data:", error);
            return null;
        }
    }
}

export default HomeViewModel;