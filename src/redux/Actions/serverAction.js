import firebase from "../../firebase";
import * as types from "../types";
import { notify } from "react-notify-toast";

const db = firebase.firestore();

export const getGameData = (gameType) => async (dispatch, getState) => {
  let userData = getState().gameReducer.userData;

  let roomCollection = firebase.firestore().collection("rooms");
  roomCollection.doc(userData.docId).onSnapshot(
    (snapShot) => {
      dispatch({
        type: types.GET_GAME_DATA_SUCCESS,
        payload: {
          isLoading: false,
          isError: false,
          errorMessage: null,
          gameData: {
            docId: userData.docId,
            code: userData.code,
            players: snapShot.data().players,
            noOfPlayers: snapShot.data().players.length,
            gameType: gameType,
          },
          teleData: {
            ...snapShot.data(),
            docId: snapShot.id,
          },
        },
      });
    },
    (error) => {
      dispatch({
        type: types.GET_GAME_DATA_ERROR,
        payload: {
          isLoading: false,
          isError: false,
          errorMessage: null,
          gameData: {
            docId: userData.docId,
            players: [],
            noOfPlayers: 0,
          },
        },
      });
    }
  );
  roomCollection.doc(userData.docId).update({ gameType: gameType });
};

export const startToPlayGame = (history) => async (dispatch, getState) => {
  const { docId, code, gameType } = getState().gameReducer.userData;
  const { noOfPlayers, players } = getState().gameReducer.gameData;

  const first = players[Math.floor(Math.random() * players.length)];

  if (gameType === "Empire") {
    db.collection("rooms")
      .doc(docId)
      .update({
        gameType: "Empire",
        play: true,
        first: first,
        famousPersons: [],
      })
      .then(() => {
        dispatch({
          type: types.GET_GAME_DATA_SUCCESS,
          payload: {
            isLoading: false,
            isError: false,
            errorMessage: null,
            gameData: {
              code,
              docId,
              first,
              noOfPlayers,
              players,
              gameType: "Empire",
            },
          },
        });
        history.push({
          pathname: "/play_empire",
        });
      })
      .catch((error) => {});
  } else if (gameType === "Liar's Dice") {
    db.collection("rooms")
      .doc(docId)
      .update({
        gameType: "Liar's Dice",
        play: true,
        first: first,
        totalDice: players.length * 6,
      })
      .then(() => {
        dispatch({
          type: types.GET_GAME_DATA_SUCCESS,
          payload: {
            isLoading: false,
            isError: false,
            errorMessage: null,
            gameData: {
              docId,
              players,
              code,
              first,
              noOfPlayers,
              gameType: "Liar's Dice",
              totalDice: players.length * 6,
            },
          },
        });
        history.push({
          pathname: "/dice_game",
        });
      })
      .catch((error) => {});
  } else if (gameType === "Sutri Trivia") {
    let questions = {};
    let randomQuestion = {};
    let noOfQuestions = 0;
    let keys = [];
    let randomKey = [];
    db.collection("questions")
      .get()
      .then((response) => {
        if (response.size) {
          response.forEach((doc) => {
            questions[doc.id] = {
              ...doc.data(),
              playerAnswers: [],
              playerVotes: [],
            };
          });

          const first = players[Math.floor(Math.random() * players.length)];
          noOfQuestions = response.size > 20 ? 20 : response.size;
          keys = Object.keys(questions);

          for (let index = 0; index < noOfQuestions; index++) {
            let selectedIndex = Math.floor(Math.random() * keys.length);
            randomQuestion[keys[selectedIndex]] =
              questions[keys[selectedIndex]];
            randomKey.push(keys[selectedIndex]);
            keys.splice(selectedIndex, 1);
          }

          db.collection("rooms")
            .doc(docId)
            .update({
              gameType: "Sutri Trivia",
              play: true,
              first: first,
              selectedQuestions: randomQuestion,
              currentQuestion: 0,
              noOfPlayers: players.length,
              keys: randomKey,
              playerScores: [],
            })
            .then(() => {
              dispatch({
                type: types.GET_GAME_DATA_SUCCESS,
                payload: {
                  isLoading: false,
                  isError: false,
                  errorMessage: null,
                  gameData: {
                    docId,
                    players,
                    code,
                    first,
                    play: true,
                    noOfPlayers,
                    gameType: "Sutri Trivia",
                  },
                  triviaData: {
                    docId,
                    players,
                    code,
                    first,
                    noOfPlayers,
                    gameType: "Sutri Trivia",
                    selectedQuestions: randomQuestion,
                    currentQuestion: 0,
                    keys: randomKey,
                  },
                },
              });
              history.push({
                pathname: "/trivia_start",
              });
            })
            .catch((error) => {
              notify.show("Error" + error.message, "error");
            });
        } else {
          notify.show(
            "Sorry! No quesions is availiable. Contact to our service provider",
            "error"
          );
        }
      })
      .catch((error) => {
        notify.show("Error" + error.message, "error");
      });
  } else {
    if (gameType === "Telestrations") {
      db.collection("rooms")
        .doc(docId)
        .update({
          gameType: "Telestrations",
          play: true,
          prompts: [],
          drawings: [],
          captions: [],
          currentRound: 1,
        })
        .then(() => {
          sessionStorage.setItem("round", 1);
          dispatch({
            type: types.GET_GAME_DATA_SUCCESS,
            payload: {
              isLoading: false,
              isError: false,
              errorMessage: null,
              gameData: {
                code,
                docId,
                noOfPlayers,
                players,
                gameType: "Telestrations",
                prompts: [],
                drawings: [],
                captions: [],
                currentRound: 1,
              },
              teleData: null,
            },
          });
          history.push({
            pathname: "/play_tele",
          });
        })
        .catch((error) => {});
    }
  }
};
