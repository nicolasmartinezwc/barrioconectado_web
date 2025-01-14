import { collection, query, where, orderBy, getDocs, doc, deleteDoc } from "firebase/firestore";
import db from '../Database/Database';

class AnnouncementsViewModel {

    constructor(userData) {
        this.userData = userData;
    }

    async removeAnnouncement(announcementId) {
        if (!announcementId) {
            throw new Error("Announcement ID is missing.");
        }
        try {
            const announcementRef = doc(db, "announcements", announcementId);
            await deleteDoc(announcementRef);
        } catch (error) {
            console.error("Error deleting announcement:", error);
        }
    }

    async fetchAnnouncements() {
        const userId = this.userData.id;
        const neighbourhoodId = this.userData.neighbourhood;
        if (!userId || !neighbourhoodId) {
            throw new Error("User or neighbourhood data is missing.");
        }
        try {
            const announcementsRef = collection(db, "announcements");
            const q = query(
                announcementsRef,
                where("neighbourhood", "==", neighbourhoodId),
                orderBy("created_at", "desc")
            );

            const querySnapshot = await getDocs(q);
            let announcements = [];
            querySnapshot.forEach((doc) => {
                const announcementData = doc.data();
                announcements.push(announcementData);
            });
            return announcements;
        } catch (error) {
            console.error("Error fetching announcements:", error);
            return null
        }
    }
}

export default AnnouncementsViewModel;