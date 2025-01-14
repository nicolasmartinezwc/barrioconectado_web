import React from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";
import Login from "./components/Login/Login.jsx";
import Menu from "./components/Menu/Menu.jsx";
import Loading from "./components/Loading/Loading.jsx";
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import db from './components/Database/Database';

class App extends React.Component {
  state = {
    user: null,
    userData: null
  };

  componentDidMount() {
    this.unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        this.setState({ user: user });
        this.fetchUserData();
      } else {
        this.setState({ user: null });
        this.setState({ userData: null });
      }
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  fetchUserData = async () => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    if (userId == null) {
      return Promise.reject(new Error("User id must not be null."));
    }

    return getDoc(doc(db, "users", userId))
      .then(userDoc => {
        if (!userDoc.exists()) {
          throw new Error("User not found.");
        }
        const userData = userDoc.data();
        this.setState({
          userData: {
            id: userId,
            email: userData.email || "",
            profile_picture: userData.profile_picture || "",
            province_id: userData.province_id || "",
            neighbourhood: userData.neighbourhood || "",
            last_name: userData.last_name || "",
            first_name: userData.first_name || "",
            description: userData.description || ""
          }
        });
      })
      .catch(error => {
        console.error("Error fetching user data:", error);
        this.setState({ userData: null });
      });
  };

  render() {
    const { user, userData } = this.state;
    return (
      <div className="main-container">
        {user ? userData ? <Menu userData={userData} /> :  <Loading hideSignOut={false} /> : <Login />}
      </div>
    );
  }
}
export default App;
