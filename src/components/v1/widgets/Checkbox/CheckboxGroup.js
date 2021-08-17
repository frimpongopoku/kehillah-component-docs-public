import React, { Component } from "react";
import {
  lowKeyValidation,
  getValueOrLabel,
  LABEL,
  VALUE,
} from "../../shared/js/utils";
import PropTypes from "prop-types";
import CheckBox from "./Checkbox";
import "./Checkbox.css";

export default class CheckBoxGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected_items: [],
    };
    this.handleOnItemSelected = this.handleOnItemSelected.bind(this);
    this.itemIsSelected = this.itemIsSelected.bind(this);
  }

  handleOnItemSelected(value) {
    const { onItemSelected } = this.props;
    const { selected_items } = this.state;
    const notInIt = selected_items.filter((itm) => itm !== value);
    const itemExists = selected_items.filter((itm) => itm === value)[0];
    if (!itemExists) {
      var together = [...notInIt, value];
      this.setState({ selected_items: together });
      if (onItemSelected) onItemSelected(together, value);
      return;
    }
    this.setState({ selected_items: notInIt });
    if (onItemSelected)
      onItemSelected(notInIt.length !== 0 ? notInIt : [], value);
  }

  static getDerivedStateFromProps(props, state) {
    const { selected_items } = state;
    if (
      selected_items &&
      selected_items.length === 0 &&
      (props.defaultValue || props.value)
    ) {
      // first time this component mounts, set the state with the default value provided, if available
      return { selected_items: props.defaultValue || props.value };
    }
    return null;
  }

  itemIsSelected(value) {
    const { selected_items } = this.state;
    const k = selected_items.filter((itm) => itm === value)[0];
    return value === k;
  }

  renderContent() {
    lowKeyValidation(this.props);
    const { data, groupClassName, groupStyle } = this.props;
    if (!data) return <small> Provide data for this checkbox group...</small>;
    return data.map((item, index) => {
      var label, value;
      label = getValueOrLabel(item, LABEL, this.props);
      value = getValueOrLabel(item, VALUE, this.props);
      return (
        <div
          className={` put-me-inline ${groupClassName}`}
          style={groupStyle}
          key={index.toString()}
        >
          <CheckBox
            {...this.props.childProps}
            label={label}
            value={value}
            onItemSelected={this.handleOnItemSelected}
            checked={this.itemIsSelected(value)}
            outSourceChanges={true}
          />
        </div>
      );
    });
  }

  render() {
    return <>{this.renderContent()}</>;
  }
}

CheckBoxGroup.propTypes = {
  /** Data to be displayed displayed in the form of checkboxes */
  data: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  ),

  /** A function that should  extract and return a string to be used for each checkbox label when an array of objects is provided as data */
  labelExtractor: PropTypes.func,
  /** A function that should  extract and return a value to be used when checkbox is selected when an array of objects is provided as data */
  valueExtractor: PropTypes.func,
  /** Provides two variables. An array of all selected items, and the currently selected item onChange. (array, currentlySelectedItem) => ...
   * @param array
   * @param currentlySelectedValue
   */
  onItemSelected: PropTypes.func,
  /**  Value of items that should be pre-marked on load */
  defaultValue: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  /**  Value of items that should be pre-marked on load */
  value: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  /** inline style to be attached to main wrapping div of the checkbox group */
  groupStyle: PropTypes.object,
  /** classes to be attched to main wrapping div of the checkbox group */
  groupClassName: PropTypes.string,
  /** Properties that should be passed on to each checkbox that is being displayed */
  childProps: PropTypes.object,
};

CheckBoxGroup.defaultProps = {
  data: ["Mangoes", "Bananas", "Abrofonkate3"],
  groupStyle: {},
  groupClassName: "",
  childProps: {},
  defaultValue: [],
  value: [],
};
