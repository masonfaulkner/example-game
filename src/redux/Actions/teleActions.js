import firebase from "../../firebase";
import * as types from "../types";
import { notify } from "react-notify-toast";

const db = firebase.firestore();

export const submitPrompt = (prompt, history) => (dispatch, getState) => {
  const { userData } = getState().gameReducer;

  let round = Number(sessionStorage.getItem("round"));

  if (!round) {
    round = 1;
    sessionStorage.setItem("round", round);
  }

  dispatch({
    type: types.START_LOADING,
    payload: {
      isLoading: true,
      isError: false,
      errorMessage: null,
    },
  });

  db.collection("rooms")
    .doc(userData.docId)
    .update({
      prompts: firebase.firestore.FieldValue.arrayUnion({
        createdBy: userData.name,
        prompt,
        round,
      }),
      currentRound: round,
    })
    .then((response) => {
      notify.show("Your prompt has been submitted successfully", "success");
      // db.collection("rooms")
      //   .doc(userData.docId)
      //   .onSnapshot((snapshot) => {
      //     dispatch({
      //       type: types.SUBMIT_PROMPT_SUCCESS,
      //       payload: {
      //         teleData: {
      //           ...snapshot.data(),
      //           docId: snapshot.id,
      //         },
      //         isLoading: false,
      //         isError: false,
      //         errorMessage: null,
      //       },
      //     });
      //   });
    })
    .catch((error) => {
      notify.show("Error" + error.message, "error");
      dispatch({
        type: types.SUBMIT_PROMPT_ERROR,
        payload: {
          isLoading: false,
          isError: true,
          errorMessage: error.message,
        },
      });
    });
};

export const submitDrawing = (data, drawing, history) => (
  dispatch,
  getState
) => {
  const { userData } = getState().gameReducer;

  dispatch({
    type: types.START_LOADING,
    payload: {
      isLoading: true,
      isError: false,
      errorMessage: null,
    },
  });

  uploadBase64Image(drawing)
    .then((url) => {
      db.collection("rooms")
        .doc(userData.docId)
        .update({
          drawings: firebase.firestore.FieldValue.arrayUnion({
            ...data,
            submittedBy: userData.name,
            drawingURL: url,
            caption: "",
          }),
        })
        .then((response) => {
          notify.show(
            "Your drawing has been submitted successfully",
            "success"
          );
          dispatch({
            type: types.SUBMIT_DRAWING_SUCCESS,
            payload: {
              isLoading: false,
              isError: false,
              errorMessage: null,
            },
          });
        })
        .catch((error) => {
          notify.show("Error " + error.message, "error");
          // console.log("errorafsadf", error);
          dispatch({
            type: types.SUBMIT_DRAWING_ERROR,
            payload: {
              isLoading: false,
              isError: true,
              errorMessage: error.message,
            },
          });
        });
    })
    .catch((error) => {
      notify.show("Error " + error.message, "error");
      dispatch({
        type: types.SUBMIT_DRAWING_ERROR,
        payload: {
          isLoading: false,
          isError: true,
          errorMessage: error.message,
        },
      });
    });
};

const uploadBase64Image = (image) => {
  return new Promise((resole, reject) => {
    let storageRef = firebase
      .storage()
      .ref()
      .child(`drawings/${Math.random().toString().substring(2)}`);

    storageRef
      .putString(image, "data_url")
      .then(() => {
        storageRef
          .getDownloadURL()
          .then((url) => {
            resole(url);
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const submitCaption = (data, history) => (dispatch, getState) => {
  const { userData } = getState().gameReducer;

  let round = Number(sessionStorage.getItem("round"));
  sessionStorage.setItem("round", round + 1);

  // console.log("submitCaption data", { ...data, guessBy: userData.name });

  dispatch({
    type: types.START_LOADING,
    payload: {
      isLoading: true,
      isError: false,
      errorMessage: null,
    },
  });

  db.collection("rooms")
    .doc(userData.docId)
    .update({
      captions: firebase.firestore.FieldValue.arrayUnion({
        ...data,
        guessBy: userData.name,
      }),
      prompts: firebase.firestore.FieldValue.arrayUnion({
        createdBy: userData.name,
        prompt: data.caption,
        round: round + 1,
      }),
    })
    .then((response) => {
      notify.show("Your prompt has been submitted successfully", "success");
      dispatch({
        type: types.SUBMIT_CAPTION_SUCCESS,
        payload: {
          isLoading: false,
          isError: false,
          errorMessage: null,
        },
      });
    })
    .catch((error) => {
      // console.log("error", error.message);
      // notify.show("Error" + error.message, "error");
      dispatch({
        type: types.SUBMIT_CAPTION_ERROR,
        payload: {
          isLoading: false,
          isError: true,
          errorMessage: error.message,
        },
      });
    });
};

export const updateGameRound = (history) => (dispatch, getState) => {
  const { userData } = getState().gameReducer;

  let round = Number(sessionStorage.getItem("round"));

  db.collection("rooms")
    .doc(userData.docId)
    .update({
      currentRound: round,
    })
    .then((response) => {
      history.push("/draw_tele");
    })
    .catch((error) => {});
};
