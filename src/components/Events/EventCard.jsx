import React from "react";
import "./Events.css";

class EventCard extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { event } = this.props;

        return (
            <div
                className="event-card"
            >
                <p>card title</p>
                <p>userid: {this.props.userId}</p>
            </div>
        )
    };
}

export default AnnouncementCard;
