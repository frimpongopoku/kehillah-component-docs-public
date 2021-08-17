import React, { Component } from "react";
import PropTypes from "prop-types";
import "./Dropdown.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faLongArrowAltDown,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

import {
  lowKeyValidation,
  getValueOrLabel,
  LABEL,
  VALUE,
  isArrayOfObjects,
} from "../../shared/js/utils";

const DEFAULT = "default";
const FULL = "full";
const NONE = "-------";
export default class Dropdown extends Component {
  static DEFAULT = DEFAULT;
  static FULL = FULL;
  constructor(props) {
    super(props);
    this.state = {
      selectorWidth: 0,
      isOpen: false,
      //field is intentionaly set to undefined to differentiate when the component has just been mounted, and when a scenario
      //has intentionally set the value to null
      selected_value: undefined,
    };
    this.defaultSelector = null;
    this.setDerivedSelectorWidth = this.setDerivedSelectorWidth.bind(this);
  }

  setDerivedSelectorWidth(el) {
    if (el) this.setState({ selectorWidth: el.getBoundingClientRect().width });
  }
  renderDropdownToggler() {
    const { type } = this.props;
    if (type === DEFAULT)
      return (
        <div
          className={`default-dropdown-selector `}
          ref={this.setDerivedSelectorWidth}
          onClick={() => this.setState({ isOpen: !this.state.isOpen })}
        >
          <span style={{ marginRight: 7 }}>{this.displayLabel()}</span>
          <FontAwesomeIcon className="dropdown-caret" icon={faCaretDown} />
        </div>
      );

    return (
      <div
        className={`full-width-selector ${
          !this.props.multiple && "full-width-selector-single"
        } `}
        onClick={() => this.setState({ isOpen: !this.state.isOpen })}
      >
        <span style={{ marginRight: 7 }}>{this.displayLabel()}</span>
        <FontAwesomeIcon className="dropdown-caret" icon={faLongArrowAltDown} />
      </div>
    );
  }

  validate() {
    lowKeyValidation(this.props);
    const value = this.props.defaultValue || this.props.value;
    const { multiple, data } = this.props;
    const isObj = isArrayOfObjects(data);
    if (isObj && value && typeof value !== "object")
      console.error(
        `You provided an array objects as data, your default value must also be an object. You provided ${typeof value}`
      );

    if (value && !Array.isArray(value) && multiple)
      console.error(
        ` Dropdown selection type is [MULTIPLE] you did not provide an array as the default/initial value. You provided a '${typeof value}'...`
      );
  }

  reset() {
    this.setState({ selected_value: [] });
  }

  handleOnItemSelected(value, label, parentValue) {
    const { multiple, onItemSelected } = this.props;
    var { selected_value } = this.state;
    if (value === NONE) {
      this.reset();
      return onItemSelected([], null, null);
    }
    if (!multiple) {
      this.setState({ selected_value: { label, value }, isOpen: false });
      if (onItemSelected) onItemSelected(value, value, parentValue);
      return;
    }
    selected_value = selected_value || [];
    const isAlreadyIn = selected_value.filter((itm) => itm.value === value)[0];
    var data;
    if (isAlreadyIn) data = selected_value.filter((itm) => itm.value !== value);
    else data = [...selected_value, { value, label }];
    this.setState({ selected_value: data });
    data = data.map((itm) => itm.value);
    if (onItemSelected) onItemSelected(data, value, parentValue);
  }

  displayLabel() {
    var { selected_value } = this.state;
    if (this.props.multiple) {
      selected_value = selected_value || [];
      const labels = selected_value.map((itm, index) => {
        var s = itm.label;
        s = s.length > 40 ? s.slice(0, 40) + "..." : s;
        return (
          <small
            onClick={() =>
              this.handleOnItemSelected(
                itm.value,
                itm.label,
                this.getParentValue(itm.value, itm.label)
              )
            }
            key={index.toString()}
            className="ribbon"
          >
            {itm.label}
            <FontAwesomeIcon icon={faTimes} className="ribbon-sv" />
          </small>
        );
      });

      return selected_value.length > 0 ? labels : this.props.placeholder;
    }
    return (selected_value && selected_value.label) || this.props.placeholder;
  }

  getParentValue(value, label) {
    const { data, labelExtractor, valueExtractor } = this.props;
    return (data || []).filter((parent) => {
      if (labelExtractor && valueExtractor)
        return (
          label === labelExtractor(parent) && value === valueExtractor(parent)
        );
      return parent === value;
    })[0];
  }
  showThatItemIsSelected(value) {
    var { selected_value } = this.state;
    if (this.props.multiple) {
      selected_value = selected_value || [];
      const isIn = selected_value.filter((itm) => itm.value === value)[0];
      if (isIn) return "selected-item";
      return "";
    }
    if (selected_value && selected_value.value === value)
      return "selected-item";
  }
  componentDidMount() {
    this.validate();
  }

