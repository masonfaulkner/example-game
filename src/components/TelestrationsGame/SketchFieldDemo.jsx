import React from "react";
import { HuePicker } from "react-color";
import "flexboxgrid";
import "./main.css";
import "bootstrap/dist/css/bootstrap.css";
import AppBar from "@material-ui/core/AppBar";
import GridListTile from "@material-ui/core/GridListTile";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import color from "@material-ui/core/colors/blueGrey";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import UndoIcon from "@material-ui/icons/Undo";
import RedoIcon from "@material-ui/icons/Redo";
import DeleteIcon from "@material-ui/icons/Delete";
import SaveIcon from "@material-ui/icons/Save";
import ClearIcon from "@material-ui/icons/Clear";
// import AddIcon from "@material-ui/icons/Add";
//import CopyIcon from "@material-ui/icons/FileCopy";
//import RemoveIcon from "@material-ui/icons/Remove";
import DownloadIcon from "@material-ui/icons/CloudDownload";
//import dataJson from "./data.json";
//import dataJsonControlled from "./data.json.controlled";

import { SketchField, Tools } from "./tools";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Typography from "@material-ui/core/Typography/Typography";

//Redux Implementation
import { bindActionCreators } from "redux";
import { submitDrawing } from "../../redux/Actions/teleActions";
import { connect } from "react-redux";
import Notification from "react-notify-toast";

const styles = {
  root: {
    padding: "3px",
    display: "flex",
    flexWrap: "wrap",
    margin: "10px 10px 5px 10px",
    justifyContent: "space-around",
  },
  gridList: {
    width: "100%",
    overflowY: "auto",
    marginBottom: "24px",
  },
  gridTile: {
    backgroundColor: "#fcfcfc",
  },
  appBar: {
    backgroundColor: "#333",
  },
  radioButton: {
    marginTop: "3px",
    marginBottom: "3px",
  },
  separator: {
    height: "42px",
    backgroundColor: "white",
  },
  iconButton: {
    fill: "white",
    width: "42px",
    height: "42px",
  },
  dropArea: {
    width: "100%",
    height: "64px",
    border: "2px dashed rgb(102, 102, 102)",
    borderStyle: "dashed",
    borderRadius: "5px",
    textAlign: "center",
    paddingTop: "20px",
  },
  activeStyle: {
    borderStyle: "solid",
    backgroundColor: "#eee",
  },
  rejectStyle: {
    borderStyle: "solid",
    backgroundColor: "#ffdddd",
  },
  card: {
    margin: "10px 10px 5px 0",
  },
};

/**
 * Helper function to manually fire an event
 *
 * @param el the element
 * @param etype the event type
 */
