import React, { Component } from "react";
import PropTypes from "prop-types";
import "./Spinner.css";
import * as SpinnerConstants from "./SpinnerConstants";
const { ONE_HALF_CIRCLE_TYPE, TWO_HALF_CIRCLES_TYPE, TRANSPARENT_CIRCLE_TYPE } =
  SpinnerConstants;

export default class Spinner extends Component {
  static ONE_HALF_CIRCLE_TYPE = ONE_HALF_CIRCLE_TYPE;
  static TWO_HALF_CIRCLES_TYPE = TWO_HALF_CIRCLES_TYPE;
  static TRANSPARENT_CIRCLE_TYPE = TRANSPARENT_CIRCLE_TYPE;
  render() {
    const { style, className, thickness, radius, variation, color } =
      this.props;
    return (
      <div
        className={`spinner ${variation} ${className ?? ""}`}
        style={{
          width: radius,
          height: radius,
          borderWidth: `${thickness}px`,
          borderStyle: "solid",
          borderTopColor: color,
          borderBottomColor: `${
            variation === TWO_HALF_CIRCLES_TYPE ? color : ""
          }`,
          ...style,
        }}
      ></div>
    );
  }
}

Spinner.propTypes = {
  /** additional custom styling */
  style: PropTypes.object,

  /** additional custom class names */
  className: PropTypes.string,

  /** thickness of spinner  */
  thickness: PropTypes.number,

  /** radius of spinner*/
  radius: PropTypes.number,

  /** spinner variation type */
  variation: PropTypes.string,

  /**color of spinner */
  color: PropTypes.string,
};

Spinner.defaultProps = {
  style: {},
  styleName: "",
  thickness: 3,
  color: "darkslateblue",
  radius: 50,
  variation: Spinner.ONE_HALF_CIRCLE_TYPE,
};
