import firebase from "../../firebase";
import * as types from "../types";
import { notify } from "react-notify-toast";

const db = firebase.firestore();

export const submitAnswer = (answer, history) => async (dispatch, getState) => {
  let {
    docId,
    selectedQuestions,
    currentQuestion,
    keys,
  } = getState().gameReducer.triviaData;
  const { name } = getState().gameReducer.userData;

  localStorage.setItem("currentQuestion", currentQuestion);

  let isCorrect = selectedQuestions[keys[currentQuestion]]?.possibleAnswers
    .map((value) => value.toLowerCase())
    .includes(answer.toLowerCase());

  let key = `selectedQuestions.${[keys[currentQuestion]]}.playerAnswers`;

  db.collection("rooms")
    .doc(docId)
    .update({
      [key]: firebase.firestore.FieldValue.arrayUnion({
        submittedBy: name,
        answer,
        isCorrect,
      }),
      isReadyForNextQuestion: [],
    })
    .then((response) => {
      db.collection("rooms")
        .doc(docId)
        .onSnapshot(
          (snapshot) => {
            dispatch({
              type: types.SUBMIT_TRIVIA_ANSWER_SUCCESS,
              payload: {
                triviaData: {
                  docId: snapshot.id,
                  ...snapshot.data(),
                },
              },
            });
          },
          (error) => {
            notify.show("Error" + error.message, "error");
          }
        );
    })
    .catch((error) => {
      notify.show("Error" + error.message, "error");
    });
};

export const submitPlayerVote = (votes, history) => async (
  dispatch,
  getState
) => {
  let { docId, currentQuestion, keys } = getState().gameReducer.triviaData;
  const { name } = getState().gameReducer.userData;
  let isSubmitted = false;

  db.collection("rooms")
    .doc(docId)
    .onSnapshot(
      (snapshot) => {
        let data = snapshot.data();

        if (!isSubmitted) {
          isSubmitted = true;
          data.selectedQuestions[keys[currentQuestion]].playerVotes.push({
            submitedBy: name,
            votes,
          });

          db.collection("rooms")
            .doc(docId)
            .update({
              ...data,
            })
            .then(() => {})
            .catch((error) => {
              notify.show("Error" + error.message, "error");
            });
        } else {
          dispatch({
            type: types.SUBMIT_TRIVIA_VOTE_SUCCESS,
            payload: {
              triviaData: {
                ...data,
                docId: snapshot.id,
              },
            },
          });
          if (
            data.selectedQuestions[keys[currentQuestion]].playerVotes.length ===
            data.noOfPlayers
          ) {
            dispatch(
              calculatePlayerScore({ ...data, docId: snapshot.id }, history)
            );
          }
        }
      },
      (error) => {
        notify.show("Error" + error.message, "error");
      }
    );
};

export const calculatePlayerScore = (data, history) => async (dispatch) => {
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
    data.selectedQuestions[data.keys[data.currentQuestion]].playerVotes.forEach(
      (element) => {
        if (element.votes[index]) {
          ++trueCount;
        } else {
          ++falseCount;
        }
      }
    );

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

  playerScores = playerScores.sort((a, b) => sortArrOfObj(a.name, b.name));

  Object.keys(data?.selectedQuestions).map((value) => {
    if (data.selectedQuestions[value].playerAnswers.length) {
      let playerAnswers = data.selectedQuestions[value].playerAnswers;

      playerAnswers
        .sort((a, b) => sortArrOfObj(a.submittedBy, b.submittedBy))
        .map((data, index) => {
          playerScores[index].score += data.isCorrect ? 1 : 0;
        });
    }
  });
};

export const setGamePlay = (history) => async (dispatch, getState) => {
  let { userData } = getState().gameReducer;
  db.collection("rooms")
    .doc(userData.docId)
    .update({ play: false })
    .then(() => {
      if (userData.server) {
        history.replace("/create_room_server");
      } else {
        history.replace("/create_room_client");
      }
    })
    .catch(() => {});
};

export const getLatestData = () => async (dispatch, getState) => {
  let { userData } = getState().gameReducer;
  db.collection("rooms")
    .doc(userData.docId)
    .get()
    .then((response) => {
      dispatch({
        type: types.GET_DATA_BY_RELOAD,
        payload: {
          triviaData: {
            docId: response.id,
            ...response.data(),
          },
        },
      });
    })
    .catch(() => {});
};

export const readyForNextQuestion = (playerScores) => async (
  dispatch,
  getState
) => {
  let { docId } = getState().gameReducer.triviaData;
  let { name } = getState().gameReducer.userData;
  let currentQuestion = localStorage.getItem("currentQuestion");

  db.collection("rooms")
    .doc(docId)
    .update({
      isReadyForNextQuestion: firebase.firestore.FieldValue.arrayUnion({
        name,
        isReady: true,
      }),
      currentQuestion: Number(currentQuestion) + 1,
      playerScores: playerScores,
    })
    .then((response) => {
      db.collection("rooms")
        .doc(docId)
        .onSnapshot(
          (snapshot) => {
            dispatch({
              type: types.READY_FOR_NEXT_SUCCESS,
              payload: {
                triviaData: {
                  docId: snapshot.id,
                  ...snapshot.data(),
                  currentQuestion: Number(currentQuestion) + 1,
                },
              },
            });
          },
          (error) => {
            notify.show("Error" + error.message, "error");
          }
        );
    })
    .catch((error) => {
      notify.show("Error" + error.message, "error");
    });
};

const sortArrOfObj = (a, b) => {
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  } else {
    return 0;
  }
};
