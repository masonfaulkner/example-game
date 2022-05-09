import React, { Component } from "react";
import "../Create_Room.css";
import firebase from "firebase/compat/app";
import Notifications, { notify } from "react-notify-toast";
import { bindActionCreators } from "redux";

import { connect } from "react-redux";
import { getGameData, startToPlayGame } from "../../redux/Actions/serverAction";

class PlayEmpire extends Component {
  constructor() {
    super();
    this.state = {
      personName: "",
      docId: null,
      isSubmitted: false,
    };
  }

  componentDidMount() {
    const { name } = this.props.userData;
    const { docId, first } = this.props.gameData;

    this.setState({ first, docId, name }, () => {
      firebase
        .firestore()
        .collection("rooms")
        .doc(docId)
        .onSnapshot(
          (response) => {
            if (
              response.data().famousPersons.length ===
              response.data().players.length
            ) {
              this.props.history.push({
                pathname: "/character_list",
                state: {
                  first,
                  docId,
                  name,
                },
              });
            }
          },
          (error) => {
            alert("Error! " + error.message);
          }
        );
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const { name, personName, docId } = this.state;

    // console.log({ name, personName, docId });

    if (this.validateInput(personName)) {
      firebase
        .firestore()
        .collection("rooms")
        .doc(docId)
        .update({
          famousPersons: firebase.firestore.FieldValue.arrayUnion({
            submittedBy: name,
            personName,
          }),
        })
        .then(() => {
          this.setState({ isSubmitted: true });
        })
        .catch((error) => {
          alert("Error! " + error.message);
        });
    }
  };

  validateInput = (text) => {
    if (text.trim().length <= 0) {
      notify.show("Please Enter a Name", "error", 2000);
      return false;
    } else {
      notify.show("Successfully submitted", "success", 2000);
      return true;
    }
  };

  render() {
    const { isSubmitted } = this.state;
    return (
      <div className="Home-bkg1">
        <Notifications />
        <div className="Header1">
          <h1 className="Title1">
            <b>Empire</b>
          </h1>
        </div>
        <div className="Container">
          <div className="Center1">
            <div className="Spacer1" />
            {!isSubmitted ? (
              <form onSubmit={this.handleSubmit}>
                <div className="Field-Heading1">
                  Choose a Famous Person (fiction or Non-fiction)
                </div>{" "}
                <input
                  className="Field1"
                  value={this.state.personName}
                  placeholder=" ENTER NAME"
                  maxLength="16"
                  onChange={(event) =>
                    this.setState({ personName: event.target.value })
                  }
                />
                <button type="submit" className="Btn-Submit1 Btn-Green1">
                  Submit
                </button>
              </form>
            ) : (
              <div>
                <br />
                <div className="Field-Heading1">
                  Waiting on others to pick character...
                </div>
                <br />
                <button className="Btn-Green1">RULES</button>
                <br />
                <br />
              </div>
            )}
          </div>
        </div>

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
  gameData: state.gameReducer.gameData,
});

const mapDispatchToProps = (dispatch) => ({
  getGameData: bindActionCreators(getGameData, dispatch),
  startToPlayGame: bindActionCreators(startToPlayGame, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayEmpire);
