import React, { Component } from "react";
import { DragDropContainer, DropTarget } from "react-drag-drop-container";
import Die from "./Die";
import "./RollDice.css";
import firebase from "firebase/compat/app";
import Notifications, { notify } from "react-notify-toast";
import { Link } from "react-router-dom";
import Modal from "react-awesome-modal";
import { connect } from "react-redux";

let popup_trigger = false;

var num_of_dice = 6;
var old_dice = 0;
var total_dice = 0;

class RollDice extends Component {
  static defaultProps = {
    sides: ["one", "two", "three", "four", "five", "six"],
  };
  constructor(props) {
    super(props);

    this.state = {
      game: "",
      code: "",
      name: "",
      server: "",
      docId: "",
      players: [],
      noOfPlayers: 0,
      play: true,
      diceValues: [
        { id: 1, die: "one" },
        { id: 2, die: "one" },
        { id: 3, die: "one" },
        { id: 4, die: "one" },
        { id: 5, die: "one" },
        { id: 6, die: "one" },
      ],
      rolling: false,
      visibleDelete: false,
      visibleReset: false,
    };

    this.roll = this.roll.bind(this);
    this.delete = this.delete.bind(this);
    this.resetDice = this.resetDice.bind(this);
  }

  componentDidMount() {
    const { noOfPlayers } = this.props.gameData;
    const { name, docId } = this.props.userData;

    //initialize total_dice
    if (total_dice === 0) {
      total_dice = noOfPlayers * 6;
    }

    let roomCollection = firebase.firestore().collection("rooms");

    roomCollection.doc(docId).update({
      userDice: firebase.firestore.FieldValue.arrayUnion({
        dice: num_of_dice,
        user: name,
      }),
    });

    roomCollection.doc(docId).onSnapshot((snapShot) => {
      total_dice = snapShot.data().totalDice;
      this.setState({
        totalDice: snapShot.data().totalDice,
        noOfPlayers: snapShot.data().players.length,
        play: snapShot.data().play,
      });
    });

    if (!this.state.play) {
      this.setState({ play: true });
    }
    //console.log("Dice in mount global " + total_dice);
    //console.log("Dice in mount State " + this.state.totalDice);
  }

  componentDidUpdate() {
    const { docId } = this.props.gameData;
    //console.log("Dice in update global " + total_dice);
    //console.log("Dice in update State " + this.state.totalDice);
    if (!this.state.play && total_dice !== this.state.totalDice) {
      firebase
        .firestore()
        .collection("rooms")
        .doc(docId)
        .onSnapshot((snapShot) => {
          this.setState({
            totalDice: snapShot.data().totalDice,
            noOfPlayers: snapShot.data().players.length,
            play: snapShot.data().play,
          });
        });
    }
  }

  roll() {
    //pick 6 new rolls
    var newState = { diceValues: [], rolling: true };
    let i = 0;
    for (i = 0; i < num_of_dice; i++) {
      const newDice = this.props.sides[
        Math.floor(Math.random() * this.props.sides.length)
      ];
      newState.diceValues[i] = { id: i, die: newDice };
    }

    this.setState(newState);
    //wait one second, then set rolling to false
    setTimeout(() => {
      this.setState({ rolling: false });
    }, 2000);

    this.setState({ play: false });
  }

  handleDice() {
    const { name, docId } = this.props.userData;

    if (old_dice !== num_of_dice) {
      // update array information
      firebase
        .firestore()
        .collection("rooms")
        .doc(docId)
        .update({
          userDice: firebase.firestore.FieldValue.arrayUnion({
            dice: num_of_dice,
            user: name,
          }),
        });

      old_dice = num_of_dice + 1;

      // remove old array information
      firebase
        .firestore()
        .collection("rooms")
        .doc(docId)
        .update({
          userDice: firebase.firestore.FieldValue.arrayRemove({
            dice: old_dice,
            user: name,
          }),
        });

      // update play and total_dice
      firebase.firestore().collection("rooms").doc(docId).update({
        play: true,
        totalDice: total_dice,
      });

      firebase
        .firestore()
        .collection("rooms")
        .doc(docId)
        .onSnapshot(
          (snapShot) => {
            this.setState({
              totalDice: snapShot.data().totalDice,
            });
          },
          (error) => {
            alert("something happend");
          }
        );
    }
  }

