import React from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";
import Login from "./components/Login/Login.jsx";
import Menu from "./components/Menu/Menu.jsx";
import Loading from "./components/Loading/Loading.jsx";
import { getDoc, doc, updateDoc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import db from './components/Database/Database';
import Onboarding from "./components/Onboarding/Onboarding.jsx";

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

  updateNeighbourhood = async (newNeighbourhoodId, newNeighbourhoodName, provinceId, provinceName) => {
    const { user } = this.state;
  
    if (!user) {
      console.error("User is not logged in.");
      return;
    }
  
    const userId = user.uid;
    const userRef = doc(db, "users", userId);
  
    try {
      await updateDoc(userRef, { 
        neighbourhood: newNeighbourhoodId,
        province_id: provinceId
       });
  
      this.setState((prevState) => ({
        userData: {
          ...prevState.userData,
          neighbourhood: newNeighbourhoodId,
          province_id: provinceId
        },
      }));

      const neighbourhoodRef = doc(db, "neighbourhoods", newNeighbourhoodId);

      await setDoc(neighbourhoodRef, {
            id: newNeighbourhoodId,
            name: newNeighbourhoodName,
            population: 0,
            province: provinceName,
            province_id: provinceId
        });
  
    } catch (error) {
      console.error("Error updating neighbourhood:", error);
    }
  };

  updatePictureUrl = async (newPictureUrl) => {
    const { user } = this.state;
  
    if (!user) {
      console.error("User is not logged in.");
      return;
    }
  
    const userId = user.uid;
    const userRef = doc(db, "users", userId);
  
    try {
      await updateDoc(userRef, { picture_url: newPictureUrl });
  
      this.setState((prevState) => ({
        userData: {
          ...prevState.userData,
          picture_url: newPictureUrl,
        },
      }));
  
    } catch (error) {
      console.error("Error updating picture_url:", error);
    }
  };

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
            picture_url: userData.picture_url || "",
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
        {user ? userData ? userData.neighbourhood ? <Menu userData={userData} updatePictureUrl={this.updatePictureUrl} /> : <Onboarding userData={userData} updateNeighbourhood={this.updateNeighbourhood} /> :  <Loading hideSignOut={false} /> : <Login />}
      </div>
    );
  }
}
export default App;
