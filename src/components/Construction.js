import React, { Component } from "react";
import logo from "../construction.png";

class Coming_Soon extends Component {
  render() {
    return (
      <div className="Home-bkg">
        <div className="Header">
          <h1 className="Title">
            <b>Sutri Games</b>
          </h1>
        </div>
        <div className="Center">
          <h1>Under Construction</h1>
          <h2>Coming Soon!</h2>
          <br />
          <br />
          <img src={logo} alt="under_construction" />
        </div>

        <div className="Footer">
          <h1 className="FTitle">Copyright @ 2019 Sutri Technology LLC</h1>
        </div>
      </div>
    );
  }
}

export default Coming_Soon;