  delete() {
    this.closeDeleteModal();

    if (this.state.play === false) {
      num_of_dice--;
      total_dice--;
      if (num_of_dice === 0) {
        this.loseScreen();
      }

      var array = [...this.state.diceValues]; // make a separate copy of the array

      var index = num_of_dice;
      if (index !== -1) {
        array.splice(index, 1);
        this.setState({ diceValues: array });
      }
      notify.show("Dice Deleted", "warning", 2000);
      this.handleDice();
      this.setState({ play: true });
    }
  }

  resetDice() {
    this.closeResetModal();
    const { noOfPlayers, docId } = this.props.gameData;
    //this.setState({ totalDice: noOfPlayers * 6 });

    // reset variables
    old_dice = 0;
    total_dice = 0;
    num_of_dice = 6;

    // initialize dice
    var newState = { diceValues: [], rolling: true };
    let i = 0;
    for (i = 0; i < num_of_dice; i++) {
      const newDice = this.props.sides[0];
      newState.diceValues[i] = { id: i, die: newDice };
    }
    this.setState(newState);
    this.setState({ totalDice: noOfPlayers * 6 });
    this.setState({ rolling: false });

    firebase
      .firestore()
      .collection("rooms")
      .doc(docId)
      .update({
        play: true,
        totalDice: noOfPlayers * 6,
      });
  }
  openDeleteModal = () => {
    this.setState({
      visibleDelete: true,
    });
  };

  closeDeleteModal() {
    this.setState({
      visibleDelete: false,
    });
  }
  openResetModal = () => {
    this.setState({
      visibleReset: true,
    });
  };

  closeResetModal() {
    this.setState({
      visibleReset: false,
    });
  }

  render() {
    const { play } = this.state;

    return (
      <div className="App">
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
            <div className="totalDice">
              {"Total dice in play: "}{" "}
              <span className="badge badge-secondary">
                {this.state.totalDice}
              </span>
            </div>
          </div>

          <div className="spacer"></div>

          <DropTarget
            targetKey="foo"
            onHit={this.openDeleteModal}
            onDragEnter={this.highlight}
            ref={this.myRef}
          >
            <div className="box">
              <i className="fa fa-trash trashIcon"></i>
            </div>
          </DropTarget>

          <div className="RollDice">
            <div className="RollDice-container">
              {this.state.diceValues.map((item) => (
                <DragDropContainer key={item.id} targetKey="foo">
                  <Die face={item.die} rolling={this.state.rolling} />
                </DragDropContainer>
              ))}
            </div>
            {play ? (
              <h3>READY!</h3>
            ) : (
                <h3>Waiting for someone to delete a Dice...</h3>
              )}

            <button
              className="rollButton"
              disabled={!this.state.play}
              onClick={this.roll}
            >
              {this.state.rolling ? "Rolling..." : "Roll Dice!"}
            </button>
            <button
              className="resetButton"
              onClick={() => this.openResetModal()}
            >
              Restart Game
            </button>
            <Modal
              visible={this.state.visibleDelete}
              width="400"
              height="200"
              effect="fadeInUp"
              onClickAway={() => this.closeModal()}
            >
              <div>
                <h1>Are you sure you want to delete?</h1>
                <button
                  className="no-button"
                  onClick={() => this.closeDeleteModal()}
                >
                  Cancel
                </button>
                <button className="yes-button" onClick={() => this.delete()}>
                  Yes
                </button>
              </div>
            </Modal>
            <Modal
              visible={this.state.visibleReset}
              width="400"
              height="200"
              effect="fadeInUp"
              onClickAway={() => this.closeResetModal()}
            >
              <div>
                <h1>Are you sure you want to reset the game?</h1>
                <button
                  className="no-button"
                  onClick={() => this.closeResetModal()}
                >
                  Cancel
                </button>
                <button className="yes-button" onClick={() => this.resetDice()}>
                  Yes
                </button>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  gameData: state.gameReducer.gameData,
  userData: state.gameReducer.userData,
});

export default connect(mapStateToProps, null)(RollDice);
