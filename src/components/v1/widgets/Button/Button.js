import React, { Component } from "react";
import PropTypes from "prop-types";
import "./Button.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoffee,
  faCalendar,
  faCalendarDay,
} from "@fortawesome/free-solid-svg-icons";
import * as ButtonConstants from "./ButtonConstants";
const {
  DEFAULT,
  SOLID,
  HOLLOW,
  THEMED,
  SUCCESS,
  DANGER,
  SMALL,
  MEDIUM,
  LARGE,
  LEFT,
  RIGHT,
  ICON,
} = ButtonConstants;
export default class Button extends Component {
  static DEFAULT = DEFAULT;
  static SOLID = SOLID;
  static HOLLOW = HOLLOW;
  static THEMED = THEMED;
  static SUCCESS = SUCCESS;
  static DANGER = DANGER;
  static SMALL = SMALL;
  static MEDIUM = MEDIUM;
  static LARGE = LARGE;
  static LEFT = LEFT;
  static RIGHT = RIGHT;
  static ICON = ICON;

  constructor(props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
  }
  handleOnClick(e) {
    e.preventDefault();
    const { onClick } = this.props;
    if (!onClick) return;
    onClick(e);
  }
  render() {
    const {
      style,
      className,
      variant,
      size,
      theme,
      icon,
      iconPos,
    } = this.props;
    return (
      <button
        onClick={this.handleOnClick}
        style={{ ...style }}
        className={`button button-${variant}-${theme}-${size}${
          iconPos !== null ? " button-icon-" + iconPos : ""
        } ${className ?? ""}`}
      >
        {icon}
        {this.props.children}
      </button>
    );
  }
}

Button.propTypes = {
  /** additional custom styling */
  style: PropTypes.object,
  /** additional custom class name */
  className: PropTypes.string,
  /** button variant - solid, hollow or default */
  variant: PropTypes.string,
  /** button size - small, medium or large */
  size: PropTypes.string,
  /** button color - themed, success or danger */
  theme: PropTypes.string,
  /** button icon  */
  icon: PropTypes.node,
  /** icon position on button  */
  iconPos: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

Button.defaultProps = {
  style: {},
  className: "",
  variant: Button.SOLID,
  size: Button.MEDIUM,
  theme: Button.THEMED,
  icon: null,
  iconPos: Button.LEFT,
};
