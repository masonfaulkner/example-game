import React, { Component } from "react";
import Notifications, { notify } from "react-notify-toast";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import {
  submitCaption,
  updateGameRound,
} from "../../redux/Actions/teleActions";
import { connect } from "react-redux";
import "../Home.css";

class TeleGuess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      prompt: "",
      isLoading: false,
      errorMessage: null,
      isError: false,
      teleData: null,
      userData: null,
      isSubmitted: false,
      drawingToGuess: null,
      caption: "",
    };
  }

  UNSAFE_componentWillMount() {
    const { userData, teleData, gameData } = this.props;

    let round = teleData?.currentRound;
    let drawings = teleData?.drawings?.filter((value) => value.round == round);
    let captions = teleData?.captions?.filter((value) => value.round == round);

    if (
      teleData?.captions?.length ===
      gameData?.noOfPlayers * gameData?.noOfPlayers
    ) {
      this.props.history.push("/result_tele");
    } else if (captions?.length === gameData?.noOfPlayers) {
      this.props.updateGameRound(this.props.history);
    } else {
      let playerIndex = gameData?.players?.indexOf(userData.name) - 1;

      if (playerIndex === -1) {
        playerIndex = gameData?.players?.length - 1;
      }

      let drawingToGuess = drawings?.filter((value) => {
        return (
          value?.submittedBy === gameData?.players[playerIndex] &&
          value.round === round
        );
      });

      // console.log("draw to gess", {
      //   drawingToGuess: drawingToGuess[0],
      //   name: gameData?.players[playerIndex],
      // });

      const isSubmitted = captions?.some((value) => {
        return value?.guessBy === userData?.name;
      });

      this.state.drawingToGuess = drawingToGuess[0];
      this.state.isSubmitted = !!isSubmitted;
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      isLoading,
      errorMessage,
      isError,
      teleData,
      userData,
      gameData,
    } = nextProps;

    let round = teleData?.currentRound;
    let drawings = teleData?.drawings?.filter((value) => value.round === round);
    let captions = teleData?.captions?.filter((value) => value.round === round);

    if (
      teleData?.captions?.length ===
      gameData?.noOfPlayers * gameData?.noOfPlayers
    ) {
      this.props.history.push("/result_tele");
    } else if (captions?.length === gameData?.noOfPlayers) {
      this.props.updateGameRound(this.props.history);
    } else {
      let playerIndex = gameData?.players?.indexOf(userData.name) - 1;

      if (playerIndex === -1) {
        playerIndex = gameData?.players?.length - 1;
      }

      let drawingToGuess = drawings?.filter((value) => {
        return (
          value?.submittedBy === gameData?.players[playerIndex] &&
          value.round === round
        );
      });

      // console.log("draw to geshhhhhhhhhhhhhhhhhhhhhhhhhss", {
      //   drawingToGuess: drawingToGuess[0],
      //   name: gameData?.players[playerIndex],
      // });

      const isSubmitted = captions?.some((value) => {
        return value?.guessBy === userData?.name;
      });

      this.setState({
        isLoading,
        errorMessage,
        isError,
        teleData,
        userData,
        drawingToGuess: drawingToGuess[0],
        isSubmitted: !!isSubmitted,
      });
    }
  }

  changeHandler = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  submitHandler = (e) => {
    e.preventDefault();
    const { caption, drawingToGuess } = this.state;

    if (this.validateInput(caption)) {
      this.props.submitCaption(
        { ...drawingToGuess, caption },
        this.props.history
      );
    }
  };

  validateInput = (name) => {
    if (name.trim().length <= 0) {
      notify.show("Plase enter a caption", "warning", 1000);
      return false;
    } else {
      return true;
    }
  };

  render() {
    const { drawingToGuess, isSubmitted } = this.state;

    return (
      <div className="Home-bkg">
        <Notifications />
        <div className="Header">
          <h1 style={{ color: "#FFF", fontSize: 50 }}>
            <b>Telestrations</b>
          </h1>
        </div>
        <div className="Center">
          <form onSubmit={this.submitHandler}>
            <div style={{ marginTop: 250, backgroundColor: "#FFF" }}>
              <img src={drawingToGuess?.drawingURL} alt="construction" />
            </div>

            {isSubmitted ? (
              <div>
                <br />
                <div className="Field-Heading">Caption this drawing</div>
              </div>
            ) : (
              <div style={{ marginBottom: 20 }}>
                <div className="Field-Heading">Caption this drawing</div>
                <div>
                  <input
                    className="Field"
                    style={{ width: "60%" }}
                    value={this.state.caption}
                    name="caption"
                    placeholder="Enter a Caption"
                    onChange={this.changeHandler}
                  />
                  <button
                    className="Btn-Submit"
                    style={{ padding: "1px 15px" }}
                    type="submit"
                    disabled={this.state.isLoading}
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* <div className="Footer">
          <h1 className="FTitle">Copyright @ 2020 Sutri Technology LLC</h1>
        </div> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userData: state.gameReducer.userData,
    isLoading: state.gameReducer.isLoading,
    errorMessage: state.gameReducer.errorMessage,
    isError: state.gameReducer.isError,
    teleData: state.gameReducer.teleData,
    gameData: state.gameReducer.gameData,
  };
};

const mapDispatchToProps = (dispatch) => ({
  submitCaption: bindActionCreators(submitCaption, dispatch),
  updateGameRound: bindActionCreators(updateGameRound, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(TeleGuess);
