import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";

class Home extends React.Component {
    constructor(props) {
      super(props);
    }
  
    render() {
      return (
        <div>
          <p>Test</p>
          <button onClick={this.handleLogout}>Cerrar sesión</button>
        </div>
      );
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
  }
  
  export default Home;
  