import React from "react";
import './SignUp.css';
import SignUpViewModel from "./SignUpViewModel";

class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            showPassword: false,
            passwordInputType: "password",
            errorMessage: '',
            disableButton: false
        };

        this.viewModel = new SignUpViewModel();
    }

    handleFirstNameChange = (event) => {
        this.setState({ firstName: event.target.value });
    };

    handleLastNameChange = (event) => {
        this.setState({ lastName: event.target.value });
    };

    handleEmailChange = (event) => {
        this.setState({ email: event.target.value });
    };

    handlePasswordChange = (event) => {
        this.setState({ password: event.target.value });
    };

    handleGoBackButton = () => {
        this.props.hideSignUp()
    };

    handleShowPassword = () => {
        this.state.showPassword = !this.state.showPassword;
        if (this.state.showPassword) {
            this.setState({ passwordInputType: "text" });
        } else {
            this.setState({ passwordInputType: "password" });
        }
    }

    isSignUpValid = () => {
        const validationResult = this.viewModel.validateSignUp(
            this.state.firstName,
            this.state.lastName,
            this.state.email,
            this.state.password
        );

        if (!validationResult.valid) {
            this.setState({ errorMessage: validationResult.message });
        }

        return validationResult.valid
    };

    handleSignUpButton = async () => {
        this.setState({ errorMessage: '' });
        this.setState({ disableButton: true });
        if (this.isSignUpValid()) {
            let result = await this.viewModel.createUserWithCredentials(
                this.state.firstName,
                this.state.lastName,
                this.state.email,
                this.state.password
            )
            if (!result.valid) {
                this.setState({ errorMessage: result.message });
            }
        }
        this.setState({ disableButton: false });
    };

    render() {
        const { firstName, lastName, email, password, showPassword, passwordInputType, errorMessage, disableButton } = this.state;

        return (
            <div className="sign-up-container">
                <div className="button-and-title-container">
                    <button
                        className="go-back-button"
                        onClick={this.handleGoBackButton}
                    >
                        Ir atrás
                    </button>
                    <h1 className="title">Registrarse</h1>
                </div>
                <div className="card">
                    <div className="inputs-container">
                        <div className="first-name-container">
                            <label>Nombre</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={this.handleFirstNameChange}
                                className="textfield"
                            />
                        </div>

                        <div className="last-name-container">
                            <label>Apellido (opcional)</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={this.handleLastNameChange}
                                className="textfield"
                            />
                        </div>

                        <div className="email-container">
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={this.handleEmailChange}
                                className="textfield"
                            />
                        </div>

                        <div className="password-container">
                            <div className="password-labels-container">
                                <label>Contraseña</label>
                                <button
                                    className="show-password-button"
                                    onClick={this.handleShowPassword}
                                >
                                    {showPassword ? "Ocultar" : "Mostrar"}
                                </button>
                            </div>
                            <input
                                type={passwordInputType}
                                value={password}
                                onChange={this.handlePasswordChange}
                                className="textfield"
                                id="password-textfield"
                            />
                        </div>
                    </div>
                    <span id="error-message-span">{errorMessage}</span>
                    <button
                        disabled={disableButton}
                        className="login-button"
                        style={{
                            backgroundColor: this.state.disableButton ? '#f5f5f5' : '#49a0ff'
                        }}
                        onClick={this.handleSignUpButton}
                    >
                        <span>Finalizar</span>
                    </button>

                </div>
            </div>
        );
    }
}

export default SignUp;