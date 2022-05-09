import firebase from "../../firebase";
import * as types from "../types";
import { notify } from "react-notify-toast";

const db = firebase.firestore();

export const startGameByClient = (history) => async (dispatch, getState) => {
  const { docId, code } = getState().gameReducer.userData;

  sessionStorage.setItem("round", 1);

  db.collection("rooms")
    .doc(docId)
    .onSnapshot(
      (snapShot) => {
        dispatch({
          type: types.GET_GAME_DATA_SUCCESS,
          payload: {
            isLoading: false,
            isError: false,
            errorMessage: null,
            gameData: {
              code,
              docId,
              noOfPlayers: snapShot.data().players.length,
              play: snapShot.data().play,
              players: snapShot.data().players,
              gameType: snapShot.data().gameType,
            },
            triviaData: {
              code,
              docId,
              noOfPlayers: snapShot.data().players.length,
              play: snapShot.data().play,
              players: snapShot.data().players,
              gameType: snapShot.data().gameType,
              selectedQuestions: snapShot.data().selectedQuestions,
              currentQuestion: snapShot.data().currentQuestion,
              keys: snapShot.data()?.keys ? snapShot.data().keys : null,
            },
            teleData: {
              ...snapShot.data(),
              docId: snapShot.id,
            },
          },
        });
      },
      (error) => {
        notify.show("Error" + error.message, "error");
      }
    );
};
