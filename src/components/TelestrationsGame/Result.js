import React, { Component } from "react";
import Notifications, { notify } from "react-notify-toast";
import { connect } from "react-redux";
import "./Result.css";

class TeleResult extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: "",
      name: "",
      captions: [],
    };
  }

  UNSAFE_componentWillMount() {
    let { captions } = this.props.teleData;

    if (captions) {
      captions = captions.sort((a, b) => {
        return a.round < b.round && a.createdBy < b.createdBy
          ? -1
          : a.round > b.round && a.createdBy > b.createdBy
          ? 1
          : 0;
      });
    }

    this.setState({ captions: this._handleSortResult(captions) });
  }

  _handleSortResult = (captions) => {
    let { players } = this.props.gameData;
    let sortedCaptions = [];
    let arr = [];

    if (captions) {
      for (let x = 0; x < players.length; x++) {
        arr.push([]);

        arr[x].push(captions[x]);

        let index = 0;

        for (let round = 2; round <= players.length; round++) {
          let filterdata = captions.filter((value) => {
            return (
              arr[x][index].guessBy === value.createdBy && value.round == round
            );
          });

          arr[x].push(filterdata[0]);
          index++;
        }
      }

      arr.forEach((element) => {
        sortedCaptions = [...sortedCaptions, ...element];
      });

      return sortedCaptions;
    }

    return [];
  };
  render() {
    const { captions } = this.state;
    const { gameData } = this.props;
    return (
      <div className="Home-bkg">
        <Notifications />
        <div className="HeaderNew">
          <h1 className="TitleNew">
            <b>Telestrations Results</b>
          </h1>
        </div>

        <div className="box-border">
          {captions?.map((value, index) => {
            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                {index % gameData?.players?.length === 0 && index > 0 ? (
                  <div
                    style={{
                      marginTop: 50,
                      marginBottom: 20,
                      width: "100%",
                      border: "4px solid #838383",
                    }}
                  />
                ) : null}
                {value.round === 1 ? (
                  <>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <h3 className="text1">{value?.createdBy}'s Prompt:</h3>
                    </div>
                    <div className="box2">
                      <h3 style={{ fontSize: 30 }}>{value?.prompt}</h3>
                    </div>
                  </>
                ) : null}

                <div style={{ display: "flex", justifyContent: "center" }}>
                  <h3 className="text1">{value?.submittedBy}'s drawing:</h3>
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <img className="img1" src={value?.drawingURL} alt="img" />
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <h3 style={{ fontSize: 30, marginTop: 15 }}>
                    {value?.guessBy}'s Answer:
                  </h3>
                </div>
                <div className="box2">
                  <h3 style={{ fontSize: 30 }}>{value?.caption}</h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userData: state.gameReducer.userData,
    isLoading: state.gameReducer.isLoading,
    errorMessage: state.gameReducer.errorMessage,
    isError: state.gameReducer.isError,
    teleData: state.gameReducer.teleData,
    gameData: state.gameReducer.gameData,
  };
};

// const mapDispatchToProps = (dispatch) => ({
//   submitCaption: bindActionCreators(submitCaption, dispatch),
// });

export default connect(mapStateToProps, null)(TeleResult);
