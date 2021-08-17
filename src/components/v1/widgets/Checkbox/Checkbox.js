import React, { Component } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import "./Checkbox.css";
export default class CheckBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: undefined,
    };
    this.onCheckBoxSelected = this.onCheckBoxSelected.bind(this);
  }

  onCheckBoxSelected(e) {
    e.preventDefault();
    const { onItemSelected, label, value, outSourceChanges } = this.props;
    const { checked } = this.state;
    if (!outSourceChanges) this.setState({ checked: !checked });
    if (!onItemSelected) return;
    onItemSelected(value || label);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.outSourceChanges) return { checked: props.checked };
    // the first time the component mounts, check for a default check value provided
    if (state.checked === undefined) return { checked: props.checked };
    return null;
  }
  render() {
    const {
      containerStyle,
      containerClassName,
      style,
      className,
      label,
    } = this.props;
    return (
      <div className={containerClassName} style={containerStyle}>
        <div
          className={`checkbox-default-container`}
          onClick={this.onCheckBoxSelected}
        >
          <div style={{ position: "relative" }}>
            <div className={`checkbox-empty-box`}></div>
            {this.state.checked && (
              <FontAwesomeIcon
                icon={faCheck}
                className={`hovering-checkmark`}
              />
            )}
          </div>
          <p style={style} className={`${className}`}>
            {label}
          </p>
        </div>
      </div>
    );
  }
}

CheckBox.propTypes = {
  /** Inline style for the checkbox label element (p) */
  style: PropTypes.object,
  /** Classes for the checkbox label element(p) */
  className: PropTypes.string,
  /** Inline style for the root container of the entire textbox */
  containerStyle: PropTypes.object,
  /** Classnames for the root container of the entire textbox */
  containerClassName: PropTypes.string,
  /** Inline style for input textbox element itself */
  style: PropTypes.object,
  /** Classnames for the input textbox element itself */
  className: PropTypes.string,
  /** Text to be shown by checkbox */
  label: PropTypes.string,
  /** Value of checkbox when selected */
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.number,
    PropTypes.bool,
  ]),
  /** Returns the value of the checkbox when selected
   * @param value
   */
  onItemSelected: PropTypes.func.isRequired,
  /** A value that is set to specify whether the state of the checkbox should depend on an external value or on itself... */
  outSourceChanges: PropTypes.bool,
  /** Specifies the state of the checkbox */
  checked: PropTypes.bool,
};

CheckBox.defaultProps = {
  style: {},
  containerStyle: {},
  className: "",
  containerClassName: "",
  label: "Select me please...",
  value: null,
  outSourceChanges: false,
  onItemSelected: (value) => null,
};
