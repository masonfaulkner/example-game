import React, { Component } from "react";
import firebase from "firebase/app";
import "../Create_Room.css";
import ReactCountdownClock from "react-countdown-clock";
// import RulesEmpire from "../.";

let seconds = 30;

class Trivia_Start_1 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      first: "",
      game: "",
      code: "",
      name: "",
      server: "",
      docId: "",
      players: [],
      famousPersons: [],
      check: false
    };
  }

  render() {
    const table = this.state.famousPersons.map((person, i) => (
      <div className="Table-Entry" key={i}>
        <td>{i + 1}. &nbsp; </td>
        <td>{person.personName}</td>
      </div>
    ));

    return (
      <div className="Home-bkg1">
        <div className="Header1">
          <h1 className="Title1">
            <b>Empire</b>
          </h1>
        </div>

        <div className="Container">
          <div className="Center1">
            <div className="spacer"></div>
            <h3>Characters</h3>
            <table className="Table">{table}</table>
            <br />
            <br />
            <h3>
              You have{" "}
              <div className="Timer">
                <ReactCountdownClock
                  seconds={seconds}
                  color="#666666"
                  alpha={0.9}
                  size={100}
                />{" "}
              </div>
              seconds to study the list before it disappears...
            </h3>
            <button className="Btn-Green1">RULES</button>
            <br /> <br />
            <br />
            <br />
          </div>
          <div className="Footer1">
            <h1 className="FTitle">Copyright @ 2019 Sutri Technology LLC</h1>
          </div>
        </div>
      </div>
    );
  }
}

export default Trivia_Start_1;
