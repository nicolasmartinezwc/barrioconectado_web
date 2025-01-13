import React from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";
import Login from "./components/Login/Login.jsx";
import Home from "./components/Home/Home.jsx";

class App extends React.Component {
  state = {
    user: null,
  };

  componentDidMount() {
    this.unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        this.setState({ user: user });
      } else {
        this.setState({ user: null });
      }
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  render() {
    const { user } = this.state;
    return (
      <div className="main-container">
        {user ? <Home /> : <Login />}
      </div>
    );
  }
}

export default App;
