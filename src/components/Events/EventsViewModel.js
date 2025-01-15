import { collection, query, where, orderBy, getDocs, doc, setDoc } from "firebase/firestore";
import db from '../Database/Database';

class EventsViewModel {
    constructor(userData) {
        this.userData = userData;
    }

    async toggleAssistance(events, event) {
        const userId = this.userData.id;
        if (!userId || !event) {
            throw new Error("User or event data is missing.");
        }
        try {
            const userAssists = event.assistants.includes(userId);
            let updatedAssistants = [...event.assistants];
            if (userAssists) {
                updatedAssistants = updatedAssistants.filter(id => id !== userId);
            } else {
                updatedAssistants.push(userId);
            }
            event.assistants = updatedAssistants;

            const eventRef = doc(db, "events", event.id);
            await setDoc(eventRef, { assistants: updatedAssistants }, { merge: true });

            const updatedEvents = events.map(existingEvent =>
                existingEvent.id === event.id ? { ...existingEvent, assistants: updatedAssistants } : existingEvent
            );

            return updatedEvents;

        } catch (error) {
            console.error("Error toggling assistance:", error);
            return null;
        }
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