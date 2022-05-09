import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { findDOMNode } from "react-dom";
import {
  Pencil,
  TOOL_PENCIL,
  Line,
  TOOL_LINE,
  Ellipse,
  TOOL_ELLIPSE,
  Rectangle,
  TOOL_RECTANGLE
} from "./components/TelestrationsGame/tools";

export const toolsMap = {
  [TOOL_PENCIL]: Pencil,
  [TOOL_LINE]: Line,
  [TOOL_RECTANGLE]: Rectangle,
  [TOOL_ELLIPSE]: Ellipse
};

export default class SketchPad extends Component {
  tool = null;
  interval = null;

  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    items: PropTypes.array.isRequired,
    animate: PropTypes.bool,
    canvasClassName: PropTypes.string,
    color: PropTypes.string,
    fillColor: PropTypes.string,
    size: PropTypes.number,
    tool: PropTypes.string,
    toolsMap: PropTypes.object,
    onItemStart: PropTypes.func, // function(stroke:Stroke) { ... }
    onEveryItemChange: PropTypes.func, // function(idStroke:string, x:number, y:number) { ... }
    onDebouncedItemChange: PropTypes.func, // function(idStroke, points:Point[]) { ... }
    onCompleteItem: PropTypes.func, // function(stroke:Stroke) { ... }
    debounceTime: PropTypes.number
  };

  static defaultProps = {
    width: 300,
    height: 400,
    color: "#000",
    size: 5,
    fillColor: "",
    canvasClassName: "canvas",
    debounceTime: 1000,
    animate: true,
    tool: TOOL_PENCIL,
    toolsMap
  };

  constructor(props) {
    super(props);
    this.initTool = this.initTool.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onDebouncedMove = this.onDebouncedMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
  }

  componentDidMount() {
    this.canvas = findDOMNode(this.canvasRef);
    this.ctx = this.canvas.getContext("2d");
    this.initTool(this.props.tool);
  }

  componentWillReceiveProps({ tool, items }) {
    items
      .filter(item => this.props.items.indexOf(item) === -1)
      .forEach(item => {
        this.initTool(item.tool);
        this.tool.draw(item, this.props.animate);
      });
    this.initTool(tool);
  }

  initTool(tool) {
    this.tool = this.props.toolsMap[tool](this.ctx);
  }

  onPointerDown(e) {
    const data = this.tool.onPointerDown(
      ...this.getCursorPosition(e),
      this.props.color,
      this.props.size,
      this.props.fillColor
    );
    data &&
      data[0] &&
      this.props.onItemStart &&
      this.props.onItemStart.apply(null, data);
    if (this.props.onDebouncedItemChange) {
      this.interval = setInterval(
        this.onDebouncedMove,
        this.props.debounceTime
      );
    }
  }

  /*
  handleTouchStart = (e) => {
    if (!this.props.noDragging) {
      e.stopPropagation();
      this.setFixedOffset();
      this.startDrag(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
    }
  };
  */

  onDebouncedMove() {
    if (
      typeof this.tool.onDebouncedMouseMove == "function" &&
      this.props.onDebouncedItemChange
    ) {
      this.props.onDebouncedItemChange.apply(
        null,
        this.tool.onDebouncedMouseMove()
      );
    }
  }

  onPointerMove(e) {
    const data = this.tool.onPointerMove(...this.getPointerPosition(e));
    data &&
      data[0] &&
      this.props.onEveryItemChange &&
      this.props.onEveryItemChange.apply(null, data);
  }

  onPointerUp(e) {
    const data = this.tool.onPointerUp(...this.getPointerPosition(e));
    data &&
      data[0] &&
      this.props.onCompleteItem &&
      this.props.onCompleteItem.apply(null, data);
    if (this.props.onDebouncedItemChange) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  getCursorPosition(e) {
    const { top, left } = this.canvas.getBoundingClientRect();
    return [e.clientX - left, e.clientY - top];
  }

  render() {
    const { width, height, canvasClassName } = this.props;
    return (
      <canvas
        ref={canvas => {
          this.canvasRef = canvas;
        }}
        className={canvasClassName}
        onPointerDown={this.onPointerDown}
        onPointerMove={this.onPointerMove}
        onPointerOut={this.onPointerUp}
        onPointerUp={this.onPointerUp}
        width={width}
        height={height}
      />
    );
  }
}
