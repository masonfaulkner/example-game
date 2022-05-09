import React, { Component } from "react";
import firebase from "firebase/compat/app";
import "../Create_Room.css";
import ReactCountdownClock from "react-countdown-clock";
// import RulesEmpire from "../.";

let seconds = 0;

class Character_List extends Component {
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
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
  }

  componentDidMount() {
    const { players, name, docId } = this.props.location.state;
    let timer = this.state.players.length;
    if (timer < 6) {
      timer = 20000;
      seconds = 20;
    } else if (timer >= 6 && timer < 12) {
      timer = 25000;
      seconds = 25;
    } else {
      timer = 30000;
      seconds = 30;
    }
    let firstPerson;
    firebase
      .firestore()
      .collection("rooms")
      .doc(docId)
      .onSnapshot(
        snapShot => {
          this.setState(
            {
              name,
              first: snapShot.data().first,
              famousPersons: snapShot.data().famousPersons,
              play: snapShot.data().play
            },
            () => {
              setTimeout(() => {
                this.props.history.push({
                  pathname: "/player_list",
                  state: {
                    players,
                    docId,
                    first: firstPerson,
                    name
                  }
                });
              }, timer);
            }
          );
        },
        error => {
          this.setState({ name, famousPersons: [], play: false });
        }
      );
  }

  handleCheck(e) {
    this.setState({ check: !this.state.check });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.state.players.push(this.state.name);
    this.setState({ name: "" });
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

export default Character_List;
