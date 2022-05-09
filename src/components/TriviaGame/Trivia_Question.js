import React, { Component } from "react";
import ReactCountdownClock from "react-countdown-clock";
import { bindActionCreators } from "redux";
import { submitAnswer, getLatestData } from "../../redux/Actions/triviaActions";
import { connect } from "react-redux";
import "../Create_Room.css";
import Notifications, { notify } from "react-notify-toast";

class Trivia_Question extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userData: null,
      gameData: null,
      triviaData: null,
      answer: "",
      completions: 0,
      isSubmit: false,
    };
  }

  UNSAFE_componentWillMount() {
    const { userData, gameData, triviaData } = this.props;
    let playerAnswers =
      triviaData?.selectedQuestions[
        triviaData?.keys[triviaData?.currentQuestion]
      ]?.playerAnswers;

    let isSubmit = false;
    let answer = "";

    if (playerAnswers) {
      playerAnswers = playerAnswers.filter((value) => {
        return value.submittedBy === userData.name;
      });

      if (playerAnswers.length) {
        isSubmit = true;
        answer = playerAnswers[0].answer;
      }
    }

    this.setState({
      userData,
      gameData,
      triviaData,
      isSubmit,
      answer,
    });
  }

  componentDidMount() {
    const { userData, gameData, triviaData } = this.props;
    this.setState({ userData, gameData, triviaData }, () => {
      this.props.getLatestData();
    });
  }

  handleSubmitAnswer = (e) => {
    e.preventDefault();
    const { answer } = this.state;
    if (answer.trim() !== "") {
      this.setState({ isSubmit: true }, () => {
        this.props.submitAnswer(answer, this.props.history);
      });
    } else {
      notify.show("Please something", "error");
    }
  };

  handleOnComplete = () => {
    this.setState({ isSubmit: true, answer: "Not Answer" }, () => {
      this.props.submitAnswer("Not Answer", this.props.history);
    });
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { userData, gameData, triviaData } = nextProps;

    let playerAnswers =
      triviaData?.selectedQuestions[
        triviaData?.keys[triviaData?.currentQuestion]
      ]?.playerAnswers;

    let isSubmit = false;
    let answer = "";

    if (playerAnswers) {
      playerAnswers = playerAnswers.filter((value) => {
        return value.submittedBy === userData.name;
      });

      if (playerAnswers.length) {
        isSubmit = true;
        answer = playerAnswers[0].answer;
      }
    }

    this.setState(
      {
        userData,
        gameData,
        triviaData,
        isSubmit,
        answer,
      },
      () => {
        if (
          triviaData?.selectedQuestions[
            triviaData?.keys[triviaData?.currentQuestion]
          ]?.playerAnswers?.length === triviaData?.noOfPlayers
        ) {
          this.props.history.replace({
            pathname: "/trivia_answer",
          });
        }
      }
    );
  }

  render() {
    const { triviaData } = this.state;

    return (
      <div className="Home-bkg1">
        <Notifications />
        <div className="Header1">
          <h1 className="Title1">
            <b>Sutri Trivia</b>
          </h1>
          <div
            className="totalDice"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <div style={{ marginLeft: "20px" }}>
              {"Category: "}
              <span className="badge badge-secondary">
                {triviaData?.selectedQuestions
                  ? triviaData.selectedQuestions[
                      triviaData.keys[triviaData.currentQuestion]
                    ]?.category
                  : null}
              </span>
            </div>
            <div style={{ marginRight: "20px" }}>
              {"Total players: "}
              <span className="badge badge-secondary">
                {triviaData?.noOfPlayers}
              </span>
            </div>
          </div>
        </div>

        <div className="Container">
          <div className="Center1">
            <div className="spacer"></div>
            <h1>Question # {triviaData?.currentQuestion + 1}</h1>
            <br />
            <br />
            <div className="question-box">
              <h3>
                {triviaData.selectedQuestions
                  ? triviaData?.selectedQuestions[
                      triviaData.keys[triviaData.currentQuestion]
                    ]?.question
                  : "loading..."}
              </h3>
            </div>
            {!this.state.isSubmit ? (
              <div>
                <h3>
                  <br />
                  You have{" "}
                  <div className="Timer">
                    <ReactCountdownClock
                      key={this.state.completions}
                      seconds={60}
                      color="#666666"
                      alpha={0.9}
                      size={100}
                      onComplete={this.handleOnComplete}
                    />
                  </div>
                  seconds to answer the question.
                </h3>

                <input
                  className="Field"
                  name="name"
                  placeholder="Answer Here"
                  maxLength="20"
                  onChange={(e) => this.setState({ answer: e.target.value })}
                />
                <button
                  className="Btn-Green1"
                  onClick={(e) => this.handleSubmitAnswer(e)}
                >
                  SUBMIT
                </button>
              </div>
            ) : (
              <>
                <br />
                <h1>Your submitted answer</h1>
                <div className="question-box">
                  <h3>{this.state.answer}</h3>
                </div>
                <br />
                <div>
                  <h3>Wait for other player to submit answer</h3>
                  {/* <p style={{ fontSize: 12, margin: 0, color: "green" }}>
                    Sometime due to too many resquet server does not get latest
                    data. To get latest data please press " get update" button
                  </p>
                  <button
                    style={{ fontSize: 15, width: 100, color: "green" }}
                    onClick={() => this.props.getLatestData()}
                  >
                    Get Update
                  </button> */}
                </div>
              </>
            )}
            <br />
            <br />
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

const mapStateToProps = (state) => ({
  isLoading: state.gameReducer.isLoading,
  errorMessage: state.gameReducer.errorMessage,
  userData: state.gameReducer.userData,
  gameData: state.gameReducer.gameData,
  triviaData: state.gameReducer.triviaData,
  isError: state.gameReducer.isError,
  questionData: state.gameReducer.questionData,
});

const mapDispatchToProps = (dispatch) => ({
  submitAnswer: bindActionCreators(submitAnswer, dispatch),
  getLatestData: bindActionCreators(getLatestData, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Trivia_Question);
