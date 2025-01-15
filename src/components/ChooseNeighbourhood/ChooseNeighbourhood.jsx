import React from "react";
import "./ChooseNeighbourhood.css";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";

class ChooseNeighbourhood extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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

    render() {
        return (
            <div className="choose-neighbourhood-main-content">
                elegir barrio

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

export default ChooseNeighbourhood;
