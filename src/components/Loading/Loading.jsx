import React from "react";
import './Loading.css';
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";

class Loading extends React.Component {
  handleLogout = () => {
    signOut(auth)
      .then(() => {
        this.setState({ user: null });
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  }

  render() {
    const { hideSignOut } = this.props;
     return (
      <div className="loading-container">
        <div className="spinner"></div>
        <button
          hidden={hideSignOut}
          onClick={this.handleLogout}
          className="logout-button"
        >
          Cerrar sesión
        </button>
      </div>
    );
  }
}

export default Loading;