import React, { Component } from "react";
import { SketchField, Tools } from "react-sketch";
import "./whiteboard.css";
import SketchFieldDemo from "./SketchFieldDemo";

class Tele extends Component {
  render() {
    return (
      <div className="Home-bkg">
        <SketchFieldDemo
          tool={Tools.Pencil}
          lineColor="black"
          lineWidth={3}
          history={this.props.history}
        />
      </div>
    );
  }
}

export default Tele;
