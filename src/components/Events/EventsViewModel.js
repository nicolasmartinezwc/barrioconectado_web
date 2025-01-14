import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import db from '../Database/Database';

class EventsViewModel {
    constructor(userData) {
        this.userData = userData;
    }

    async fetchEvents() {
        const userId = this.userData.id;
        const neighbourhoodId = this.userData.neighbourhood;
        if (!userId || !neighbourhoodId) {
            throw new Error("User or neighbourhood data is missing.");
        }
        try {
            const eventsRef = collection(db, "events");
            const q = query(
                eventsRef,
                where("neighbourhood", "==", neighbourhoodId),
                orderBy("created_at", "desc")
            );
            const querySnapshot = await getDocs(q);
            let events = [];
            querySnapshot.forEach((doc) => {
                const eventsData = doc.data();
                events.push(eventsData);
            });
            return events;
        } catch (error) {
            console.error("Error fetching events:", error);
            return null
        }
    }
}

export default EventsViewModel;