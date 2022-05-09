import React from "react";
import ReactCountdownClock from "react-countdown-clock";
import { bindActionCreators } from "redux";
import { startGameByClient } from "../../redux/Actions/clientAction";
import { connect } from "react-redux";
import "../Create_Room.css";

const Trivia_Start = (props) => {
  return (
    <div className="Home-bkg1">
      <div className="Header1">
        <h1 className="Title1">
          <b>Sutri Trivia</b>
        </h1>
      </div>

      <div className="Container">
        <div className="Center1">
          <h2>Welcome to Trivia!</h2>
          <div className="spacer"></div>
          <h3>
            There will be 20 questions. <br />
            The answers and scores will be displayed after each round.
            <br />
            After each round, people can challenge each other's answers.
          </h3>
          <br />
          <br />
          <div className="Timer">
            <ReactCountdownClock
              seconds={10}
              color="#666666"
              alpha={0.9}
              size={100}
              onComplete={() => props.history.push("/trivia_question")}
            />
          </div>
          {/* <button className="Btn-Green1">START</button> */}
          <br /> <br />
          <br />
          <br />
        </div>
        <div className="Footer1">
          <h1 className="FTitle">Copyright @ 2019 Sutri Technology LLC</h1>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  gameData: state.gameReducer.gameData,
});

const mapDispatchToProps = (dispatch) => ({
  startGameByClient: bindActionCreators(startGameByClient, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Trivia_Start);
