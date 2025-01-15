import React from "react";
import "./Events.css";
import hifispeaker from '../../assets/hifispeaker.png';
import people from '../../assets/person_fill.png';
import paintbrush from '../../assets/paintbrush.png';
import sportscourt from '../../assets/sportscourt.png';
import hammer from '../../assets/hammer_fill.png';
import child from '../../assets/child_care.png';
import cart from '../../assets/shopping_cart.png';
import music from '../../assets/music_note_list.png';
import pets from '../../assets/pets.png';
import lines from '../../assets/line_horizontal_3.png';
import location from '../../assets/location_on.png';
import calendar from '../../assets/event_note.png';

class EventCard extends React.Component {
    constructor(props) {
        super(props);
    }

    eventInformation = () => {
        switch (this.props.event.category) {
            case "party":
                return {
                    spanishName: "Celebraciones",
                    iconSrc: hifispeaker,
                    iconFilter: "invert(72%) sepia(52%) saturate(436%) hue-rotate(324deg) brightness(98%) contrast(92%)",
                    iconBackgroundColor: "#fae0cf",
                    description: "Fiestas y celebraciones."
                }
            case "gathering":
                return {
                    spanishName: "Juntadas",
                    iconSrc: people,
                    iconFilter: "invert(13%) sepia(68%) saturate(7323%) hue-rotate(352deg) brightness(92%) contrast(106%)",
                    iconBackgroundColor: "#d19da0",
                    description: "Reuniones informales."
                }
            case "workshop":
                return {
                    spanishName: "Talleres",
                    iconSrc: hammer,
                    iconFilter: "invert(82%) sepia(13%) saturate(509%) hue-rotate(63deg) brightness(82%) contrast(89%)",
                    iconBackgroundColor: "#c3dbca",
                    description: "Talleres prácticos, como cocina, arte o tecnología."
                }
            case "sport":
                return {
                    spanishName: "Deportes",
                    iconSrc: sportscourt,
                    iconFilter: "invert(85%) sepia(60%) saturate(2410%) hue-rotate(352deg) brightness(93%) contrast(98%)",
                    iconBackgroundColor: "#f3f5a9",
                    description: "Eventos deportivos, como torneos o clases."
                }
            case "cultural":
                return {
                    spanishName: "Cultural",
                    iconSrc: paintbrush,
                    iconFilter: "invert(7%) sepia(34%) saturate(376%) hue-rotate(58deg) brightness(97%) contrast(89%)",
                    iconBackgroundColor: "#94a391",
                    description: "Actividades culturales, como visitas guiadas, proyecciones de cine."
                }
            case "kids":
                return {
                    spanishName: "Niños/as",
                    iconSrc: child,
                    iconFilter: "invert(0%) sepia(76%) saturate(14%) hue-rotate(225deg) brightness(91%) contrast(103%)",
                    iconBackgroundColor: "#a4ceeb",
                    description: "Actividades orientadas a niños, como juegos o fiestas infantiles."
                }
            case "market":
                return {
                    spanishName: "Comercio",
                    iconSrc: cart,
                    iconFilter: "invert(53%) sepia(95%) saturate(5304%) hue-rotate(11deg) brightness(97%) contrast(91%)",
                    iconBackgroundColor: "#ebb9a4",
                    description: "Mercados o ferias para vender e intercambiar productos."
                }
            case "music":
                return {
                    spanishName: "Música",
                    iconSrc: music,
                    iconFilter: "invert(18%) sepia(22%) saturate(717%) hue-rotate(342deg) brightness(98%) contrast(86%)",
                    iconBackgroundColor: "#9c855d",
                    description: "Conciertos o eventos de música en vivo."
                }
            case "pet_gathering":
                return {
                    spanishName: "Mascotas",
                    iconSrc: pets,
                    iconFilter: "invert(68%) sepia(47%) saturate(267%) hue-rotate(149deg) brightness(96%) contrast(93%)",
                    iconBackgroundColor: "#ccdbe0",
                    description: "Conciertos o eventos de música en vivo."
                }
            default:
                return {
                    spanishName: "Otro",
                    iconSrc: "",
                    description: ""
                };
        }
    };

    getDate = () => {
        const date = new Date(this.props.event.date);
        const dateString = date.toLocaleDateString();
        const timeString = date.toLocaleTimeString();
        return `${dateString} ${timeString}`;
    };

    toggleAssistance = () => {
        this.props.toggleAssistance(this.props.event);
    }

    buttonBackgroundColor = () => {
        return this.props.event.assistants.includes(this.props.userId) ? "#f7d5d7" : "#eafbf1"
    }

    buttonText = () => {
        return this.props.event.assistants.includes(this.props.userId) ? "No asistiré" : "Asistiré a este evento"
    }

    buttonTextColor = () => {
        return this.props.event.assistants.includes(this.props.userId) ? "#b85c62" : "#2ca57c"
    }

    render() {
        const eventInfo = this.eventInformation();
        const date = this.getDate();
        const buttonBackgroundColor = this.buttonBackgroundColor();
        const { event } = this.props;
        const buttonText = this.buttonText();
        const buttonTextColor = this.buttonTextColor();

        return (
            <div className="event-card">
                <div className="event-card-title-section">
                    <p>{event.title}</p>
                    <div
                        className="event-card-icon-wrapper"
                        style={{
                            backgroundColor: eventInfo.iconBackgroundColor,
                        }}
                    >
                        <img
                            className="event-card-icon"
                            src={eventInfo.iconSrc}
                            style={{
                                filter: eventInfo.iconFilter,
                            }}
                            alt="Icon"
                        />
                    </div>
                </div>
                <hr className="event-card-separator" />
                <div className="event-card-row">
                    <img
                        className="event-card-row-icon"
                        src={lines}
                        alt="Icon"
                    />
                    <p>{event.description}</p>
                </div>
                <div className="event-card-row">
                    <img
                        className="event-card-row-icon"
                        src={location}
                        alt="Icon"
                    />
                    <p>{event.location}</p>
                </div>
                <div className="event-card-row">
                    <img
                        className="event-card-row-icon"
                        src={calendar}
                        alt="Icon"
                    />
                    <p>{date}</p>
                </div>
                <hr className="event-card-separator" />
                <div className="event-card-organizator">
                    <span>Organizador: </span>
                    <span>{event.creator}</span>
                    <span> - </span>
                    <span> {event.assistants.length == 1 ? "Asistirá" : "Asistirán"} </span>
                    <span> {event.assistants.length} </span>
                    <span> {event.assistants.length == 1 ? "persona" : "personas"} </span>
                </div>
                <hr className="event-card-separator" />
                <div className="event-card-button-wrapper">
                    <button
                        className="event-card-assisttance-button"
                        onClick={this.toggleAssistance}
                        style={{
                            color: buttonTextColor,
                            backgroundColor: buttonBackgroundColor
                        }}
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        );
    }
}

export default EventCard;
