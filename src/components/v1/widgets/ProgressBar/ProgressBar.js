import React, { Component } from "react";
import PropTypes from "prop-types";
import LinearProgressBar from "./../LinearProgressBar/LinearProgressBar";
import CircularProgressBar from "./../CircularProgressBar/CircularProgressBar";
import * as ProgressBarConstants from "./ProgressBarConstants";
const { LINEAR, CIRCULAR } = ProgressBarConstants;

export default class ProgressBar extends Component {
  static LINEAR = LINEAR;
  static CIRCULAR = CIRCULAR;

  constructor(props) {
    super(props);
  }

  getBar() {
    const props = this.props;
    if (props.circular) return <CircularProgressBar {...this.props} />;
    if (props.linear) return <LinearProgressBar {...this.props} />;
    return (
      <small>
        Please specify a proper progress bar type... (linear, or circular)
      </small>
    );
  }
  render() {
    return this.getBar();
  }
}

ProgressBar.propTypes = {
  /** additional custom styling */
  style: PropTypes.object,

  /** additional custom classes */
  className: PropTypes.string,

  /** percentage of progress */
  progressPercentage: PropTypes.number,

  /** thickness of progress  */
  progressThickness: PropTypes.number,

  /** color of progress bar  */
  progressColor: PropTypes.string,

  /** color of progress container  */
  containerColor: PropTypes.string,

  /** radius of circular progress bar */
  radius: PropTypes.number,

  /** width of linear progress bar */
  containerWidth: PropTypes.number,

  /** border radius linear progress bar */
  borderRadius: PropTypes.number,

  /** specifies circular progressbar type */
  circular: PropTypes.bool,

  /** specifies linear progressbar type */
  linear: PropTypes.bool,
};

ProgressBar.defaultProps = {
  style: {},
  styleName: "",
  progressPercentage: 50,
  progressThickness: 3,
  progressColor: "darkslateblue",
  containerColor: "lightblue",
  radius: 70,
  containerWidth: 200,
  borderRadius: 15,
};
