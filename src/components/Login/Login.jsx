import React from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import './Login.css';
import logo from '../../assets/logo.png';
import googleLogo from '../../assets/google_logo.png';
import SignUp from '../SignUp/SignUp.jsx';
import LoginViewModel from "./LoginViewModel.js";
import RecoverPassword from "../RecoverPassword/RecoverPassword.jsx";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: 'test@test.com',
      password: '123456',
      showPassword: false,
      showSignUp: false,
      passwordInputType: "password",
      errorMessage: '',
      showForgotPassword: false
    };

    this.viewModel = new LoginViewModel();
  }

  handleEmailChange = (event) => {
    this.setState({ email: event.target.value });
  };

  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };

  togglePasswordVisibility = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  handleLoginWithGoogle = () => {
    console.log('Login con Google');
  };

  handleCreateAccountButton = () => {
    this.setState({ showSignUp: true });
  };

  hideSignUp = () => {
    this.setState({ showSignUp: false });
  };

  handleShowPassword = () => {
    this.state.showPassword = !this.state.showPassword
    if (this.state.showPassword) {
      this.setState({ passwordInputType: "text" });
    } else {
      this.setState({ passwordInputType: "password" });
    }
  }

  isLoginValid = () => {
    const validationResult = this.viewModel.validateLogin(
      this.state.email,
      this.state.password
    );

    if (!validationResult.valid) {
      this.setState({ errorMessage: validationResult.message });
    }

    return validationResult.valid
  };

  handleLogin = () => {
    this.setState({ errorMessage: '' });
    if (this.isLoginValid()) {
      console.log("should login");
    }
  };

  handleRecoverPasswordButton = () => {
    this.setState({ showForgotPassword: true });
  };

  hideRecoverPassword = () => {
    this.setState({ showForgotPassword: false });
  };

  render() {
    const { email, password, showPassword, showSignUp, passwordInputType, errorMessage, showForgotPassword } = this.state;

    return (
      showSignUp ?
        <SignUp hideSignUp={this.hideSignUp} />
        :
        showForgotPassword ?
        <RecoverPassword hideRecoverPassword={this.hideRecoverPassword} />
        :
        <div className="login-container">
          <div className="login-content">
            <h1 className="title">Bienvenido/a a Barrio Conectado</h1>

            <img className="logo" src={logo} alt="Logo" />

            <div className="card">

              <button className="google-btn" onClick={this.handleLoginWithGoogle}>
                <img
                  src={googleLogo}
                  alt="Google"
                  className="google-icon"
                />
                Continuar con Google
              </button>

              <div className="line-with-text">
                <hr />
                <span>O continua con tu correo</span>
                <hr />
              </div>

              <div className="inputs-container">
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

              <button 
              className="recover-password-button"
              onClick={this.handleRecoverPasswordButton}
              >
                ¿Olvidaste tu contraseña?
              </button>

              <span id="error-message-span">{errorMessage}</span>

              <button
                className="login-button"
                onClick={this.handleLogin}
              >
                Iniciar sesión
              </button>

              <button
                className="create-account-button"
                onClick={this.handleCreateAccountButton}
              >
                <span>¿Todavía no tenes una cuenta?</span>
                <span className="create-account-span">Crea una.</span>
              </button>

            </div>
          </div>
        </div>
    );
  }
}

export default Login;