import React from "react";
import Popup from "reactjs-popup";

export default () => (
  <Popup
    trigger={<button className="Btn-Green1">RULES</button>}
    modal
    closeOnDocumentClick
  >
    <div style={{ textAlign: "left" }}>
      <h2>Liar's Dice Rules</h2>
      <ul>
        <li>
          Each person starts with 6 dice. A person will be randomly chosen to go
          first.
        </li>
        <li>
          All of the dice on the table are in play including your own. Example:
          The first person then states "I bet there are at least three 4's on
          the table".
        </li>
        <li>
          The game is then like poker. The next person must say something higher
          (For example: three 5's or four 4's). The game continues clockwise
          until someone calls BS.
        </li>
        <li>
          Anyone can guess that a person is lying. If what the person said is
          true, the person who calls BS loses a die
        </li>
        <li>
          If the person was lying that person loses a die. (For example: if a
          person says there are four 5's and someone calls BS, but there are
          only three, the liar loses a die)
        </li>
        <li>A person is out of the game if they lose all their dice.</li>
        <li>The game ends when there is only 1 person who has dice left.</li>
      </ul>
    </div>
  </Popup>
);
