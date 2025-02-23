import React from "react";
import './Login.css';
import logo from '../../assets/logo.png';
import googleLogo from '../../assets/google_logo.png';
import SignUp from '../SignUp/SignUp.jsx';
import LoginViewModel from "./LoginViewModel.js";
import RecoverPassword from "../RecoverPassword/RecoverPassword.jsx";
import { getAuth, signInWithPopup, GoogleAuthProvider, getAdditionalUserInfo } from "firebase/auth";
import db from '../Database/Database';
import { doc, setDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      showPassword: false,
      showSignUp: false,
      passwordInputType: "password",
      errorMessage: '',
      showForgotPassword: false,
      disableButton: false
    };

    this.viewModel = new LoginViewModel();
  }

  handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        this.setState({ user: null });
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
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

  handleLoginWithGoogle = async () => {
    try {
      this.setState({ errorMessage: '' });
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      auth.languageCode = 'es';
      const result = await signInWithPopup(auth, provider);
      const additionalUserInfo = getAdditionalUserInfo(result);

      if (additionalUserInfo.isNewUser) {
        const email = additionalUserInfo.profile.email;
        const firstName = additionalUserInfo.profile.given_name;
        const id = result.user.uid
        await this.createUserInDatabaseFromGoogle(id, firstName, email);
      } else {
        this.props.fetchUserData();
      }
    } catch (error) {
      console.log(error);
      this.handleLogout();
    }
  };

  createUserInDatabaseFromGoogle = async (id, firstName, email) => {
    try {
      const auth = getAuth();
      if (!auth) {
        throw new Error("Ocurrió un error al obtener la sesión");
      }
      const userDocRef = doc(db, "users", id);
      await setDoc(userDocRef, {
        id: id,
        email: email,
        picture_url: "",
        province_id: "",
        neighbourhood: "",
        last_name: "",
        first_name: firstName,
        description: ""
      });
      this.props.fetchUserData();
    } catch (error) {
      this.handleLogout();
      throw error;
    }
  }

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

  handleLogin = async () => {
    this.setState({ disableButton: true })
    this.setState({ errorMessage: '' });
    if (this.isLoginValid()) {
      let result = await this.viewModel.loginWithCredentials(this.state.email, this.state.password);
      if (!result.valid) {
        this.setState({ errorMessage: result.message });
      }
    }
    this.setState({ disableButton: false });
  };

  handleRecoverPasswordButton = () => {
    this.setState({ showForgotPassword: true });
  };

  hideRecoverPassword = () => {
    this.setState({ showForgotPassword: false });
  };

  render() {
    const { email, password, showPassword, showSignUp, passwordInputType, errorMessage, showForgotPassword, disableButton } = this.state;

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
                  disabled={disableButton}
                  style={{
                    backgroundColor: this.state.disableButton ? '#f5f5f5' : '#49a0ff'
                  }}
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