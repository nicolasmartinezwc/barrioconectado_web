import React from "react";
import "./Events.css";
import EventsViewModel from "./EventsViewModel.js";

class Events extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
    }
    this.viewModel = new EventsViewModel(this.props.userData);
  }

  async componentDidMount() {
    const events = await this.viewModel.fetchEvents();
    console.log(events);
    this.setState({ events: events });
  }

  render() {
    const { events } = this.state;
    return (
      events ?
      events.length > 0 ?
            <div className="events-container">
                {events.map((event, index) => (
                    <div key={index}>
                        <EventCard 
                          event={event}
                          userId={this.props.userData.id}
                        />
                    </div>
                ))}
            </div>
            :
            <div className="empty-content">
                <p>
                    No hay eventos planeados aún... Se el primero en crear uno!
                </p>
            </div>
            :
            <div>
                <Loading hideSignOut={true} />
            </div>
    );
}
}

export default Events;
