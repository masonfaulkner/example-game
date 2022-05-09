import React, { Component } from "react";
import { bindActionCreators } from "redux";
import {
  submitPlayerVote,
  getLatestData,
} from "../../redux/Actions/triviaActions";
import { connect } from "react-redux";
import Notifications from "react-notify-toast";
import Button from "@material-ui/core/Button";
import "../Create_Room.css";

class Trivia_Answer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      triviaData: null,
      userData: null,
      playerAnswers: null,
      isSubmitted: false,
    };
  }

  UNSAFE_componentWillMount() {
    const { triviaData, userData } = this.props;
    let playerAnswers =
      triviaData?.selectedQuestions[
        triviaData?.keys[triviaData?.currentQuestion]
      ]?.playerAnswers;
    let playerVotes =
      triviaData?.selectedQuestions[
        triviaData?.keys[triviaData?.currentQuestion]
      ]?.playerVotes;
    let isSubmitted = false;

    if (playerVotes) {
      playerVotes = playerVotes.filter((value) => {
        return value.submitedBy === userData.name;
      });

      if (playerVotes.length) {
        playerAnswers = playerAnswers.map((value, index) => ({
          ...value,
          vote: playerVotes[0].votes[index],
        }));
        isSubmitted = true;
      } else {
        playerAnswers = playerAnswers.map((value) => ({
          ...value,
          vote: value.isCorrect ? value.isCorrect : undefined,
        }));
      }
    }

    this.setState({
      triviaData,
      userData,
      playerAnswers,
      isSubmitted,
    });

    setTimeout(() => {
      this.handleSetTimeOut();
    }, 20000);
  }

  handleOnClick = (index, vote) => {
    let { playerAnswers } = this.state;
    playerAnswers[index].vote = vote;
    this.setState({ playerAnswers });
  };

  handleOnSubmit = () => {
    let { playerAnswers } = this.state;

    let votes = playerAnswers
      .filter((value) => value.vote !== undefined)
      .map((value) => value.vote);

    if (votes.length === playerAnswers.length) {
      this.setState({ isSubmitted: true }, () => {
        this.props.submitPlayerVote(votes, this.props.history);
      });
    } else {
      alert("Please vote  all answer");
    }
  };

  handleSetTimeOut = () => {
    let { playerAnswers, isSubmitted } = this.state;

    let votes = [];

    playerAnswers = playerAnswers.map((value) => {
      votes.push(value.vote === undefined ? false : value.vote);
      return {
        ...value,
        vote: value.vote === undefined ? false : value.vote,
      };
    });

    if (!isSubmitted) {
      this.setState({ isSubmitted: true, playerAnswers }, () => {
        this.props.submitPlayerVote(votes, this.props.history);
      });
    }
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { triviaData } = nextProps;

    if (
      triviaData?.selectedQuestions[
        triviaData?.keys[triviaData.currentQuestion]
      ]?.playerVotes.length === triviaData.noOfPlayers
    ) {
      this.props.history.replace("/trivia_answer2");
    }
  }

  render() {
    const { triviaData, playerAnswers, isSubmitted } = this.state;

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
              <thead>
                <tr className="Table-Entry">
                  <th className="Table-Name">
                    <h1>Answer</h1>
                  </th>
                  <th className="Table-Answer">
                    <h1>Accept</h1>
                  </th>
                  <th className="Table-Challenge">
                    <h1>Deny</h1>
                  </th>
                </tr>
              </thead>
              <tbody>
                {playerAnswers?.map((value, index) => {
                  return !value.isCorrect ? (
                    <tr key={index} className="Table-Entry">
                      <td>
                        <h1>{value.answer}</h1>
                      </td>
                      {value?.vote === undefined ? (
                        <>
                          <td>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => this.handleOnClick(index, true)}
                            >
                              Accept
                            </Button>
                          </td>
                          <td>
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={() => this.handleOnClick(index, false)}
                            >
                              Deny
                            </Button>
                          </td>
                        </>
                      ) : value.vote ? (
                        <>
                          <td>
                            <h1>Accepted</h1>
                          </td>
                          <td></td>
                        </>
                      ) : (
                        <>
                          <td></td>
                          <td>
                            <h1>Reject</h1>
                          </td>
                        </>
                      )}
                    </tr>
                  ) : (
                    <tr key={index}>
                      <td>
                        <h1>{value.answer}</h1>
                      </td>
                      <td>
                        <h1>Correct Answer</h1>
                      </td>
                      <td></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <br />

            {isSubmitted ? (
              <div>
                <h3>Waiting for other player response</h3>
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
            ) : (
              <button
                className="Btn-Green1"
                onClick={() => this.handleOnSubmit()}
              >
                SUBMIT
              </button>
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
  getLatestData: bindActionCreators(getLatestData, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Trivia_Answer);
