import React from "react";
import "./Menu.css";
import Home from "../Home/Home.jsx";
import Announcements from "../Announcements/Announcements.jsx";
import Events from "../Events/Events.jsx";
import house from '../../assets/house.png';
import message from '../../assets/message.png';
import person from '../../assets/person_fill.png';

const Sections = {
    HOME: "Inicio",
    EVENTS: "Eventos",
    ANNOUNCEMENTS: "Anuncios",
    PROFILE: "Mi perfil",
};

class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentSection: Sections.HOME,
        };
    }

    setSection = (section) => {
        this.setState({ currentSection: section });
    };

    render() {
        const { currentSection } = this.state;
        const { userData } = this.props;

        const renderContent = () => {
            switch (currentSection) {
                case Sections.HOME:
                    return <Home userData={userData} />;
                case Sections.EVENTS:
                    return <Events userData={userData} />;
                case Sections.ANNOUNCEMENTS:
                    return <Announcements userData={userData} />;
                case Sections.PROFILE:
                    return <Profile />;
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
                    <div onClick={() => this.setSection(Sections.PROFILE)}>
                        <p>Perfil</p>
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
