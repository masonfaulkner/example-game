import React, { Component } from "react";
import { Link } from "react-router-dom";
import Notifications, { notify } from "react-notify-toast";
import { bindActionCreators } from "redux";
import { joinGame } from "../redux/Actions/gameAction";
import { connect } from "react-redux";
import "./Home.css";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: "",
      name: "",
    };
  }

  changeHandler = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  submitHandler = (e) => {
    e.preventDefault();
    const { code, name } = this.state;

    if (this.validateInput(code, name)) {
      this.props.joinGame({ code, name }, this.props.history);
    }
  };

  validateInput = (code, name) => {
    let flag = true;
    let errorMessage = "";

    if (code.length !== 4) {
      flag = false;
      errorMessage = "Enter four letter code";
      notify.show(errorMessage, "error", 2000);
      return flag;
    }

    if (name?.trim().length === 0) {
      flag = false;
      errorMessage = "Enter your name";
      notify.show(errorMessage, "error", 2000);
      return flag;
    }

    return flag;
  };

  toInputUpperCase = (e) => {
    e.target.value = ("" + e.target.value).toUpperCase();
  };

  render() {
    return (
      <div className="Home-bkg">
        <Notifications />
        <div className="Header">
          <div className="home">
            <h1 className="homeIcon">
              <Link className="homeLink" to="/">
                <i className="fa fa-home homeIcon"></i>
              </Link>
            </h1>

            <h1 className="Title">
              <b>Sutri Games</b>
            </h1>
          </div>
        </div>

        <div className="Center">
          <h1>JOIN GAME</h1>
          <form onSubmit={this.submitHandler}>
            <div className="Field-Heading">ROOM CODE</div>
            <input
              className="Field"
              name="code"
              value={this.state.code}
              placeholder=" ENTER 4-LETTER CODE"
              maxLength="4"
              onInput={this.toInputUpperCase}
              onChange={this.changeHandler}
            />

            <div className="Field-Heading">PLAYER NAME</div>
            <input
              className="Field"
              value={this.state.name}
              name="name"
              placeholder=" ENTER YOUR NAME"
              maxLength="12"
              onChange={this.changeHandler}
            />

            <br />
            <button className="Btn-Green" type="submit">
              PLAY
            </button>
            <h2>OR</h2>

            <Link
              className="Link"
              to="/create_room"
              style={{ marginTop: "-100px" }}
            >
              Create Game
            </Link>
          </form>
        </div>

        <div className="Footer">
          <h3 className="FTitle">Copyright @ 2020 Sutri Technology LLC</h3>
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
});

const mapDispatchToProps = (dispatch) => ({
  joinGame: bindActionCreators(joinGame, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
