import React, { Component } from "react";
import PropTypes from "prop-types";
import "./Tooltip.css";
import * as TooltipConstants from "./TooltipConstants";
const { TOP, RIGHT, BOTTOM, LEFT } = TooltipConstants;

export default class Tooltip extends Component {
  static TOP = TOP;
  static RIGHT = RIGHT;
  static BOTTOM = BOTTOM;
  static LEFT = LEFT;

  constructor(props) {
    super(props);
  }

  render() {
    const {
      text,
      position,
      tooltipBackground,
      textColor,
      tooltipWidth,
    } = this.props;

    return (
      <div
        text={text}
        className={`tooltip ${position}`}
        style={{
          "--tooltip-background": tooltipBackground,
          "--text-color": textColor,
          "--tooltip-width": `${tooltipWidth}px`,
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

Tooltip.propTypes = {
  /** text in the tooltip */
  text: PropTypes.string,

  /** position of tooltip */
  position: PropTypes.string,

  /** background color of the tooltip */
  tooltipBackground: PropTypes.string,

  /** color of the tooltip text */
  textColor: PropTypes.string,

  /** width of  tooltip
   *
   *  @param min: 50
   *  @param max : 200
   */
  tooltipWidth: PropTypes.number,
};

Tooltip.defaultProps = {
  text: "hello! i am a tooltip",
  position: Tooltip.TOP,
  tooltipBackground: "purple",
  textColor: "white",
  tooltipWidth: 160,
};
