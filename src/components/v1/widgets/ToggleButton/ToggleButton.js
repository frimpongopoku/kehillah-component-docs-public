import React, { Component } from "react";
import PropTypes from "prop-types";
import "./ToggleButton.css";

export default class ToggleButton extends Component {
  constructor(props) {
    super(props);
    this.toggleButton = React.createRef();
    this.state = {
      toggledOn: null,
    };
  }

  static getDerivedStateFromProps(props, state) {
    return {
      toggledOn: state.toggledOn ?? props.toggledOn ?? false,
    };
  }

  componentDidMount() {
    if (this.state.toggledOn) {
      this.toggleButton.current.checked = true;
    }
  }

  handleToggle = () => {
    const { onToggleChange } = this.props;

    this.state.toggledOn
      ? this.setState({ toggledOn: false }, () =>
          onToggleChange?.(this.state.toggledOn)
        )
      : this.setState({ toggledOn: true }, () =>
          onToggleChange?.(this.state.toggledOn)
        );
  };

  render() {
    const {
      style,
      className,
      toggleOffColor,
      toggleOnColor,
      toggledOn,
      width,
      height,
      onText,
      offText,
      radius,
      // onToggleChange,
    } = this.props;
    return (
      <input
        onClick={this.handleToggle}
        className={`toggle-button ${className}`}
        ref={this.toggleButton}
        type="checkbox"
        style={{ backgroundColor: toggleOffColor }}
        on={onText}
        off={offText}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          "--ball-height": `${height}px`,
          "--toggle-off-color": `${toggleOffColor}`,
          "--toggle-on-color": `${toggleOnColor}`,
          "--toggle-radius": `${radius}px`,
        }}
      />
    );
  }
}

ToggleButton.propTypes = {
  /** color of toggle when off */
  toggleOffColor: PropTypes.string,
  /** color of toggle when on */
  toggleOnColor: PropTypes.string,
  /** should it be toggle by default */
  toggledOn: PropTypes.bool,
  /** height of toggle */
  height: PropTypes.number,
  /** width of toggle */
  width: PropTypes.number,
  /** text to display when toggle is on */
  onText: PropTypes.string,
  /** text to display when toggle is off */
  offText: PropTypes.string,
  /** border radius of toggle */
  radius: PropTypes.number,
};

ToggleButton.defaultProps = {
  toggleOffColor: "tomato",
  toggleOnColor: "teal",
  toggledOn: true,
  width: 90,
  height: 25,
  onText: "on",
  offText: "off",
  radius: 16,
};