  static getDerivedStateFromProps(props, state) {
    const { labelExtractor, valueExtractor, data, multiple } = props;
    //An algo to set the defaultValue that is provided as props to the state
    // But the value should only be set when its the first time the component has mounted,
    // and "defaultValue" is not null
    if (
      state.selected_value === undefined &&
      (props.defaultValue || props.value)
    ) {
      const isObj = isArrayOfObjects(data);
      var initial = props.defaultValue || props.value;
      var value, arr;
      // only string labels can be provided as default values
      // So use the extractors to determine the real value of the default value that has been set
      if (isObj && labelExtractor && valueExtractor) {
        if (!multiple) {
          return {
            selected_value: {
              value: valueExtractor(initial),
              label: labelExtractor(initial),
            },
          };
        }
        arr = (initial || []).map((itm) => {
          return { value: valueExtractor(itm), label: labelExtractor(itm) };
        });
        return { selected_value: arr };
      } else {
        // Means: Not an array of objects, just array of strings so value and label are the same..
        if (multiple) {
          arr = initial.map((itm) => {
            return { value: itm, label: itm };
          });
          return { selected_value: arr };
        }
        return { selected_value: { value: initial, label: initial } };
      }
    }

    return null;
  }
  renderGhostCurtain() {
    const { isOpen } = this.state;
    if (isOpen)
      return (
        <div
          className={`ghost-curtain`}
          onClick={() => this.setState({ isOpen: !this.state.isOpen })}
        ></div>
      );
  }
  ejectChildren() {
    var { data, dropItemStyle, dropItemClassName } = this.props;
    data = data || [];
    data = [NONE, ...data];
    return data.map((item, index) => {
      var label, value;
      label = getValueOrLabel(item, LABEL, this.props);
      value = getValueOrLabel(item, VALUE, this.props);
      if (item === NONE) label = item;
      value = item;
      return (
        <div
          className={`dropdown-item ${this.showThatItemIsSelected(
            value
          )} ${dropItemClassName}`}
          key={index.toString()}
          style={dropItemStyle}
          onClick={() =>
            this.handleOnItemSelected(value, label.toString(), item)
          }
        >
          {" "}
          {label}
        </div>
      );
    });
  }
  renderDropdownChildren() {
    const { type, dropBlanketStyle, dropBlanketClassName } = this.props;
    const { isOpen } = this.state;
    if (type === DEFAULT && isOpen)
      return (
        <div
          style={{
            maxWidth: this.state.selectorWidth || "100vw",
            minWidth: 200,
            minHeight: 100,
            ...dropBlanketStyle,
          }}
          className={`dropdown-children-container elevate-float ${dropBlanketClassName}`}
        >
          {this.ejectChildren()}
        </div>
      );

    if (type === FULL && isOpen)
      return (
        <div
          style={{
            ...dropBlanketStyle,
          }}
          className={`dropdown-children-container-full elevate-float ${dropBlanketClassName}`}
        >
          {this.ejectChildren()}
        </div>
      );
  }

  render() {
    const { containerClassName, containerStyle, type } = this.props;
    return (
      <div style={containerStyle} className={containerClassName}>
        <div
          style={{
            position: "relative",
            display: type === DEFAULT ? "inline" : "block",
          }}
        >
          {this.renderDropdownToggler()}
          {this.renderGhostCurtain()}
          {this.renderDropdownChildren()}
        </div>
      </div>
    );
  }
}

Dropdown.propTypes = {
  /** Placeholder text until an item is selected in dropdown */
  placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
  /** Switch between two dropdown designs*/
  type: PropTypes.string,
  /** Content to be listed as dropdown */
  data: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  ),
  /** Inline style for the dropdown sheet container */
  dropBlanketStyle: PropTypes.object,
  /** Classes for the dropdown sheet container */
  dropBlanketClassName: PropTypes.string,
  /** Inline style for each individual dropdown item */
  dropItemStyle: PropTypes.object,
  /** Classes for each individual dropdown item */
  dropItemClassName: PropTypes.string,
  /** Needed field if a an array of jsons/objects is passed instead of an array of strings.
   * Used to extract which text representation should be used as dropdown text from the objects passed
   */
  labelExtractor: PropTypes.func,
  /** This field is also required when an array of objects is passed.
   * It is used to extract the needed value that should be presented on click from each of the objects in the data array.
   */
  valueExtractor: PropTypes.func,
  /** Indicates whether or not multiple items should be able to be selected on the dropdown  */
  multiple: PropTypes.bool,

  /** Set the default value of the dropdown */
  defaultValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.object,
  ]),
  /** Set the default value of the dropdown. "value" & "defaultValue" do the same thing. Use any you are comfortable with  */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  /** Provides 3 values. Value(s) of selected item(s), and the parent value of currently selected item. (selected, curentItem, parentValueOfCurrentItem) => ...  */
  onItemSelected: PropTypes.func.isRequired,
};

Dropdown.defaultProps = {
  placeholder: "Tap To Toggle...",
  type: "default",
  data: ["first", "second", "third"],
  dropBlanketStyle: {},
  dropBlanketClassName: "",
  dropItemStyle: {},
  dropItemClassName: "",
  labelFieldName: "",
  valueFieldName: "",
  multiple: false,
  defaultValue: null,
  value: null,
};
