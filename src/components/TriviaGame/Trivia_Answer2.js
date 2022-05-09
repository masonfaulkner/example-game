import React, { Component } from "react";
import Notifications from "react-notify-toast";
import { bindActionCreators } from "redux";
import {
  submitPlayerVote,
  setGamePlay,
  readyForNextQuestion,
} from "../../redux/Actions/triviaActions";
import { connect } from "react-redux";
import "../Create_Room.css";

class Trivia_Answer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      triviaData: null,
      userData: null,
      playerAnswers: null,
      isGameEnd: false,
      isSubmit: false,
    };
  }

  componentDidMount() {
    let { triviaData, userData } = this.props;

    let currentQuestion = Number(localStorage.getItem("currentQuestion"));

    triviaData.currentQuestion = currentQuestion;

    triviaData = this.calculatePlayerScore(triviaData);

    this.setState({
      triviaData: {
        ...triviaData,
        currentQuestion: currentQuestion,
      },
      isGameEnd: currentQuestion === triviaData.keys.length - 1,
      userData,
      playerAnswers:
        triviaData.selectedQuestions[triviaData.keys[currentQuestion]]
          ?.playerAnswers,
    });

    if (
      triviaData?.isReadyForNextQuestion?.length === triviaData?.noOfPlayers
    ) {
      this.props.history.replace("/trivia_question");
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let { triviaData, userData } = nextProps;

    let currentQuestion = Number(localStorage.getItem("currentQuestion"));

    triviaData.currentQuestion = currentQuestion;

    triviaData = this.calculatePlayerScore(triviaData);

    this.setState({
      triviaData: {
        ...triviaData,
        currentQuestion: currentQuestion,
      },
      isGameEnd: currentQuestion === triviaData.keys.length,
      userData,
      playerAnswers:
        triviaData.selectedQuestions[triviaData.keys[currentQuestion]]
          ?.playerAnswers,
    });

    if (
      triviaData?.isReadyForNextQuestion?.length === triviaData?.noOfPlayers
    ) {
      this.props.history.replace("/trivia_question");
    }
  }

  handleNextQuestion = (e) => {
    e.preventDefault();

    if (!this.state.isSubmit) {
      this.setState({ isSubmit: true }, () => {
        this.props.readyForNextQuestion(this.state.triviaData.playerScores);
      });
    }
  };

  calculatePlayerScore = (data) => {
    let trueCount = 0;
    let falseCount = 0;
    let playerScores = data.players.map((value) => ({
      name: value,
      score: 0,
    }));

    data.selectedQuestions[
      data.keys[data.currentQuestion]
    ].playerAnswers = data.selectedQuestions[
      data.keys[data.currentQuestion]
    ].playerAnswers.map((value, index) => {
      trueCount = falseCount = 0;
      data.selectedQuestions[
        data.keys[data.currentQuestion]
      ].playerVotes.forEach((element) => {
        if (element.votes[index]) {
          ++trueCount;
        } else {
          ++falseCount;
        }
      });

      if (
        trueCount > falseCount ||
        (trueCount === falseCount && value.isCorrect)
      ) {
        return {
          ...value,
          isCorrect: true,
        };
      } else {
        return {
          ...value,
          isCorrect: false,
        };
      }
    });

    playerScores = playerScores.sort((a, b) =>
      this.sortArrOfObj(a.name, b.name)
    );

    Object.keys(data?.selectedQuestions).map((value) => {
      if (data.selectedQuestions[value].playerAnswers.length) {
        let playerAnswers = data.selectedQuestions[value].playerAnswers;

        playerAnswers
          .sort((a, b) => this.sortArrOfObj(a.submittedBy, b.submittedBy))
          .map((data, index) => {
            playerScores[index].score += data.isCorrect ? 1 : 0;
          });
      }
    });

    data.playerScores = playerScores;

    return data;
  };

  sortArrOfObj = (a, b) => {
    if (a > b) {
      return 1;
    }
    if (a < b) {
      return -1;
    } else {
      return 0;
    }
  };

  render() {
    const { triviaData, playerAnswers, isGameEnd, isSubmit } = this.state;

    let highScore =
      triviaData?.playerScores &&
      Math.max(...triviaData?.playerScores?.map((value) => value.score));
    let winner = triviaData?.playerScores?.filter(
      (val) => val.score === highScore
    );

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
            {isGameEnd && winner ? (
              winner.length === triviaData?.playerScores?.length ? (
                <h1>All player get equal score</h1>
              ) : (
                <h1>
                  Congrate {winner.map((value) => value.name).join(", ")} win
                  match
                </h1>
              )
            ) : null}
            <br />
            <h1>Question #{triviaData?.currentQuestion + 1}</h1>
            <br />
            <div className="question-box">
              <h3>
                {triviaData?.selectedQuestions
                  ? triviaData.selectedQuestions[
                      triviaData.keys[triviaData.currentQuestion]
                    ]?.question
                  : "loading..."}
              </h3>
            </div>

            <br />
            <h1>Answer to Question #{triviaData?.currentQuestion + 1}:</h1>
            <div className="question-box">
              <h3>
                {triviaData?.selectedQuestions
                  ? triviaData.selectedQuestions[
                      triviaData.keys[triviaData.currentQuestion]
                    ]?.possibleAnswers[0]
                  : "loading..."}
              </h3>
            </div>
            <br />
            <h1>Submissions</h1>
            <table className="Table">
              <thead className="Table-Entry">
                <tr>
                  <th className="player">
                    <h1>Player</h1>
                  </th>
                  <th className="answer">
                    <h1>Submitted Answer</h1>
                  </th>
                  <th className="score">
                    <h1>Score</h1>
                  </th>
                </tr>
              </thead>
              <tbody className="Table-Entry">
                {playerAnswers?.map((value, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <h1>{value.submittedBy}</h1>
                      </td>
                      <td>
                        <h1>
                          {value.answer} &nbsp;
                          {value.isCorrect ? (
                            <i
                              className="fa fa-check-square"
                              style={{ float: "right", color: "green" }}
                            ></i>
                          ) : (
                            <i
                              className="fa fa-times"
                              aria-hidden="true"
                              style={{ float: "right", color: "red" }}
                            ></i>
                          )}
                        </h1>
                      </td>
                      <td>
                        <h1>
                          <span className="badge badge-secondary">
                            {triviaData?.playerScores?.length
                              ? triviaData?.playerScores[index]?.score
                              : 0}
                          </span>
                        </h1>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/* </h3> */}
            {!isGameEnd ? (
              isSubmit ? (
                <div>
                  <h3>waiting for other player to ready for next question</h3>
                </div>
              ) : (
                <button
                  className="Btn-Green1"
                  onClick={(e) => this.handleNextQuestion(e)}
                >
                  Next
                </button>
              )
            ) : (
              <div>
                <button
                  className="Btn-Green1"
                  onClick={() => {
                    this.props.setGamePlay(this.props.history);
                  }}
                >
                  Play Again
                </button>
                <h1>OR</h1>
                <button
                  className="Btn-Green1"
                  onClick={() => this.props.history.push("/")}
                >
                  Home
                </button>
              </div>
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
  triviaData: state.gameReducer.triviaData,
  userData: state.gameReducer.userData,
});

const mapDispatchToProps = (dispatch) => ({
  submitPlayerVote: bindActionCreators(submitPlayerVote, dispatch),
  setGamePlay: bindActionCreators(setGamePlay, dispatch),
  readyForNextQuestion: bindActionCreators(readyForNextQuestion, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Trivia_Answer);