function eventFire(el, etype) {
  if (el.fireEvent) {
    el.fireEvent("on" + etype);
  } else {
    var evObj = document.createEvent("Events");
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}

class SketchFieldDemo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lineWidth: 10,
      lineColor: "black",
      fillColor: "#68CCCA",
      backgroundColor: "transparent",
      shadowWidth: 0,
      shadowOffset: 0,
      tool: Tools.Pencil,
      enableRemoveSelected: false,
      fillWithColor: false,
      fillWithBackgroundColor: false,
      drawings: [],
      canUndo: false,
      canRedo: false,
      controlledSize: false,
      sketchWidth: 600,
      sketchHeight: 600,
      stretched: true,
      stretchedX: false,
      stretchedY: false,
      originX: "left",
      originY: "top",
      imageUrl: "https://files.gamebanana.com/img/ico/sprays/4ea2f4dad8d6f.png",
      expandTools: false,
      expandControls: false,
      expandColors: false,
      expandBack: false,
      expandImages: false,
      expandControlled: false,
      text: "a text, cool!",
      enableCopyPaste: false,
      isLoading: false,
      errorMessage: null,
      isError: false,
      teleData: null,
      userData: null,
      isSubmitted: false,
      promptToDraw: null,
    };
  }

  UNSAFE_componentWillMount() {
    const { userData, teleData, gameData } = this.props;

    let round = teleData ?.currentRound;
    let drawings = teleData ?.drawings ?.filter((value) => value.round === round);

    if (drawings ?.length === gameData ?.noOfPlayers) {
      this.props.history.push("/guess_tele");
    } else {
      let index = gameData ?.players.indexOf(userData.name) - 1;

      if (index === -1) {
        index = gameData ?.players ?.length - 1;
      }

      const isSubmitted = drawings ?.some((value) => {
        return value.submittedBy === userData.name;
      });

      const promptToDraw = teleData.prompts.filter((value) => {
        return (
          value.createdBy === gameData ?.players[index] &&
            value ?.round ?.toString() === round ?.toString()
        );
      });

      this.state.isSubmitted = !!isSubmitted;
      this.state.promptToDraw = promptToDraw[0];
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      isLoading,
      errorMessage,
      isError,
      teleData,
      userData,
      gameData,
    } = nextProps;

    let round = teleData ?.currentRound;
    let drawings = teleData ?.drawings ?.filter((value) => value.round == round);

    if (drawings ?.length === gameData ?.noOfPlayers) {
      this.props.history.push("/guess_tele");
    } else {
      let index = gameData ?.players.indexOf(userData.name) - 1;

      if (index === -1) {
        index = gameData ?.players ?.length - 1;
      }

      const isSubmitted = drawings ?.some((value) => {
        return value.submittedBy === userData.name;
      });

      const promptToDraw = teleData.prompts.filter((value) => {
        return (
          value.createdBy === gameData ?.players[index] &&
            value ?.round ?.toString() === round ?.toString()
        );
      });

      this.setState({
        isLoading,
        errorMessage,
        isError,
        teleData,
        userData,
        isSubmitted: !!isSubmitted,
        promptToDraw: promptToDraw[0],
      });
    }
  }

  _selectTool = (event) => {
    this.setState({
      tool: event.target.value,
      enableRemoveSelected: event.target.value === Tools.Select,
      enableCopyPaste: event.target.value === Tools.Select,
    });
  };

  _save = () => {
    let drawings = this.state.drawings;
    drawings.push(this._sketch.toDataURL());
    this.setState({ drawings: drawings });
  };

  _send = () => {
    this.props.submitDrawing(this.state.promptToDraw, this._sketch.toDataURL());
  };

  _download = () => {
    console.save(this._sketch.toDataURL(), "toDataURL.txt");
    console.save(JSON.stringify(this._sketch.toJSON()), "toDataJSON.txt");

    /*eslint-enable no-console*/

    let { imgDown } = this.refs;
    let event = new Event("click", {});

    imgDown.href = this._sketch.toDataURL();
    imgDown.download = "toPNG.png";
    imgDown.dispatchEvent(event);
  };

  _renderTile = (drawing, index) => {
    return (
      <GridListTile
        key={index}
        title="Canvas Image"
        actionPosition="left"
        titlePosition="top"
        titleBackground="linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
        cols={1}
        rows={1}
        style={styles.gridTile}
        actionIcon={
          <IconButton onTouchTap={(c) => this._removeMe(index)}>
            <ClearIcon color="white" />
          </IconButton>
        }
      >
        <img src={drawing} />
      </GridListTile>
    );
  };

  _removeMe = (index) => {
    let drawings = this.state.drawings;
    drawings.splice(index, 1);
    this.setState({ drawings: drawings });
  };

  _undo = () => {
    this._sketch.undo();
    this.setState({
      canUndo: this._sketch.canUndo(),
      canRedo: this._sketch.canRedo(),
    });
  };

  _redo = () => {
    this._sketch.redo();
    this.setState({
      canUndo: this._sketch.canUndo(),
      canRedo: this._sketch.canRedo(),
    });
  };

  _clear = () => {
    this._sketch.clear();
    this._sketch.setBackgroundFromDataUrl("");
    this.setState({
      controlledValue: null,
      backgroundColor: "transparent",
      fillWithBackgroundColor: false,
      canUndo: this._sketch.canUndo(),
      canRedo: this._sketch.canRedo(),
    });
  };

  _removeSelected = () => {
    this._sketch.removeSelected();
  };

  _onSketchChange = () => {
    let prev = this.state.canUndo;
    let now = this._sketch.canUndo();
    if (prev !== now) {
      this.setState({ canUndo: now });
    }
  };

  handleChange = (event) => {
    this._selectTool(event.target.value);
  };

  _onBackgroundImageDrop = (accepted /*, rejected*/) => {
    if (accepted && accepted.length > 0) {
      let sketch = this._sketch;
      let reader = new FileReader();
      let { stretched, stretchedX, stretchedY, originX, originY } = this.state;
      reader.addEventListener(
        "load",
        () =>
          sketch.setBackgroundFromDataUrl(reader.result, {
            stretched: stretched,
            stretchedX: stretchedX,
            stretchedY: stretchedY,
            originX: originX,
            originY: originY,
          }),
        false
      );
      reader.readAsDataURL(accepted[0]);
    }
  };

  _addText = () => this._sketch.addText(this.state.text);

  componentDidMount = () => {
    (function (console) {
      console.save = function (data, filename) {
        if (!data) {
          console.error("Console.save: No data");
          return;
        }
        if (!filename) filename = "console.json";
        if (typeof data === "object") {
          data = JSON.stringify(data, undefined, 4);
        }
        var blob = new Blob([data], { type: "text/json" }),
          e = document.createEvent("MouseEvents"),
          a = document.createElement("a");
        a.download = filename;
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
        e.initMouseEvent(
          "click",
          true,
          false,
          window,
          0,
          0,
          0,
          0,
          0,
          false,
          false,
          false,
          false,
          0,
          null
        );
        a.dispatchEvent(e);
      };
    })(console);
  };

  render = () => {
    let { controlledValue, promptToDraw, isSubmitted, isLoading } = this.state;

    // console.log("render draw", {
    //   promptToDraw,
    // });

    const theme = createMuiTheme({
      typography: {
        useNextVariants: true,
      },
      palette: {
        primary: { main: color[500] }, // Purple and green play nicely together.
        secondary: { main: "#11cb5f" }, // This is just green.A700 as hex.
      },
    });

    return (
      <MuiThemeProvider theme={theme}>
        <Notification />
        {/* <div className="Header">
          <h1 style={{ color: "#FFF", fontSize: 50 }}>
            <b>Telestrations</b>
          </h1>
        </div> */}
        {this.state.isSubmitted ? (
          <div className="Center">
            <div className="Field-Heading">
              Waiting for other player to submit their drawing!
            </div>
          </div>
        ) : (
            <div>
              <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <AppBar
                    title="Sketch Tool"
                    position="static"
                    style={styles.appBar}
                  >
                    <Toolbar>
                      <Typography
                        variant="h6"
                        color="inherit"
                        style={{ flexGrow: 1 }}
                      >
                        Telestrations
                    </Typography>
                      <IconButton
                        color="primary"
                        disabled={!this.state.canUndo}
                        onClick={this._undo}
                      >
                        <UndoIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        disabled={!this.state.canRedo}
                        onClick={this._redo}
                      >
                        <RedoIcon />
                      </IconButton>
                      <IconButton color="primary" onClick={this._save}>
                        <SaveIcon />
                      </IconButton>
                      <IconButton color="primary" onClick={this._download}>
                        <DownloadIcon />
                      </IconButton>
                      <IconButton color="primary" onClick={this._clear}>
                        <DeleteIcon />
                      </IconButton>
                    </Toolbar>
                  </AppBar>

                  <div className="row">
                    <div className="col-xs-11 col-sm-11 col-md-11 col-lg-11">
                      <SketchField
                        name="sketch"
                        className="canvas-area"
                        ref={(c) => (this._sketch = c)}
                        lineColor={this.state.lineColor}
                        lineWidth={this.state.lineWidth}
                        fillColor={
                          this.state.fillWithColor
                            ? this.state.fillColor
                            : "transparent"
                        }
                        backgroundColor={
                          this.state.fillWithBackgroundColor
                            ? this.state.backgroundColor
                            : "transparent"
                        }
                        width={
                          this.state.controlledSize
                            ? this.state.sketchWidth
                            : null
                        }
                        height={
                          this.state.controlledSize
                            ? this.state.sketchHeight
                            : null
                        }
                        value={controlledValue}
                        forceValue
                        onChange={this._onSketchChange}
                        tool={this.state.tool}
                      />
                    </div>
                    <div className="row">
                      <div
                        className="col-xs-1 last-xs"
                        style={{ marginLeft: "0.5em", marginTop: "0.5em" }}
                      >
                        <HuePicker
                          id="lineColor"
                          color={this.state.lineColor}
                          onChange={(color) =>
                            this.setState({ lineColor: color.hex })
                          }
                          direction="vertical"
                          width="16px"
                          height="300px"
                        />
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                      <br />
                      <div style={{ display: "flex" }}>
                        <div style={{ flex: 1 }}>
                          <h4>Draw a prompt below</h4>
                          <div className="box2">
                            <h3 style={{ fontSize: 30 }}>
                              {promptToDraw ?.prompt}
                            </h3>
                          </div>
                        </div>
                        <div style={{ flex: 2, paddingTop: 45 }}>
                          <FormControl variant="filled" style={{ minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-label">
                              Drawing Tools
                          </InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={this.state.tool}
                              onChange={this._selectTool}
                            >
                              <MenuItem value={Tools.Pencil} key="Pencil">
                                Pencil
                            </MenuItem>
                              <MenuItem value={Tools.Line} key="Line">
                                Line
                            </MenuItem>
                              <MenuItem value={Tools.Arrow} key="Arrow">
                                Arrow
                            </MenuItem>
                              <MenuItem value={Tools.Rectangle} key="Rectangle">
                                Rectangle
                            </MenuItem>
                              <MenuItem value={Tools.Circle} key="Circle">
                                Circle
                            </MenuItem>
                            </Select>
                          </FormControl>

                          <Button
                            variant="contained"
                            color="primary"
                            disabled={this.state.isLoading}
                            onClick={() => this._send()}
                          >
                            Send
                        </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
      </MuiThemeProvider>
    );
  };
}

const mapStateToProps = (state) => {
  // console.log("state", state);
  return {
    userData: state.gameReducer.userData,
    isLoading: state.gameReducer.isLoading,
    errorMessage: state.gameReducer.errorMessage,
    isError: state.gameReducer.isError,
    teleData: state.gameReducer.teleData,
    gameData: state.gameReducer.gameData,
  };
};

const mapDispatchToProps = (dispatch) => ({
  submitDrawing: bindActionCreators(submitDrawing, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SketchFieldDemo);
