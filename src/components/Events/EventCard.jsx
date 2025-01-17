import React from "react";
import "./Events.css";
import lines from '../../assets/line_horizontal_3.png';
import location from '../../assets/location_on.png';
import calendar from '../../assets/event_note.png';

class EventCard extends React.Component {
    constructor(props) {
        super(props);
    }

    getDate = () => {
        const date = new Date(this.props.event.date * 1000);
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
        const eventInfo = this.props.eventInformation(this.props.event.category);
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
