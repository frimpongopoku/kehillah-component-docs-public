import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import "./LinearProgressBar.css";

export default class LinearProgressBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      style,
      className,
      progressPercentage,
      progressThickness,
      progressColor,
      containerColor,
      containerWidth,
      borderRadius,
    } = this.props;
    return (
      <div
        className={`linear-progress ${className ?? ""}`}
        style={{
          backgroundColor: containerColor,
          width: `${containerWidth}px`,
          borderRadius: `${borderRadius}px`,
          height: progressThickness,
          ...style,
        }}
      >
        <div
          className="inner-bar"
          ref={this.progress}
          style={{
            width: `${progressPercentage}%`,
            backgroundColor: progressColor,
            borderRadius,
            height: progressThickness,
          }}
        ></div>
        <div className="linear-percentage" style={{ color: progressColor }}>
          {progressPercentage}%
        </div>
      </div>
    );
  }
}

LinearProgressBar.propTypes = {
  /** additional custom styling */
  style: PropTypes.object,
  className: PropTypes.string,
  /**APPLIES TO BOTH LINEAR AND CIRCULAR PROGRESS*/
  /** percentage of progress */
  progressPercentage: PropTypes.number,
  /** thickness of progress  */
  progressThickness: PropTypes.number,
  /** color of progress bar  */
  progressColor: PropTypes.string,
  /** color of progress container  */
  containerColor: PropTypes.string,

  /** width of progress bar*/
  containerWidth: PropTypes.number,
  /** border radius of the bar*/
  borderRadius: PropTypes.number,
};

LinearProgressBar.defaultProps = {
  style: {},
  styleName: "",
  progressPercentage: 90,
  progressThickness: 3,
  progressColor: "darkslateblue",
  containerColor: "lightblue",
  containerWidth: 200,
  borderRadius: 15,
};
