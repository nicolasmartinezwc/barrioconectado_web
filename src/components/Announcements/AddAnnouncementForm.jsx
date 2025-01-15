import React from "react";
import "./Announcements.css";
import hammer from '../../assets/hammer_fill.png';
import swap from '../../assets/arrow_swap.png';
import gift from '../../assets/gift_fill.png';
import InputValidator from "../Validator/InputValidator";
import { getAuth } from "firebase/auth";
import db from '../Database/Database';
import { doc, setDoc } from "firebase/firestore";

const CATEGORIES = {
    JOB: "Trabajo",
    EXCHANGE: "Intercambio",
    DONATION: "Donación"
};

class AddAnnouncementForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            description: '',
            selectedCategory: 'JOB',
            phoneNumber: '',
            usePhoneNumber: false,
            errorMessage: ''
        }
    }

    handleTitleChanged = (event) => {
        this.setState({ title: event.target.value });
    }

    handleDescriptionChanged = (event) => {
        this.setState({ description: event.target.value });
    }

    handleCategoryChange = (event) => {
        this.setState({ selectedCategory: event.target.value });
    }

    handlePhoneNumberChange = (event) => {
        this.setState({ phoneNumber: event.target.value });
    }

    handleUsePhoneNumberChange = (event) => {
        this.setState({ usePhoneNumber: event.target.checked });
    }

    clearErrorMessage = () => {
        this.setState({ errorMessage: '' });
    }

    handleCreateAnnounce = () => {
        this.clearErrorMessage();

        let validationResult = InputValidator.validateAnnouncementForm(
            this.state.title,
            this.state.description,
            this.state.phoneNumber,
            this.state.usePhoneNumber
        );

        if (validationResult.valid) {
            this.createAnnouncement();
        } else {
            this.setState({ errorMessage: validationResult.message });
        }
    }

    createAnnouncement = async () => {
        const { title, description, selectedCategory, phoneNumber, usePhoneNumber } = this.state;
        try {
            const auth = getAuth(); 
            const userId = auth.currentUser?.uid;
            const userData = this.props.userData;
            if (!userId || !userData) {
                throw new Error("Ocurrió un error al obtener la sesión");
            }
            const uuid = crypto.randomUUID();
            const currentTimeInterval = new Date().getTime() / 1000;
            const userDocRef = doc(db, "announcements", uuid);
            await setDoc(userDocRef, {
               category: selectedCategory.toLowerCase(),
               contact_phone: usePhoneNumber ? phoneNumber : '',
               created_at: currentTimeInterval,
               description: description,
               id: uuid,
               neighbourhood: userData.neighbourhood,
               owner: userId,
               owner_email: userData.email,
               owner_name: userData.first_name + userData.last_name,
               title: title,
            });
            this.props.handleBackFromForm();
            this.props.fetchAnnouncements();
            } catch (error) {
                this.setState({ errorMessage: error.message });
            }
        
    }

    currentCategoryIcon = () => {
        const { selectedCategory } = this.state;
        switch (selectedCategory) {
            case 'JOB':
                return hammer;
            case 'EXCHANGE':
                return swap;
            case 'DONATION':
                return gift;
            default:
                return null;
        }
    };

    colors = () => {
        const { selectedCategory } = this.state;
        switch (selectedCategory) {
            case "JOB":
                return {
                    iconFilter: "invert(88%) sepia(15%) saturate(921%) hue-rotate(52deg) brightness(93%) contrast(88%)",
                }
            case "EXCHANGE":
                return {
                    iconFilter: "invert(91%) sepia(21%) saturate(626%) hue-rotate(12deg) brightness(93%) contrast(92%)",
                }
            case "DONATION":
                return {
                    iconFilter: "invert(72%) sepia(60%) saturate(510%) hue-rotate(209deg) brightness(86%) contrast(93%)",
                }
            default:
                return {
                    iconFilter: "invert(88%) sepia(15%) saturate(921%) hue-rotate(52deg) brightness(93%) contrast(88%)",
                }
        }
    }

    render() {
        const { title, description, selectedCategory, phoneNumber, usePhoneNumber, errorMessage } = this.state;
        const iconSrc = this.currentCategoryIcon();
        const iconFilter = this.colors().iconFilter;

        return (
            <div className="add-announcement-form-container">
                <p className="add-announcement-form-title">Crea un anuncio</p>
                <p className="add-announcement-form-subtitle">En esta seccion podras anunciar un intercambio de artículos, donación o trabajo, ya sea que estes buscando u ofreciendo uno.</p>
                <div className="add-announcement-form-sections-container" >

                    <div>
                        <p className="add-announcement-form-section-title">TÍTULO</p>
                        <div className="add-announcement-form-section">
                            <p className="add-announcement-input-description">¿Cuál es el anuncio?</p>
                            <input
                                className="add-announcement-input"
                                type="text"
                                placeholder="Ingresa el título del anuncio"
                                value={title}
                                onChange={this.handleTitleChanged}
                            />
                        </div>
                    </div>

                    <div>
                        <p className="add-announcement-form-section-title">DESCRIPCIÓN</p>
                        <div className="add-announcement-form-section">
                            <p className="add-announcement-input-description">¿De que trata el anuncio?</p>
                            <input
                                className="add-announcement-input"
                                type="text"
                                placeholder="Ingresa una descripción"
                                value={description}
                                onChange={this.handleDescriptionChanged}
                            />
                        </div>
                    </div>

                    <div>
                        <p className="add-announcement-form-section-title">CATEGORÍA</p>
                        <div className="add-announcement-form-section">
                            <p className="add-announcement-input-description">Elige una categoría</p>
                            <div className="add-announcement-input-category-container">
                                <img
                                    className="add-announcement-input-icon"
                                    src={iconSrc}
                                    style={{
                                        filter: iconFilter
                                    }}
                                    alt="Icon"
                                />
                                <select
                                    className="add-announcement-input"
                                    value={selectedCategory}
                                    onChange={this.handleCategoryChange}
                                >
                                    {Object.entries(CATEGORIES).map(([key, label]) => (
                                        <option key={key} value={key}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="add-announcement-form-section-title">INFORMACIÓN DE CONTACTO</p>
                        <div className="add-announcement-form-section">
                            <p
                                className="add-announcement-input-description"
                                style={{
                                    fontWeight: 600
                                }}
                            >Se mostrará tu correo y tu nombre por defecto</p>
                            <div style={{
                                marginTop: '10px',
                                marginBottom: '10px'
                            }}>
                                <label className="add-announcement-input-description">Agregar número de telefono
                                    <input
                                        type="checkbox"
                                        checked={usePhoneNumber}
                                        onChange={this.handleUsePhoneNumberChange}
                                    />
                                </label>
                            </div>
                            <input
                                disabled={!usePhoneNumber}
                                className="add-announcement-input"
                                type="text"
                                placeholder="¿Cuál es tu número de teléfono?"
                                value={phoneNumber}
                                onChange={this.handlePhoneNumberChange}
                            />
                        </div>
                    </div>

                    <span
                        id="add-announcement-form-error-message-span"
                        hidden={errorMessage.length == 0}
                    >
                        {errorMessage}
                    </span>

                    <div className="add-announcement-form-buttons-container">
                        <button
                            className="add-announcement-form-back-button"
                            onClick={this.props.handleBackFromForm}
                        >
                            Volver
                        </button>
                        <button
                            className="add-announcement-form-finish-button"
                            onClick={this.handleCreateAnnounce}
                        >
                            Crear anuncio
                        </button>
                    </div>
                </div>
            </div>
        )
    };
}

export default AddAnnouncementForm;
