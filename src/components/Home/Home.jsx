import React from "react";
import HomeViewModel from "./HomeViewModel.js";
import "./Home.css";

class Home extends React.Component {
    constructor(props) {
      super(props);
      this.viewModel = new HomeViewModel();
    }

    render() {
      return (
        <div>
         Home
        </div>
      );
    }
  }
  
  export default Home;
  