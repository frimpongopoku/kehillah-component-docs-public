import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import "./CircularProgressBar.css";

export default class CircularProgressBar extends Component {
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
      radius,
    } = this.props;
    const strokeDasharray = Math.ceil(2 * Math.PI * radius);
    return (
      <div
        className={`circular-progress ${className ?? ""}`}
        style={{
          width: radius * 2.1 + progressThickness,
          height: radius * 2.1 + progressThickness,
        }}
      >
        <div className="circles">
          <svg
            style={{
              width: radius * 2.1 + progressThickness,
              height: radius * 2.1 + progressThickness,
            }}
          >
            <circle
              cx={radius + 5}
              cy={radius + 5}
              r={radius}
              style={{ strokeWidth: progressThickness, stroke: containerColor }}
            ></circle>
            <circle
              cx={radius + 5}
              cy={radius + 5}
              r={radius}
              style={{
                strokeWidth: progressThickness,
                stroke: progressColor,
                strokeDasharray,
                strokeDashoffset: `${
                  strokeDasharray * (1 - progressPercentage / 100)
                }`,
              }}
            ></circle>
          </svg>
        </div>
        <div className="circular-percentage" style={{ color: progressColor }}>
          {progressPercentage}%
        </div>
      </div>
    );
  }
}

CircularProgressBar.propTypes = {
  /** additional custom styling */
  style: PropTypes.object,

  /** additional custom classes */
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

  /** radius of circle*/
  radius: PropTypes.number,
};

CircularProgressBar.defaultProps = {
  style: {},
  styleName: "",
  progressPercentage: 90,
  progressThickness: 3,
  progressColor: "darkslateblue",
  containerColor: "lightblue",
  radius: 70,
};
