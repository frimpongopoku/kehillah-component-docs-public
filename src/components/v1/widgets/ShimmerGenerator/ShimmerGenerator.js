import React, { Component } from "react";
import PropTypes from "prop-types";
import "./ShimmerGenerator.css";
import * as ShimmerConstants from "./ShimmerConstants";

const { FADE_IN_OUT, GLIDE_OVER } = ShimmerConstants;

export default class ShimmerGenerator extends Component {
  static FADE_IN_OUT = FADE_IN_OUT;
  static GLIDE_OVER = GLIDE_OVER;
  constructor(props) {
    super(props);
  }

  render() {
    const { width, height, radius, style, animation } = this.props;

    return (
      <div
        className={`shimmer${
          animation === ShimmerGenerator.FADE_IN_OUT
            ? " " + ShimmerGenerator.FADE_IN_OUT
            : " " + ShimmerGenerator.GLIDE_OVER
        }`}
        style={{
          width: `${width}rem`,
          height: `${height}rem`,
          borderRadius: `${radius}%`,
          ...style,
          backgroundSize: `${300}% ${300}%`,
        }}
      ></div>
    );
  }
}

ShimmerGenerator.propTypes = {
  /** width */
  width: PropTypes.number,
  /** height */
  height: PropTypes.number,
  /** radius */
  radius: PropTypes.number,
  /** additional custom style */
  style: PropTypes.object,
  /** animation option */
  animation: PropTypes.string,
};

ShimmerGenerator.defaultProps = {
  width: 30,
  height: 30,
  radius: 0,
  style: {},
  animation: ShimmerGenerator.GLIDE_OVER,
};
