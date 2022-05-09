import React from "react";
import Popup from "reactjs-popup";
//import "../../../node_modules/bootstrap/dist/css/bootstrap.css";

export default () => (
  <Popup
    trigger={<button className="Btn-Green1">RULES</button>}
    modal
    closeOnDocumentClick
  >
    <div style={{ textAlign: "left" }}>
      <h2>Empire Rules</h2>
      <ul>
        <li>
          Each person types the name of a famous fiction or nonfiction person
        </li>
        <li>
          The game displays each name twice and then never displays the name
          again
        </li>
        <li>
          Players type the name in and select who they think the person is
        </li>
        <li>If you guess the person correctly the person joins their empire</li>
        <li>
          The other person can give suggestions to the head person of who they
          think each person is.{" "}
        </li>
        <li>
          If they get the question wrong it is that person who answered turn to
          go
        </li>
        <li>The game ends when there is only one empire </li>
      </ul>
      <button>Yes</button>
      <button>No</button>
    </div>
  </Popup>
);
