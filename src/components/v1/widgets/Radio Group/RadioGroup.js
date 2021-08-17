import React, { Component } from "react";
import {
  getValueOrLabel,
  lowKeyValidation,
  LABEL,
  VALUE,
} from "../../shared/js/utils";
import PropTypes from "prop-types";
import "./RadioGroup.css";
export default class RadioGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected_item: undefined,
    };
    this.handleOnItemSelected = this.handleOnItemSelected.bind(this);
  }

  handleOnItemSelected(value) {
    const { onItemSelected } = this.props;
    const valueIsSelectedAlready = value === this.state.selected_item;
    if (valueIsSelectedAlready) {
      this.setState({ selected_item: null });
      if (onItemSelected) onItemSelected(null);
      return;
    }
    this.setState({ selected_item: value });
    if (onItemSelected) onItemSelected(value);
  }

  static getDerivedStateFromProps(props, state) {
    const { value, defaultValue } = props;
    if (state.selected_item === undefined && (value || defaultValue))
      // Means component is running for the first time, check for default value provided
      return { selected_item: value || defaultValue };

    return null;
  }
  itemIsChecked(value) {
    return value === this.state.selected_item;
  }
  renderContent() {
    lowKeyValidation(this.props);
    const { data, groupStyle, groupClassName } = this.props;
    if (!data) return <small>Please provide data for radio group...</small>;
    return data.map((item, index) => {
      var label, value;
      label = getValueOrLabel(item, LABEL, this.props);
      value = getValueOrLabel(item, VALUE, this.props);
      return (
        <div
          key={index.toString()}
          className={`put-me-inline ${groupClassName}`}
          style={groupStyle}
        >
          <RadioButton
            onItemSelected={this.handleOnItemSelected}
            checked={this.itemIsChecked(value)}
            label={label}
            value={value}
          />
        </div>
      );
    });
  }

  render() {
    return <> {this.renderContent()}</>;
  }
}

RadioGroup.propTypes = {
  /** Inline style for the checkbox label element (p) */
  style: PropTypes.object,
  /** Classes for the checkbox label element(p) */
  className: PropTypes.string,
  /** Data to be displayed displayed in the form of radio buttons */
  data: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.number])
  ),
  /** A function that should  extract and return a string to be used for each radio-button label in the case where an  array of objects is provided as data */
  labelExtractor: PropTypes.func,
  /** A function that should  extract and return a value to be used when radio-button is selected in the case where an array of objects is provided as data */
  valueExtractor: PropTypes.func,
  /** Provides selected value when any item is selected
   * @param value
   */
  onItemSelected: PropTypes.func,
  /**  Value of item that should be pre-marked on load */
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**  Value of item that should be pre-marked on load */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  groupClassName: PropTypes.string,
  groupStyle: PropTypes.object,
};

RadioGroup.defaultProps = {
  style: {},
  containerStyle: {},
  className: "",
  data: ["Orange", "Banana", "Mangoes", "Pineaples", "Lettuce"],
  defaultValue: null,
  value: null,
  groupStyle: {},
  groupClassName: "",
};

const RadioButton = (props) => {
  const {
    containerStyle,
    containerClassName,
    style,
    className,
    onItemSelected,
    checked,
    value,
    label,
  } = props;

  return (
    <div className={`${containerClassName}`} style={containerStyle}>
      <div
        className="radio-group-default-container"
        onClick={() => onItemSelected(value)}
      >
        <div style={{ position: "relative" }}>
          <div className={`radio-group-empty-circle`}></div>
          {checked && <div className={`hovering-radio-circle`}></div>}
        </div>

        <p style={style} className={`${className}`}>
          {label && label.toString()}
        </p>
      </div>
    </div>
  );
};
