import React from "react";

export default class Trash extends React.Component {
  constructor(props) {
    super(props);
    this.state = { thankYouMessage: "" };
  }

  dropped = (e) => {
    e.containerElem.style.visibility = "hidden";
    this.setState({
      thankYouMessage: `Thanks for the ${e.dragData.label}! ${e.dragData.tastes}!`,
    });
    // console.log({ "onHit event passed to target animal:": e });
  };

  render() {
    return (
      <div>
        <i className="fa fa-trash trashIcon"></i>
        <div style={{ minHeight: 24, fontStyle: "italic" }}>
          {this.state.thankYouMessage}
        </div>
        {this.props.children}
      </div>
    );
  }
}
