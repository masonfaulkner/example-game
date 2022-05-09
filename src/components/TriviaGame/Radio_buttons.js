import React, { Component } from "react";
import ReactDOM from "react";
import PropTypes from "prop-types";

class Radio extends Component {
  constructor(props) {
    super(props);
    this.state = { selected: false };
  }

  toggle() {
    const { onChange } = this.context.radioGroup;
    const selected = !this.state.selected;
    this.setState({ selected });
    onChange(selected, this);
  }

  setSelected(selected) {
    this.setState({ selected });
  }

  render() {
    let classname = this.state.selected ? "active" : "";
    return (
      <button
        type="button"
        className={classname}
        onClick={this.toggle.bind(this)}
      >
        {this.state.selected ? "yes" : "no"}
      </button>
    );
  }
}

Radio.contextTypes = {
  radioGroup: React.PropTypes.object
};

class RadioGroup extends Component {
  constructor(props) {
    super(props);
    this.options = [];
  }

  getChildContext() {
    const { name } = this.props;
    return {
      radioGroup: {
        name,
        onChange: this.onChange.bind(this)
      }
    };
  }

  onChange(selected, child) {
    this.options.forEach(option => {
      if (option !== child) {
        option.setSelected(!selected);
      }
    });
  }

  render() {
    let children = React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        ref: component => {
          this.options.push(component);
        }
      });
    });
    return <div className="radio-group">{children}</div>;
  }
}

RadioGroup.childContextTypes = {
  radioGroup: React.PropTypes.object
};

class Application extends React.Component {
  render() {
    return (
      <RadioGroup name="test">
        <Radio value="1" />
        <Radio value="2" />
        <Radio value="3" />
      </RadioGroup>
    );
  }
}

/*
 * Render the above component into the div#app
 */
ReactDOM.render(<Application />, document.getElementById("app"));
