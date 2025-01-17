import React from "react";
import "./Events.css";
import EventsViewModel from "./EventsViewModel.js";
import EventCard from "./EventCard.jsx";
import Loading from "../Loading/Loading.jsx";
import AddEventForm from "./AddEventForm.jsx";

class Events extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      isLoading: false,
      showAddEventForm: false
    }
    this.viewModel = new EventsViewModel(this.props.userData);
  }

  async componentDidMount() {
    this.setState({ isLoading: true });
    const events = await this.viewModel.fetchEvents();
    this.setState({ events: events });
    this.setState({ isLoading: false });
  }

  toggleAssistance = async (event) => {
    const updatedEvents = await this.viewModel.toggleAssistance(this.state.events, event);
    if (updatedEvents) {
      this.setState({ events: updatedEvents });
    }
  }

  handleAddEventButton = () => {
    this.setState({ showAddEventForm: true });
  }

  handleBackFromForm = () => {
    this.setState({ showAddEventForm: false });
  }

  render() {
    const { events, isLoading, showAddEventForm } = this.state;

    if (showAddEventForm) {
      return (
        <div>
          <AddEventForm
          />
        </div>
      );
    }

    return (
      <div className="events-page">
        {isLoading ? (
          <div className="loading-container">
            <Loading hideSignOut={true} />
          </div>
        ) : (
          events.length > 0 ? (
            <div className="events-container">
              {events.map((event, index) => (
                <div key={index}>
                  <EventCard
                    event={event}
                    toggleAssistance={this.toggleAssistance}
                    userId={this.props.userData.id}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-content">
              <p>No hay eventos planeados aún... ¡Sé el primero en crear uno!</p>
            </div>
          )
        )}

        <button className="floating-button" onClick={this.handleAddEventButton}>
          Agregar Evento
        </button>
      </div>
    );
  }
}

export default Events;
