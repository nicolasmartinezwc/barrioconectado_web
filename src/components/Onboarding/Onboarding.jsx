import React from "react";
import "./Onboarding.css";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import onboarding1 from '../../assets/onboarding_1.png';
import onboarding2 from '../../assets/onboarding_2.png';
import onboarding3 from '../../assets/onboarding_3.png';
import ChooseNeighbourhood from "../ChooseNeighbourhood/ChooseNeighbourhood.jsx";

class Onboarding extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStep: 0,
            showChooseNeighbourhood: false
        };
    }

    handleLogout = () => {
        signOut(auth)
          .then(() => {
            this.setState({ user: null });
          })
          .catch((error) => {
            console.error("Error al cerrar sesión:", error);
          });
      }

    handleBack = () => {
        if (this.state.currentStep == 0) {
            return;
        }
        this.setState({ currentStep: this.state.currentStep - 1 });
    }

    handleNext = () => {
        if (this.state.currentStep == 2) {
            this.setState({ showChooseNeighbourhood: true });
            return;
        }
        this.setState({ currentStep: this.state.currentStep + 1 });
    }

    getStepContent = () => {
        switch (this.state.currentStep) {
            case 0:
                return {
                    imageSrc: onboarding1,
                    wording: "Barrio Conectado es una plataforma que conecta de manera sencilla, segura y eficaz a los vecinos de un mismo barrio."
                }

            case 1:
                return {
                    imageSrc: onboarding2,
                    wording: "Podrás conocer nuevos vecinos, enviar alertas, organizar eventos, buscar trabajos, intercambiar artículos y mucho más."
                }

            case 2:
                return {
                    imageSrc: onboarding3,
                    wording: "Es hora de elegir tu barrio. No te preocupes, podrás cambiarlo en cualquier momento."
                }
        }
    }

    render() {
        const { currentStep, showChooseNeighbourhood } = this.state;
        const imageSrc = this.getStepContent().imageSrc;
        const wording = this.getStepContent().wording;

        if (showChooseNeighbourhood) {
            return <ChooseNeighbourhood/>;
        }

        return (
            <div className="onboarding-main-content">
                <div>
                    <img
                        className="onboarding-image"
                        src={imageSrc}
                        alt="onboarding-image"
                    />
                    <p className="onboarding-main-wording">
                        {wording}
                    </p>
                </div>

                <div className="onboarding-buttons-container">
                    <button
                        onClick={this.handleBack}
                        hidden={currentStep == 0}
                    >
                        Atrás
                    </button>
                    <button
                        onClick={this.handleNext}
                    >
                        {currentStep == 2 ? "Comenzar" : "Siguiente"}
                    </button>
                </div>

                <div>
                    <button 
                    className="onboarding-logout-button"
                    onClick={this.handleLogout}
                    >
                        Cerrar sesión
                    </button>
                </div>
            </div>
        )
    }
}

export default Onboarding;
