import React from "react";
import './RecoverPassword.css';
import RecoverPasswordViewModel from "./RecoverPasswordViewModel";

class RecoverPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            errorMessage: '',
            successMessage: ''
        };

        this.viewModel = new RecoverPasswordViewModel();
    }

    handleEmailChange = (event) => {
        this.setState({ email: event.target.value });
    };

    handleGoBackButton = () => {
        this.props.hideRecoverPassword()
    };

    isEmailValid = () => {
        const validationResult = this.viewModel.validateRecoverPassword(this.state.email);
        if (!validationResult.valid) {
            this.setState({ errorMessage: validationResult.message });
        }
        return validationResult.valid
    };

    handleRecoverPasswordButton = async () => {
        this.setState({ errorMessage: '' });
        this.setState({ successMessage: '' });
        if (this.isEmailValid()) {
            const result = await this.viewModel.sendPasswordResetEmail(this.state.email);
            if (result.valid) {
                this.setState({ successMessage: result.message });
            } else {
                this.setState({ errorMessage: result.message });
            }
        }
    };

    render() {
        const { email, errorMessage, successMessage } = this.state;

        return (
            <div className="sign-up-container">
                <div className="button-and-title-container">
                    <button
                        className="go-back-button"
                        onClick={this.handleGoBackButton}
                    >
                        Ir atrás
                    </button>
                    <h1 className="title">Recuperar contraseña</h1>
                </div>
                <div className="card">
                    <p>Ingresa tu dirección de e-mail y te enviaremos un correo para que restablezcas tu contraseña.</p>
                    <div className="inputs-container">
                        <div className="email-container">
                            <input
                                type="email"
                                placeholder="Ingresa tu e-mail"
                                value={email}
                                onChange={this.handleEmailChange}
                                className="textfield"
                            />
                        </div>

                    </div>
                    <span id="error-message-span">{errorMessage}</span>
                    <span id="success-message-span">{successMessage}</span>
                    <button
                        className="login-button"
                        onClick={this.handleRecoverPasswordButton}
                    >
                        <span>Recuperar contraseña</span>
                    </button>

                </div>
            </div>
        );
    }
}

export default RecoverPassword;