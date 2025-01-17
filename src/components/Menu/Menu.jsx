import React from "react";
import "./Menu.css";
import Home from "../Home/Home.jsx";
import Announcements from "../Announcements/Announcements.jsx";
import ProfilePopup from "../Profile/ProfilePopup.jsx";
import Events from "../Events/Events.jsx";
import house from '../../assets/house.png';
import message from '../../assets/message.png';
import person from '../../assets/person_fill.png';
import avatar from '../../assets/avatar.png';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";

const Sections = {
    HOME: "Inicio",
    EVENTS: "Eventos",
    ANNOUNCEMENTS: "Anuncios",
};

class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentSection: Sections.HOME,
            profilePictureDownloadURL: avatar,
            isPopupOpen: false,
            loadingProfilePicture: true
        };
    }

    componentDidMount() {
        this.downloadProfilePicture();
    }

    togglePopup = () => {
        this.setState((prevState) => ({ isPopupOpen: !prevState.isPopupOpen }));
    };

    handleLogout = () => {
        signOut(auth)
            .then(() => {
                this.setState({ user: null });
            })
            .catch((error) => {
                console.error("Error al cerrar sesión:", error);
            });
    }

    setLoadingProfilePicture = (newValue) => {
        this.setState({ loadingProfilePicture: newValue });
    }

    downloadProfilePicture =    async () => {
        const { userData } = this.props;

        if (userData && userData.picture_url) {
            this.setLoadingProfilePicture(true);
            try {
                const storage = getStorage();
                const profilePictureRef = ref(
                    storage,
                    `images/${userData.id}/${userData.picture_url}`
                );

                const url = await getDownloadURL(profilePictureRef);
                this.setState({ profilePictureDownloadURL: url });
                this.setLoadingProfilePicture(false);
            } catch (error) {
                console.error("Error al descargar la imagen de perfil:", error);
                this.setLoadingProfilePicture(false);
            }
        }
    };

    downloadProfilePictureWithName = async (pictureUrlname) => {
        const { userData } = this.props;
        if (userData && pictureUrlname) {
            this.setLoadingProfilePicture(true);
            try {
                const storage = getStorage();
                const profilePictureRef = ref(
                    storage,
                    `images/${userData.id}/${pictureUrlname}`
                );

                const url = await getDownloadURL(profilePictureRef);
                this.setState({ profilePictureDownloadURL: url });
                this.setLoadingProfilePicture(false);
            } catch (error) {
                console.error("Error al descargar la imagen de perfil:", error);
                this.setLoadingProfilePicture(false);
            }
        }
    };

    setSection = (section) => {
        this.setState({ currentSection: section });
    };

    render() {
        const { currentSection, profilePictureDownloadURL, isPopupOpen, loadingProfilePicture } = this.state;
        const { userData } = this.props;

        const renderContent = () => {
            switch (currentSection) {
                case Sections.HOME:
                    return <Home userData={userData} />;
                case Sections.EVENTS:
                    return <Events userData={userData} />;
                case Sections.ANNOUNCEMENTS:
                    return <Announcements userData={userData} />;
                default:
                    return <Home userData={userData} />;
            }
        };

        return (
            <div className="main-content">
                <div className="left-content">
                    <div className="section-button" onClick={() => this.setSection(Sections.HOME)}>
                        <img className="icon" src={house} alt="Inicio" />
                        <p>Inicio</p>
                    </div>
                    <div className="section-button" onClick={() => this.setSection(Sections.EVENTS)}>
                        <img className="icon" src={person} alt="Inicio" />
                        <p>Eventos</p>
                    </div>
                    <div className="section-button" onClick={() => this.setSection(Sections.ANNOUNCEMENTS)}>
                        <img className="icon" src={message} alt="Inicio" />
                        <p>Anuncios</p>
                    </div>
                    <div className="section-button" onClick={this.togglePopup}>
                        <div className="profile-picture-container">
                            { loadingProfilePicture ? <div className="menu-spinner"></div> : <img className="profile-picture" src={profilePictureDownloadURL} alt="Perfil" />}
                        
                            {isPopupOpen && (
                                <ProfilePopup
                                    userData={userData}
                                    onLogout={this.handleLogout}
                                    downloadProfilePictureWithName={this.downloadProfilePictureWithName}
                                    updatePictureUrl={this.props.updatePictureUrl}
                                    setLoadingProfilePicture={this.setLoadingProfilePicture}
                                />
                            )}
                        </div>
                    </div>
                </div>
                <div className="right-content">
                    <div className="section-title">
                        <p>{currentSection}</p>
                    </div>
                    <div className="section-content">{renderContent()}</div>
                </div>

            </div>
        );
    }
}

export default Menu;
