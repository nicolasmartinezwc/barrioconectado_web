import React from "react";
import "./Events.css";
import EventsViewModel from "./EventsViewModel.js";
import EventCard from "./EventCard.jsx";
import Loading from "../Loading/Loading.jsx";
import AddEventForm from "./AddEventForm.jsx";
import hifispeaker from '../../assets/hifispeaker.png';
import people from '../../assets/person_fill.png';
import paintbrush from '../../assets/paintbrush.png';
import sportscourt from '../../assets/sportscourt.png';
import hammer from '../../assets/hammer_fill.png';
import child from '../../assets/child_care.png';
import cart from '../../assets/shopping_cart.png';
import music from '../../assets/music_note_list.png';
import pets from '../../assets/pets.png';

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
    await this.fetchEvents();
  }

  fetchEvents = async () => {
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

  eventInformation = (category) => {
    switch (category) {
      case "party":
        return {
          spanishName: "Celebraciones",
          iconSrc: hifispeaker,
          iconFilter: "invert(71%) sepia(24%) saturate(736%) hue-rotate(330deg) brightness(101%) contrast(87%)",
          iconBackgroundColor: "#fae0cf",
          description: "Fiestas y celebraciones."
        }
      case "gathering":
        return {
          spanishName: "Juntadas",
          iconSrc: people,
          iconFilter: "invert(13%) sepia(97%) saturate(6566%) hue-rotate(353deg) brightness(93%) contrast(103%)",
          iconBackgroundColor: "#d19da0",
          description: "Reuniones informales."
        }
      case "workshop":
        return {
          spanishName: "Talleres",
          iconSrc: hammer,
          iconFilter: "invert(79%) sepia(8%) saturate(832%) hue-rotate(63deg) brightness(87%) contrast(86%)",
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
          description: "Reuniones de mascotas."
        }
      default:
        return {
          spanishName: "Otro",
          iconSrc: "",
          description: ""
        };
    }
  };

  render() {
    const { events, isLoading, showAddEventForm } = this.state;

    if (showAddEventForm) {
      return (
        <div>
          <AddEventForm
            eventInformation={this.eventInformation}
            handleBackFromForm={this.handleBackFromForm}
            fetchEvents={this.fetchEvents}
            userData={this.props.userData}
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
                    eventInformation={this.eventInformation}
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
