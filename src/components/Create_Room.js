import React, { Component } from "react";
import Notifications, { notify } from "react-notify-toast";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { createNewRoom } from "../redux/Actions/gameAction";
import { connect } from "react-redux";
import "./Home.css";

class CreateRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      isLoading: false,
    };
  }

  changeHandler = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  submitHandler = (e) => {
    e.preventDefault();
    const { name } = this.state;
    if (this.validateInput(name)) {
      this.props.createNewRoom(name, this.props.history);
    }
  };

  validateInput = (name) => {
    if (name.trim().length <= 0) {
      notify.show("Enter your Name", "error", 1000);
      return false;
    } else {
      return true;
    }
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.isLoading !== this.props.isLoading) {
      this.setState({
        isLoading: nextProps.isLoading,
      });
    }
  }

  render() {
    return (
      <div className="Home-bkg">
        <Notifications />
        <div className="Header">
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
        </div>
        <div className="Center">
          <form onSubmit={this.submitHandler}>
            <div className="Field-Heading">
              PLAYER NAME (Limit 12 Characters)
            </div>
            <input
              className="Field"
              value={this.state.name}
              name="name"
              placeholder=" ENTER YOUR NAME"
              maxLength="12"
              onChange={this.changeHandler}
            />
            <br />
            <button
              className="Btn-Green"
              type="submit"
              disabled={this.state.isLoading}
            >
              {this.state.isLoading ? (
                <CircularProgress color="white" />
              ) : (
                  "Create"
                )}
            </button>
          </form>
        </div>

        <div className="Footer">
          <h1 className="FTitle">Copyright @ 2020 Sutri Technology LLC</h1>
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
  createNewRoom: bindActionCreators(createNewRoom, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateRoom);
