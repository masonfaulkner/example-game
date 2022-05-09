import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import RulesEmpire from "./RulesEmpire";
import RulesDice from "./RulesDice";
import RulesTrivia from "./RulesTrivia";
import { bindActionCreators } from "redux";
import { navigateToWatingRoom, setGamePlay } from "../redux/Actions/gameAction";
import { connect } from "react-redux";

import Notifications from "react-notify-toast";
import "./Create_Room.css";
import "./modal.css";

class Game_Menu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gameType: "",
      code: "",
      name: "",
      server: false,
      docId: "",
      players: [],
      check: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
  }

  componentDidMount() {
    if (this.props.userData) {
      let { code, name, server, docId } = this.props.userData;

      this.setState({ code, name, server, docId }, () => {
        this.props.setGamePlay(docId);
      });
    }
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
    const { code, name, server, docId } = this.state;

    return (
      <div className="Home-bkg1">
        <Notifications />
        <div className="Header1">
          <h1 className="Title1">
            <b>Sutri Games</b>
          </h1>
        </div>

        <div className="Container">
          <div className="Center1">
            <div className="card">
              <div className="card-body" style={{ paddingTop: 0 }}>
                <div className="menu">
                  <b>Empire</b>
                </div>
                <button
                  className="Btn-Green1"
                  id="check-room Link"
                  onClick={() =>
                    this.props.navigateToWatingRoom(
                      { code, name, gameType: "Empire", docId, server },
                      this.props.history,
                      server ? "/create_room_server" : "/create_room_client"
                    )
                  }
                >
                  PLAY
                </button>
                <RulesEmpire />
              </div>
            </div>
            <div className="card">
              <div className="card-body" style={{ paddingTop: 0 }}>
                <div className="menu">
                  <b>Liar's Dice</b>
                </div>
                <button
                  className="Btn-Green1"
                  id="check-room Link"
                  onClick={() =>
                    this.props.navigateToWatingRoom(
                      { code, name, gameType: "Liar's Dice", docId, server },
                      this.props.history,
                      "/create_room_server"
                    )
                  }
                >
                  PLAY
                </button>
                <RulesDice />
              </div>
            </div>
            <div className="card">
              <div className="card-body" style={{ paddingTop: 0 }}>
                <div className="menu">
                  <b>Sutri Trivia</b>
                </div>
                <button
                  className="Btn-Green1"
                  id="check-room Link"
                  onClick={() =>
                    this.props.navigateToWatingRoom(
                      { code, name, gameType: "Sutri Trivia", docId, server },
                      this.props.history,
                      "/create_room_server"
                    )
                  }
                >
                  PLAY
                </button>

                <RulesTrivia />
              </div>
            </div>
            <div className="card">
              <div className="card-body" style={{ paddingTop: 0 }}>
                <div className="menu">
                  <b>Telestrations</b>
                </div>
                <button
                  className="Btn-Green1"
                  id="check-room"
                  onClick={() =>
                    this.props.navigateToWatingRoom(
                      {
                        code,
                        name,
                        gameType: "Telestrations",
                        docId,
                        server,
                      },
                      this.props.history,
                      "/create_room_server"
                    )
                  }
                >
                  PLAY
                </button>

                <button className="Btn-Green1">RULES</button>
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 100 + "px" }} />

        <div className="Footer1">
          <h1 className="FTitle">Copyright @ 2019 Sutri Technology LLC</h1>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoading: state.gameReducer.isLoading,
  errorMessage: state.gameReducer.errorMessage,
  userData: state.gameReducer.userData,
  isError: state.gameReducer.isError,
});

const mapDispatchToProps = (dispatch) => ({
  navigateToWatingRoom: bindActionCreators(navigateToWatingRoom, dispatch),
  setGamePlay: bindActionCreators(setGamePlay, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(useNavigate(Game_Menu));
