import React, { Component } from "react";
import firebase from "../../firebase";
import "../Create_Room.css";
import RulesEmpire from "../RulesEmpire";

class Player_List extends Component {
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
      check: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
  }

  componentDidMount() {
    const { first, name, docId } = this.props.location.state;
    // console.log("Inside character list", { first, name, docId });
    firebase
      .firestore()
      .collection("rooms")
      .doc(docId)
      .onSnapshot(
        (snapShot) => {
          this.setState(
            {
              name,
              first: snapShot.data().first,
              players: snapShot.data().players,
              play: snapShot.data().play,
            },
            () => {
              if (this.state.play) {
                // this.props.history.push({
                //   // pathname: "/play_empire",
                //   state: {
                //     docId,
                //     name
                //   }
                // })
              }
            }
          );
        },
        (error) => {
          this.setState({ name, players: [], play: false });
        }
      );
  }

  handleCheck(e) {
    this.setState({ check: !this.state.check });
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  render() {
    const table = this.state.players.map((player, i) => (
      <div className="Table-Entry" key={i}>
        <td>{i + 1}. &nbsp; </td>
        <td>{player}</td>
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
            <div className="form-group">
              <h1>
                <span style={{ backgroundColor: "yellow" }}>
                  {this.state.first}
                </span>{" "}
                goes first!
              </h1>
              <h2>let the games begin!</h2>
              <div className="spacer"></div>
              <h3>Players</h3>
              <div className="Table">{table}</div>
              <br />
              <RulesEmpire />
              <br />
              <br />
              <br />
            </div>
          </div>

          <div className="Footer1">
            <h1 className="FTitle">Copyright @ 2019 Sutri Technology LLC</h1>
          </div>
        </div>
      </div>
    );
  }
}

export default Player_List;
