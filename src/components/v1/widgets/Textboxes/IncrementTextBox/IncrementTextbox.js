import React, { Component } from "react";
import PropTypes from "prop-types";
import "./IncrementTextbox.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

export default class IncrementTextbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      increment: null,
    };
  }

  static getDerivedStateFromProps(props, state) {
    return {
      increment: state.increment ?? props.defaultValue ?? 0,
    };
  }

  minus = () => {
    const { onValueChange } = this.props;
    let currentValue = this.state.increment;
    if (!currentValue) return;
    this.setState(
      { increment: --currentValue },
      () => onValueChange && onValueChange(this.state.increment)
    );
  };

  plus = () => {
    const { onValueChange } = this.props;
    let currentValue = this.state.increment;
    this.setState(
      { increment: ++currentValue },
      () => onValueChange && onValueChange(this.state.increment)
    );
  };

  render() {
    const {
      width,
      height,
      style,
      className,
      onValueChange,
      defaultValue,
      elevation,
    } = this.props;

    return (
      <div
        className={`increment-textbox ${className} elevate-${elevation}`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          ...style,
        }}
      >
        <div onClick={this.minus} className="btn">
          <FontAwesomeIcon icon={faMinus} />
        </div>
        <input
          className="box-input"
          type="text"
          value={this.state.increment}
          onChange={(e) => {
            const increment = isNaN(Number(e.target.value))
              ? 0
              : Number(e.target.value);
            this.setState(
              {
                increment,
              },
              onValueChange && onValueChange(increment)
            );
          }}
        />

        <div onClick={this.plus} className="btn">
          <FontAwesomeIcon icon={faPlus} />
        </div>
      </div>
    );
  }
}

IncrementTextbox.propTypes = {
  /** additional custom styling */
  style: PropTypes.object,
  /** additional custom class name */
  className: PropTypes.string,
  /** width */
  width: PropTypes.number,
  /** height */
  height: PropTypes.number,
  /** default value for the increment box */
  defaultValue: PropTypes.number,
  /** function to be called when value is updated
   *
   * @param newValue the updated value from the increment textbox
   */
  onValueChange: PropTypes.func.isRequired,
  /** Provide an int value or a text that maps to any of our predefined classes. The text or number here will be resolved to elevate-{whatever you provide}. Take a look at our elevation class list */
  elevation: PropTypes.oneOf([PropTypes.int, PropTypes.string]),
};

IncrementTextbox.defaultProps = {
  style: {},
  width: 150,
  height: 45,
  defaultValue: 12,
  elevation: 1,
};
