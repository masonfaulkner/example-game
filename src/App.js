import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
//Common Components
import Home from "./components/Home";
import Create_Room from "./components/Create_Room";
import Create_Room_Server from "./components/Create_Room_Server";
import Create_Room_Client from "./components/Create_Room_Client";
import Game_Menu from "./components/Game_Menu";
import Construction from "./components/Construction";

// Dice_Game
import Dice_Game from "./components/DiceGame/Dice_Game";

// PlayEmpire
import PlayEmpire from "./components/EmpireGame/PlayEmpire";
import Character_List from "./components/EmpireGame/Character_List";
import Player_List from "./components/EmpireGame/Player_List";

//Tele_Game
import Tele from "./components/TelestrationsGame/tele";
import TelePrompt from "./components/TelestrationsGame/TelePrompt";
import TeleGuess from "./components/TelestrationsGame/TeleGuess";
import TeleResult from "./components/TelestrationsGame/Result";

// import WhiteBoard from "./components/TelestrationsGame/whiteboard";

//Trivia Game
import Trivia_Start from "./components/TriviaGame/Trivia_Start";
import Trivia_Question from "./components/TriviaGame/Trivia_Question";
import Trivia_Answer from "./components/TriviaGame/Trivia_Answer";
import Trivia_Answer2 from "./components/TriviaGame/Trivia_Answer2";

// Redux Implementation
import { Provider } from "react-redux";
import { store, persistor } from "./redux/Store";
import { PersistGate } from "redux-persist/integration/react";
import "./App.css";

class App extends React.Component {
  showConfirm = () => {
    // console.log("Leave page");
  };
  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <BrowserRouter>
            <div className="app">
              <Route
                exact
                path="/"
                component={Home}
                onEnter={this.showConfirm}
                onLeave={this.showConfirm}
              />
              <Route exact path="/create_room" component={Create_Room} />
              <Route
                exact
                path="/create_room_server"
                component={Create_Room_Server}
              />
              <Route
                exact
                path="/create_room_client"
                component={Create_Room_Client}
              />
              <Route
                exact
                path="/game_menu"
                component={Game_Menu}
                onEnter={this.showConfirm}
                onLeave={this.showConfirm}
              />
              <Route exact path="/dice_game" component={Dice_Game} />

              <Route exact path="/play_empire" component={PlayEmpire} />
              <Route exact path="/character_list" component={Character_List} />
              <Route exact path="/player_list" component={Player_List} />
              <Route exact path="/construction" component={Construction} />

              <Route exact path="/play_tele" component={TelePrompt} />
              <Route exact path="/draw_tele" component={Tele} />
              <Route exact path="/guess_tele" component={TeleGuess} />
              <Route exact path="/result_tele" component={TeleResult} />

              <Route exact path="/trivia_start" component={Trivia_Start} />
              <Route
                exact
                path="/trivia_question"
                component={Trivia_Question}
              />
              <Route exact path="/trivia_answer" component={Trivia_Answer} />
              <Route exact path="/trivia_answer2" component={Trivia_Answer2} />
              <Route component={PageNotFound} />
            </div>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    );
  }
}

const PageNotFound = () => {
  return (
    <div>
      <h1>404 no page found</h1>
    </div>
  );
};

export default App;
