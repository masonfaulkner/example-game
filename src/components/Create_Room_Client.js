import React, { Component } from "react";
import RulesEmpire from "./RulesEmpire";
import RulesDice from "./RulesDice";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { startGameByClient } from "../redux/Actions/clientAction";
import { connect } from "react-redux";
import RulesTrivia from "./RulesTrivia";
import "./Create_Room.css";

class Create_Room_Client extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gameType: "",
      code: "",
      name: "",
      server: "",
      docId: "",
      noOfPlayers: 0,
      players: [],
      check: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
  }

  componentDidMount() {
    const { code, name, docId } = this.props.userData;
    const { players } = this.props.gameData;
    this.setState({ code, name, docId, players }, () => {
      this.props.startGameByClient(this.props.history);
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.gameData) {
      this.setState({ ...nextProps.gameData });
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

  handlePopup(e) {
    const { gameType } = this.state;

    if (gameType === "Empire") {
      return <RulesEmpire />;
    } else if (gameType === "Liar's Dice") {
      return <RulesDice />;
    } else {
      if (gameType === "Sutri Trivia") {
        return <RulesTrivia />;
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { gameData } = nextProps;

    if (gameData.play && gameData.gameType === "Empire") {
      this.props.history.push({
        pathname: "/play_empire",
      });
    } else if (gameData.play && gameData.gameType === "Liar's Dice") {
      this.props.history.push({
        pathname: "/dice_game",
      });
    } else if (gameData.play && gameData.gameType === "Sutri Trivia") {
      this.props.history.push({
        pathname: "/trivia_start",
      });
    } else {
      if (gameData.play && gameData.gameType === "Telestrations") {
        this.props.history.push({
          pathname: "/play_tele",
        });
      }
    }
  }

  render() {
    const { players, play } = this.state;

    const table = players.map((player, i) => (
      <div className="Table-Entry" key={i}>
        <td>{i + 1} &nbsp; &nbsp; &nbsp; </td>
        <td>{player}</td>
      </div>
    ));

    return (
      <div className="Home-bkg1">
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
        {!play && <div className="Green-Bar1">{this.state.code}</div>}

        <div className="Container">
          <div className="Center1">
            <div>
              <div className="Heading1">
                <b>ROOM CODE</b>
              </div>
              <div className="Sub-Heading1">
                <b>(This is what your friends enter)</b>
              </div>
            </div>
            <div className="Spacer1" />
            <div>
              <div className="Field-Heading1">
                <b>PLAYER ROOM</b>
              </div>
              <div className="Table">{table}</div>
            </div>
            <label className="container">
              <br />
            </label>
            <br />
            <br />
            {this.handlePopup()}
            <br />
            <br />
            <br />
            <br />
          </div>
        </div>

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
  gameData: state.gameReducer.gameData,
  isError: state.gameReducer.isError,
});

const mapDispatchToProps = (dispatch) => ({
  startGameByClient: bindActionCreators(startGameByClient, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Create_Room_Client);
