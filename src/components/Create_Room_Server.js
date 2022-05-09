import React, { Component } from "react";
import RulesEmpire from "./RulesEmpire";
import RulesDice from "./RulesDice";
import Notifications, { notify } from "react-notify-toast";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import RulesTrivia from "./RulesTrivia";
import { getGameData, startToPlayGame } from "../redux/Actions/serverAction";
import "./Create_Room.css";

class Create_Room_Server extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gameType: "",
      first: "",
      code: "",
      name: "",
      server: "",
      docId: "",
      players: [],
      noOfPlayers: 0,
      check: false,
    };
    this.handleCheck = this.handleCheck.bind(this);
  }

  componentDidMount() {
    if (this.props.userData) {
      const { code, name, server, gameType, docId } = this.props.userData;
      this.setState({ code, name, server, gameType, docId }, () => {
        this.props.getGameData(gameType);
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.gameData) {
      this.setState({ ...nextProps.gameData });
    }
  }

  handleCheck(e) {
    this.setState({ check: !this.state.check });
  }

  handlePopup(e) {
    const { userData } = this.props;
    if (userData ?.gameType === "Empire") {
      return <RulesEmpire />;
    } else if (userData ?.gameType === "Liar's Dice") {
      return <RulesDice />;
    } else {
      if (userData ?.gameType === "Sutri Trivia") {
        return <RulesTrivia />;
      }
    }
  }

  handlePlay = () => {
    const { noOfPlayers, check, gameType } = this.state;

    if (gameType === "Telestrations") {
      if (noOfPlayers >= 3) {
        if (check) {
          this.props.startToPlayGame(this.props.history);
        } else {
          notify.show("Check that all players are here", "error", 2000);
        }
      } else {
        notify.show(
          "Wait for other players. Need at least 3 players to start this game.",
          "warning",
          2000
        );
      }
    } else if (noOfPlayers > 1) {
      if (check) {
        this.props.startToPlayGame(this.props.history);
      } else {
        notify.show("Check that all players are here", "error", 2000);
      }
    } else {
      notify.show("Wait for other players", "error", 2000);
    }
  };

  render() {
    const table = this.state.players ?.map((player, i) => (
      <div className="Table-Entry" key={i}>
        <td>{i + 1}. &nbsp; </td>
        <td>{player}</td>
      </div>
    ));

    return (
      <div className="Home-bkg1">
        <Notifications />
        <div className="Header1">
          <div className="home">
            <Link className="homeLink" to="/">
              <h1 className="homeIcon">
                <i className="fa fa-home homeIcon"></i>
              </h1>
            </Link>
            <h1 className="Title">
              <b>Sutri Games</b>
            </h1>
          </div>
        </div>

        <div className="Green-Bar1">{this.state.code}</div>
        <div className="Container">
          <div className="Center1">
            <div className="Heading1">
              <b>ROOM CODE</b>
            </div>
            <div className="Sub-Heading1">
              <b>(This is what your friends enter)</b>
            </div>
            <div className="Spacer1" />
            <div className="Field-Heading1">
              <b>PLAYER ROOM</b>
            </div>
            <div className="Table">{table}</div>
            <label className="container">
              <br />
              <input
                className="Check"
                type="checkbox"
                checked={this.state.check}
                onChange={this.handleCheck}
              />
              <span className="checkmark"> </span>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;All Players Here
            </label>
            <br />
            <button className="Btn-Green1" onClick={this.handlePlay}>
              PLAY
            </button>
            {this.handlePopup()}
            <br />
            <br />
            <br />
            <br />
          </div>
        </div>
        <br />

        <div className="Footer1">
          <h1 className="FTitle">Copyright @ 2020 Sutri Technology LLC</h1>
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
  gameData: state.gameReducer.gameData,
});

const mapDispatchToProps = (dispatch) => ({
  getGameData: bindActionCreators(getGameData, dispatch),
  startToPlayGame: bindActionCreators(startToPlayGame, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Create_Room_Server);
