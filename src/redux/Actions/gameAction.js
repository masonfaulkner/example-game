import firebase from "../../firebase";
import * as types from "../types";
import { notify } from "react-notify-toast";

const db = firebase.firestore();

export const createNewRoom = (name, history) => async (dispatch) => {
  dispatch({
    type: types.START_LOADING,
    isError: false,
  });

  let code = await generateRoomCode();

  if (code) {
    db.collection("rooms")
      .add({
        code,
        createdBy: name,
        players: [name],
      })
      .then((doc) => {
        notify.show("Successfully Created", "success", 1000);
        dispatch({
          type: types.SET_USER_DATA_SUCCESS,
          payload: {
            isLoding: false,
            isError: false,
            errorMessage: null,
            userData: {
              code,
              name,
              play: false,
              server: true,
              docId: doc.id,
            },
          },
        });
        history.push({
          pathname: "/game_menu",
        });
      })
      .catch((error) => {
        notify.show("Error " + error.message, "error");
        dispatch({
          type: types.SET_USER_DATA_ERROR,
          payload: {
            isLoding: false,
            isError: true,
            errorMessage: error.message,
            userData: null,
          },
        });
      });
  }
};

export const joinGame = (data, history) => async (dispatch) => {
  dispatch({
    type: types.START_LOADING,
    payload: {
      isError: false,
    },
  });

  let { code, name } = data;
  let server = false;
  let players = [];
  let roomCollection = db.collection("rooms");

  roomCollection
    .where("code", "==", code)
    .get()
    .then((response) => {
      if (response.size) {
        response.forEach((doc) => {
          players = doc.data().players;

          if (players.includes(name)) {
            dispatch({
              type: types.SET_USER_DATA_SUCCESS,
              payload: {
                isLoding: false,
                isError: false,
                errorMessage: null,
                userData: {
                  code,
                  name,
                  server: doc.data().createdBy === name ? true : false,
                  docId: doc.id,
                },
                gameData: {
                  code,
                  docId: doc.id,
                  noOfPlayers: doc.data().players.length,
                  play: doc.data().play,
                  players: doc.data().players,
                  gameType: doc.data().gameType,
                },
              },
            });

            // if (name == doc.data().createdBy) {
            //   history.push({
            //     pathname: "/game_menu",
            //   });
            // } else {
            history.push({
              pathname: "/create_room_client",
            });
            // }
          } else {
            players.push(name);

            roomCollection
              .doc(doc.id)
              .update({
                players,
              })
              .then(() => {
                server = doc.data().createdBy === name;
                dispatch({
                  type: types.SET_USER_DATA_SUCCESS,
                  payload: {
                    isLoding: false,
                    isError: false,
                    errorMessage: null,
                    userData: { code, name, server, docId: doc.id },
                  },
                });
                history.push({
                  pathname: "/create_room_client",
                });
              })
              .catch((error) => {
                notify.show("Error " + error.message, "error");
                dispatch({
                  type: types.SET_USER_DATA_ERROR,
                  payload: {
                    isLoding: false,
                    isError: true,
                    errorMessage: error.message,
                    userData: null,
                  },
                });
              });
          }
        });
      } else {
        notify.show("Invalid Room Code", "error");
        dispatch({
          type: types.SET_USER_DATA_ERROR,
          payload: {
            isLoding: false,
            isError: true,
            userData: null,
          },
        });
      }
    })
    .catch((error) => {
      notify.show("Error " + error.message, "error");
      dispatch({
        type: types.SET_USER_DATA_ERROR,
        payload: {
          isLoding: false,
          isError: true,
          errorMessage: error.message,
          userData: null,
        },
      });
    });
};

export const navigateToWatingRoom = (data, history, pathname) => async (
  dispatch
) => {
  dispatch({
    type: types.SET_USER_DATA_SUCCESS,
    payload: {
      isLoding: false,
      isError: false,
      errorMessage: null,
      userData: {
        ...data,
      },
    },
  });

  history.push({
    pathname: pathname,
  });
};

export const setGamePlay = (docId) => async (dispatch) => {
  db.collection("rooms").doc(docId).update({ play: false });
};

const generateRoomCode = () => {
  let isCodeExist = true;
  let text = "";
  const possible = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
  let roomCodes = [];

  return new Promise((resolve, reject) => {
    db.collection("rooms")
      .get()
      .then((response) => {
        response.forEach((doc) => {
          roomCodes.push(doc.data().code);
        });

        while (isCodeExist) {
          for (var i = 0; i < 4; i++) {
            text += possible.charAt(
              Math.floor(Math.random() * possible.length)
            );
          }

          if (!roomCodes.includes(text)) {
            isCodeExist = false;
          }
        }

        if (!isCodeExist) {
          resolve(text);
        } else {
          reject(false);
        }
      })
      .catch(() => {
        reject(false);
      });
  });
};
