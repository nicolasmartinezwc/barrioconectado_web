import React from "react";
import "./Announcements.css";
import hammer from '../../assets/hammer_fill.png';
import swap from '../../assets/arrow_swap.png';
import gift from '../../assets/gift_fill.png';
import person from '../../assets/person.png';
import lines from '../../assets/line_horizontal_3.png';
import phone from '../../assets/phone.png';
import envelope from '../../assets/envelope.png';
import xmark from '../../assets/xmark.png';

class AnnouncementCard extends React.Component {
    constructor(props) {
        super(props);
    }

    handleCrossClicked = () => {
        this.props.handleCrossClicked(this.props.announcement.id)
    }

    render() {
        const { announcement } = this.props;

        const renderIcon = () => {
            switch (this.props.announcement.category) {
                case "job":
                    return hammer;
                case "exchange":
                    return swap;
                case "donation":
                    return gift;
                default:
                    return hammer;
            }
        };

        const colors = () => {
            switch (this.props.announcement.category) {
                case "job":
                    return {
                        iconFilter: "invert(88%) sepia(15%) saturate(921%) hue-rotate(52deg) brightness(93%) contrast(88%)",
                        iconBackgroundColor: "#3a6e26",
                        backgroundColor: "#a4db8f",
                    }
                case "exchange":
                    return {
                        iconFilter: "invert(91%) sepia(21%) saturate(626%) hue-rotate(12deg) brightness(93%) contrast(92%)",
                        iconBackgroundColor: "#4c4f1d",
                        backgroundColor: "#d6db8f",
                    }
                case "donation":
                    return {
                        iconFilter: "invert(61%) sepia(56%) saturate(452%) hue-rotate(236deg) brightness(160%) contrast(100%)",
                        iconBackgroundColor: "#331047",
                        backgroundColor: "#bf98d6",
                    }
                default:
                    return {
                        iconFilter: "invert(88%) sepia(15%) saturate(921%) hue-rotate(52deg) brightness(93%) contrast(88%)",
                        iconBackgroundColor: "#3a6e26",
                        backgroundColor: "#a4db8f",
                    }
            }
        }

        const { iconFilter, backgroundColor, iconBackgroundColor } = colors();

        return (
            <div
                className="announcement-card"
                style={{
                    backgroundColor: backgroundColor,
                }}
            >
                <div 
                className="announcement-card-title-section"
                    style={{
                        placeContent:  announcement.owner === this.props.userId ? "space-between" : "start"
                    }}
                >
                <div
                        className="announcement-card-icon-container"
                        style={{
                            backgroundColor: iconBackgroundColor
                        }}
                    >
                    <img
                        className="announcement-card-icon"
                        src={renderIcon()}
                        style={{
                            filter: iconFilter,
                        }}
                        alt="Icon"
                    />
                    </div>
                    <p>{announcement.title}</p>
                    {
                        announcement.owner === this.props.userId ?
                            <div
                                className="announcement-card-cross-container"
                                onClick={this.handleCrossClicked}
                            >
                                <img
                                    className="announcement-card-cross-icon"
                                    src={xmark}
                                    alt="Icon"
                                />
                            </div>
                            :
                            null
                    }
                </div>
                <hr />
                <div className="announcement-card-content-section">
                    <div className="announcement-card-row">
                        <img
                            className="announcement-card-row-icon"
                            src={lines}
                            alt="Icon"
                        />
                        <p>{announcement.description}</p>
                    </div>
                    <div className="announcement-card-row">
                        <img
                            className="announcement-card-row-icon"
                            src={person}
                            alt="Icon"
                        />
                        <p>{announcement.owner_name}</p>
                    </div>
                    <div className="announcement-card-row">
                        <img
                            className="announcement-card-row-icon"
                            src={envelope}
                            alt="Icon"
                        />
                        <p>{announcement.owner_email}</p>
                    </div>
                    <div className="announcement-card-row">
                        <img
                            className="announcement-card-row-icon"
                            src={phone}
                            alt="Icon"
                        />
                        <p>{announcement.contact_phone ? announcement.contact_phone : "-"}</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default AnnouncementCard;
