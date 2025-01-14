import React from "react";
import "./Announcements.css";
import AnnouncementsViewModel from "./AnnouncementsViewModel.js";
import Loading from "../Loading/Loading.jsx";
import AnnouncementCard from "./AnnouncementCard.jsx";

class Announcements extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            announcements: [],
        }
        this.viewModel = new AnnouncementsViewModel(this.props.userData);
    }

    async componentDidMount() {
        const announcements = await this.viewModel.fetchAnnouncements();
        console.log(announcements);
        this.setState({ announcements: announcements });
    }

    handleCrossClicked = async (announcementId) => {
        await this.viewModel.removeAnnouncement(announcementId);
        const updatedAnnouncements = await this.viewModel.fetchAnnouncements();
        this.setState({ announcements: updatedAnnouncements });
    };

    render() {
        const { announcements } = this.state;
        return (
            announcements ?
            announcements.length > 0 ?
                <div className="announcements-container">
                    {announcements.map((announcement, index) => (
                        <div key={index}>
                            <AnnouncementCard
                                announcement={announcement}
                                handleCrossClicked={this.handleCrossClicked}
                                userId={this.props.userData.id}
                            />
                        </div>

                    ))}
                </div>
                :
                <div className="empty-content">
                    <p>
                        No hay anuncios aún... Se el primero en publicar uno!
                    </p>
                </div>
                :
                <div>
                    <Loading hideSignOut={true} />
                </div>
        );
    }
}

export default Announcements;
