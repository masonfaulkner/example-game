import React, { Component } from "react";
import Notifications, { notify } from "react-notify-toast";
import { bindActionCreators } from "redux";
import { submitPrompt } from "../../redux/Actions/teleActions";
import { connect } from "react-redux";
import "../Home.css";

class TelePrompt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prompt: "",
      isLoading: false,
      errorMessage: null,
      isError: false,
      teleData: null,
      userData: null,
      isSubmitted: false,
    };
  }

  UNSAFE_componentWillMount() {
    const { userData, teleData, gameData } = this.props;

    let round = Number(sessionStorage.getItem("round"));
    let prompts = teleData ?.prompts ?.filter(
      (value) => value ?.round.toString() === round ?.toString()
    );

    if (gameData.noOfPlayers === prompts ?.length) {
      this.props.history.push("/draw_tele");
    } else {
      const isSubmitted = prompts ?.some((value) => {
        return value.createdBy === userData.name;
      });

      // console.log("isSubmitted", isSubmitted);

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

    let round = Number(sessionStorage.getItem("round"));
    let prompts = teleData ?.prompts ?.filter((value) => value.round === round);

    if (gameData.noOfPlayers === prompts ?.length) {
      this.props.history.push("/draw_tele");
    } else {
      const isSubmitted = prompts ?.some((value) => {
        return value ?.createdBy === userData ?.name;
      });

      this.setState({
        isLoading,
        errorMessage,
        isError,
        teleData,
        userData,
        isSubmitted: !!isSubmitted,
      });
    }
  }

  changeHandler = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  submitHandler = (e) => {
    e.preventDefault();
    const { prompt } = this.state;
    if (this.validateInput(prompt)) {
      this.props.submitPrompt(prompt, this.props.history);
    }
  };

  validateInput = (name) => {
    if (name.trim().length <= 0) {
      notify.show(
        "Plase enter a prompt for the next person to draw",
        "warning",
        1000
      );
      return false;
    } else {
      return true;
    }
  };

  render() {
    return (
      <div className="Home-bkg">
        <Notifications />
        <div className="Header">
          <h1 style={{ color: "#FFF", fontSize: 50 }}>
            <b>Telestrations</b>
          </h1>
        </div>
        {this.state.isSubmitted ? (
          <div className="Center">
            <div className="Field-Heading">
              Waiting for other player to submit prompt!
            </div>
          </div>
        ) : (
            <div className="Center">
              <form onSubmit={this.submitHandler}>
                <div className="Field-Heading">
                  Enter a prompt for the next person to draw
              </div>
                <div>
                  <input
                    className="Field"
                    style={{ width: "60%" }}
                    value={this.state.prompt}
                    name="prompt"
                    placeholder="Enter a prompt"
                    onChange={this.changeHandler}
                  />
                  <button
                    className="Btn-Submit"
                    style={{ padding: "1px 15px" }}
                    type="submit"
                  // disabled={this.state.isLoading}
                  >
                    Submit
                </button>
                </div>
              </form>
            </div>
          )}

        <div className="Footer">
          <h1 className="FTitle">Copyright @ 2019 Sutri Technology LLC</h1>
        </div>
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
  submitPrompt: bindActionCreators(submitPrompt, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(TelePrompt);
