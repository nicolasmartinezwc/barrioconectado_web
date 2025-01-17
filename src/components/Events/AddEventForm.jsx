import React from "react";
import "./Events.css";
import InputValidator from "../Validator/InputValidator";
import { getAuth } from "firebase/auth";
import db from '../Database/Database';
import { doc, setDoc } from "firebase/firestore";

const Categories = {
    PARTY: "party",
    GATHERING: "gathering",
    WORKSHOP: "workshop",
    sport: "sport",
    cultural: "cultural",
    kids: "kids",
    market: "market",
    music: "music",
    pet_gathering: "pet_gathering",
};

class AddEventForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            description: '',
            location: '',
            selectedCategory: '',
            selectedDate: '',
            formattedDate: '',
            allDay: false,
            selectedHour: '',
            selectedMinutes: '',
            errorMessage: ''
        }
    }

    handleTitleChanged = (event) => {
        this.setState({ title: event.target.value });
    }

    handleDescriptionChanged = (event) => {
        this.setState({ description: event.target.value });
    }

    handleLocationChanged = (event) => {
        this.setState({ location: event.target.value });
    }

    handleCategoryChanged = (event) => {
        this.setState({ selectedCategory: event.target.value })
    }

    handleDateChanged = (event) => {
        if (event.target.value) {
            const selectedDate = event.target.value;
            const [year, month, day] = selectedDate.split("-");
            const formattedDate = `El evento se realizará el día ${day}/${month}/${year}.`;

            this.setState({
                selectedDate: selectedDate,
                formattedDate: formattedDate
            });
        } else {
            this.setState({
                selectedDate: '',
                formattedDate: ''
            });
        }
    }

    handleToggleAllDay = () => {
        this.setState((prevState) => ({ allDay: !prevState.allDay }));
    };

    handleHourChanged = (event) => {
        this.setState({ selectedHour: event.target.value });
    };

    handleMinuteChanged = (event) => {
        this.setState({ selectedMinutes: event.target.value });
    };

    clearErrorMessage = () => {
        this.setState({ errorMessage: '' });
    }

    handleCreateEvent = () => {
        this.clearErrorMessage();

        const { title, description, location, selectedCategory, allDay, selectedHour, selectedMinutes, selectedDate } = this.state;
        const [year, month, day] = selectedDate.split("-");

        const validationResult = InputValidator.validateEventData(
            title,
            description,
            location,
            selectedCategory,
            day,
            month,
            year,
            allDay,
            selectedHour,
            selectedMinutes
        );

        if (validationResult.valid) {
            this.createEvent();
        } else {
            this.setState({ errorMessage: validationResult.message });
        }        
    };

    createEvent = async () => {
        const { title, description, location, selectedCategory, allDay, selectedHour, selectedMinutes, selectedDate } = this.state;
        const [year, month, day] = selectedDate.split("-");

        try {
            const auth = getAuth();
            const userId = auth.currentUser?.uid;
            const userData = this.props.userData;
            if (!userId || !userData) {
                throw new Error("Ocurrió un error al obtener la sesión");
            }
            const uuid = crypto.randomUUID();
            const currentTimeInterval = new Date().getTime() / 1000;
            const userDocRef = doc(db, "events", uuid);
            const hour = allDay ? 0 : parseInt(selectedHour);
            const minutes = allDay ? 0 : parseInt(selectedMinutes);
            let eventDate = new Date(year, month - 1, day, hour, minutes);
            const eventTimeInterval = eventDate.getTime() / 1000;
            await setDoc(userDocRef, {
                category: selectedCategory.toLowerCase(),
                created_at: currentTimeInterval,
                id: uuid,
                description: description,
                neighbourhood: userData.neighbourhood,
                title: title,
                assistants: [],
                all_day: allDay,
                starts_at_hours: hour,
                starts_at_minutes: minutes,
                location: location,
                creator: userData.first_name + " " + userData.last_name,
                date: eventTimeInterval
            });
            this.props.handleBackFromForm();
            this.props.fetchEvents();
        } catch (error) {
            this.setState({ errorMessage: error.message });
        }
    };

    render() {
        const { title, description, location, formattedDate, errorMessage } = this.state;

        return (
            <div className="add-event-form-container">
                <p className="add-event-form-title">
                    Crea un nuevo evento
                </p>

                <div className="add-event-form-sections-container">

                    <div>
                        <p className="add-event-form-section-title">TÍTULO</p>
                        <div className="add-event-form-section">
                            <p className="add-event-input-description">¿Cuál es el título del evento?</p>
                            <input
                                className="add-event-input"
                                type="text"
                                placeholder="Ingresa el título del evento"
                                value={title}
                                onChange={this.handleTitleChanged}
                            />
                        </div>
                    </div>

                    <div>
                        <p className="add-event-form-section-title">DESCRIPCIÓN</p>
                        <div className="add-event-form-section">
                            <p className="add-event-input-description">¿De qué trata el evento?</p>
                            <input
                                className="add-event-input"
                                type="text"
                                placeholder="Ingresa una descripción"
                                value={description}
                                onChange={this.handleDescriptionChanged}
                            />
                        </div>
                    </div>

                    <div>
                        <p className="add-event-form-section-title">UBICACIÓN</p>
                        <div className="add-event-form-section">
                            <p className="add-event-input-description">¿Donde queda?</p>
                            <input
                                className="add-event-input"
                                type="text"
                                placeholder="Escribe la dirección"
                                value={location}
                                onChange={this.handleLocationChanged}
                            />
                        </div>
                    </div>

                    <div>
                        <p className="add-event-form-section-title">CATEGORÍA</p>
                        <div className="add-event-form-section">
                            <div className="add-event-form-input-row-display">
                                <label className="add-event-input-description">Elige una categoría:</label>
                                <select
                                    className="add-event-form-select"
                                    value={this.state.selectedCategory || ""}
                                    onChange={this.handleCategoryChanged}
                                >
                                    <option value="">Selecciona una categoría</option>
                                    {Object.entries(Categories).map(([key, value]) => (
                                        <option key={value} value={value}>
                                            {this.props.eventInformation(value)?.spanishName.charAt(0).toUpperCase() + this.props.eventInformation(value)?.spanishName.slice(1).toLowerCase()}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <hr />
                            {(
                                <div className="add-event-form-input-row-display">
                                    <div
                                        hidden={!this.state.selectedCategory}
                                        className="add-event-form-category-icon-container"
                                        style={{
                                            width: this.state.selectedCategory ? 40 : 0,
                                            height: this.state.selectedCategory ? 40 : 0,
                                            marginRight: this.state.selectedCategory ? 10 : 0,
                                            backgroundColor: this.props.eventInformation(this.state.selectedCategory)?.iconBackgroundColor || "",
                                        }}
                                    >
                                        <img
                                            hidden={!this.state.selectedCategory}
                                            className="add-event-form-category-icon"
                                            src={this.props.eventInformation(this.state.selectedCategory)?.iconSrc || ""}
                                            alt={this.state.selectedCategory}
                                            style={{
                                                filter: this.props.eventInformation(this.state.selectedCategory)?.iconFilter || "",
                                            }}
                                        />
                                    </div>
                                    <span className="add-event-form-category-description">
                                        {this.props.eventInformation(this.state.selectedCategory)?.description || "Selecciona una categoría."}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <p className="add-event-form-section-title">FECHA</p>
                        <div className="add-event-form-section">
                            <div className="add-event-form-input-row-display">
                                <p className="add-event-input-description">Selecciona una fecha:</p>
                                <input
                                    type="date"
                                    id="date-picker"
                                    value={this.state.selectedDate}
                                    onChange={this.handleDateChanged}
                                    style={{

                                    }}
                                />
                            </div>
                            <hr />
                            <span className="add-event-form-date-description">
                                {formattedDate ? formattedDate : "La fecha es obligatoria."}
                            </span>
                        </div>
                    </div>

                    <div>
                        <p className="add-event-form-section-title">HORARIO</p>
                        <div className="add-event-form-section">
                            <div className="add-event-form-input-row-display">
                                <label className="add-event-input-description">
                                    <input
                                        type="checkbox"
                                        checked={this.state.allDay}
                                        onChange={this.handleToggleAllDay}
                                    />
                                    Dura todo el día
                                </label>
                            </div>

                            {!this.state.allDay && (
                                <>
                                    <hr />
                                    <div className="add-event-form-input-row-display">
                                        <label className="add-event-input-description">
                                            ¿A qué hora empieza?
                                            <select
                                                className="add-event-form-select"
                                                value={this.state.selectedHour}
                                                onChange={this.handleHourChanged}
                                            >
                                                <option value="">Hora</option>
                                                {Array.from({ length: 24 }, (_, i) => (
                                                    <option key={i} value={i}>
                                                        {i < 10 ? `0${i}` : i}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                    </div>
                                    <hr />
                                    <div className="add-event-form-input-row-display">
                                        <label className="add-event-input-description">
                                            Minutos
                                            <select
                                                className="add-event-form-select"
                                                value={this.state.selectedMinutes}
                                                onChange={this.handleMinuteChanged}
                                            >
                                                <option value="">Minutos</option>
                                                {Array.from({ length: 60 }, (_, i) => (
                                                    <option key={i} value={i}>
                                                        {i < 10 ? `0${i}` : i}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                </div>

                <span
                        id="add-event-form-error-message-span"
                        hidden={errorMessage.length == 0}
                    >
                        {errorMessage}
                    </span>

                <div className="add-event-form-buttons-container">
                    <button
                        className="add-event-form-back-button"
                        onClick={this.props.handleBackFromForm}
                    >
                        Volver
                    </button>
                    <button
                        className="add-event-form-finish-button"
                        onClick={this.handleCreateEvent}
                    >
                        Crear evento
                    </button>
                </div>
            </div>
        )
    };
}

export default AddEventForm;
