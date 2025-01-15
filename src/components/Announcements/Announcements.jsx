import React from "react";
import "./Announcements.css";
import AnnouncementsViewModel from "./AnnouncementsViewModel.js";
import Loading from "../Loading/Loading.jsx";
import AnnouncementCard from "./AnnouncementCard.jsx";
import AddAnnouncementForm from "./AddAnnouncementForm.jsx";

class Announcements extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            announcements: [],
            isLoading: false,
            showAddAnnouncementForm: false,
        }
        this.viewModel = new AnnouncementsViewModel(this.props.userData);
    }

    async componentDidMount() {
        this.fetchAnnouncements();
    }

    fetchAnnouncements = async () => {
        this.setState({ isLoading: true });
        const announcements = await this.viewModel.fetchAnnouncements();
        this.setState({ isLoading: false });
        this.setState({ announcements: announcements });
    }

    handleCrossClicked = async (announcementId) => {
        await this.viewModel.removeAnnouncement(announcementId);
        const updatedAnnouncements = await this.viewModel.fetchAnnouncements();
        this.setState({ announcements: updatedAnnouncements });
    };

    handleAddAnnouncementButton = () => {
        this.setState({ showAddAnnouncementForm: true });
    }

    handleBackFromForm = () => {
        this.setState({ showAddAnnouncementForm: false });
    }

    render() {
        const { announcements, isLoading, showAddAnnouncementForm } = this.state;

        if (showAddAnnouncementForm) {
            return (
                <div className="announcements-page">
                    <AddAnnouncementForm 
                        userData={this.props.userData}
                        handleBackFromForm={this.handleBackFromForm}
                        fetchAnnouncements={this.fetchAnnouncements} 
                    />
                </div>
            );
        }

        return (
            <div className="announcements-page">
                <div className="announcements-content">
                    {isLoading ? (
                        <div className="loading-container">
                            <Loading hideSignOut={true} />
                        </div>
                    ) : (
                        announcements.length > 0 ? (
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
                        ) : (
                            <div className="empty-content">
                                <p>No hay anuncios aún... Se el primero en publicar uno!</p>
                            </div>
                        )
                    )}
                </div>

                <button className="floating-button" onClick={ this.handleAddAnnouncementButton }>
                    Agregar anuncio
                </button>
            </div>
        );
    }
}

export default Announcements;
