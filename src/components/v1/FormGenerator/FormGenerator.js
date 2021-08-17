import "./FormGenerator.css";
import React, { Component } from "react";
import PropTypes from "prop-types";
import TextBox from "./../widgets/Textboxes/Textbox";
import RadioGroup from "./../widgets/Radio Group/RadioGroup";
import CheckBoxGroup from "./../widgets/Checkbox/CheckboxGroup";
import CheckBox from "./../widgets/Checkbox/Checkbox";
import FileSelector from "./../widgets/FileUploader/FileUploader";
import Dropdown from "./../widgets/Dropdown/Dropdown";
import Fields from "./Fields";
import Button from "../widgets/Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowRight,
  faArrowUp,
  faCheckCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const FORWARD = "FORWARD";
const BACK = "BACK";

export default class FormGenerator extends Component {
  static Fields = Fields;
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      errors: {},
      currentField: null,
      data: {},
      animationKey: Math.random(999999999).toString(), // react will always rerender DOM when an element's key changes. So, this dynamic key is going to be used on any element that needs to be reanimated when "some" state changes
      movementDirection: null,
      resetors: {},
    };
    this.handleNextQuestionInMultiForm = this.handleNextQuestionInMultiForm.bind(
      this
    );

    this.handleTextFieldChanges = this.handleTextFieldChanges.bind(this);
    this.handleEnterKeyPress = this.handleEnterKeyPress.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
  }

  renderIfLabel(field) {
    if (!field) return;
    const { label, index } = field;
    if (!this.props.multiStep)
      return (
        <>
          {label && (
            <small className={"label-css"}>
              {label}{" "}
              <span style={{ color: "red" }}>
                <b>{(field.required || field.isRequired) && "*"}</b>
              </span>
            </small>
          )}
          <div>{this.renderIfError(field)}</div>
        </>
      );

    if (this.props.multiStep && label)
      return (
        <>
          <p
            style={{
              textAlign: "left",
              fontSize: 30,
              display: "flex",
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <span style={{ color: "#d4d4d4", fontSize: 16 }}>
              <b>{index + 1}</b>
              <FontAwesomeIcon
                icon={faArrowRight}
                style={{ margin: "0px 7px" }}
              />
            </span>
            {label}
            <span style={{ color: "red" }}>
              <b>{(field.required || field.isRequired) && "*"}</b>
            </span>
          </p>
        </>
      );
  }

  /**
   * Renders field level errors when not in multistep mode
   * @param {object} field
   * @returns
   */
  renderIfError(field) {
    if (!field) return;
    const error = this.state.errors[field.name];
    if (error)
      return (
        <>
          <br />
          <small style={{ color: "maroon", padding: 5, fontWeight: "bold" }}>
            {error}
          </small>
        </>
      );
  }

  renderTextBox(field = {}) {
    const value = this.state.data[field.name] || "";
    const generics = field.__html_defaults || {};
    const props = {
      onChange: (e) => this.handleTextFieldChanges(e, field),
      ...field,
      value: value,
      __HTMLM_DEFAULTS: {
        onKeyPress: this.handleEnterKeyPress,
        autoFocus: this.props.multiStep, // if its the multistep form, make textboxes first focused item onload
        ...generics,
      },
    };
    if (field.fieldType === Fields.INPUT)
      return (
        <>
          {this.renderIfLabel(field)}
          <TextBox {...props} />
        </>
      );
    if (field.fieldType === Fields.TEXTAREA)
      return (
        <>
          {this.renderIfLabel(field)}
          <TextBox {...props} textarea />
        </>
      );

    if (field.fieldType === Fields.HTMLFIELD)
      return (
        <>
          {this.renderIfLabel(field)}
          <TextBox {...props} richtext />
        </>
      );

    return null;
  }

  renderRadioGroup(field = {}) {
    const value = this.state.data[field.name];
    return (
      <>
        {this.renderIfLabel(field)}
        <RadioGroup
          onItemSelected={(data) =>
            this.acceptAndRecordOtherFieldChanges(data, field)
          }
          {...field}
          defaultValue={value}
        />
      </>
    );
  }

  handleEnterKeyPress(e) {
    if (!e) return;
    // "enterkey-to-move-fxnality" should only be used when in multistep
    if (e.charCode === 13 && this.props.multiStep)
      this.moveBackAndForth(FORWARD);
  }
  renderCheckBox(field = {}) {
    const value = this.state.data[field.name];
    if (field.fieldType === Fields.CHECKBOX)
      return (
        <>
          {this.renderIfLabel(field)}
          <CheckBox {...field} defaultValue={value} />
        </>
      );

    if (field.fieldType === Fields.CHECKBOXGROUP)
      return (
        <>
          {this.renderIfLabel(field)}
          <CheckBoxGroup
            onItemSelected={(data) =>
              this.acceptAndRecordOtherFieldChanges(data, field)
            }
            {...field}
            defaultValue={value}
          />
        </>
      );
    return null;
  }

  renderDropDown(field = {}) {
    const value = this.state.data[field.name];
    return (
      <>
        {this.renderIfLabel(field)}
        <div style={{ marginTop: 10 }}>
          <Dropdown
            onItemSelected={(data) =>
              this.acceptAndRecordOtherFieldChanges(data, field)
            }
            {...field}
            defaultValue={value}
          />
        </div>
      </>
    );
  }

  renderUploader(field = {}) {
    return (
      <div style={{ margin: "10px 0px" }}>
        {this.renderIfLabel(field)}
        <FileSelector
          onFileSelected={(data, reset, errors, validationPassed) => {
            var content = data ? { data, errors, validationPassed } : data;
            this.acceptAndRecordOtherFieldChanges(content, field);
            this.setState({
              resetors: { ...this.state.resetors, [field.name]: reset },
            });
          }}
          {...field}
        />
      </div>
    );
  }

  getComponentWithType(field) {
    switch (field.fieldType) {
      case Fields.INPUT:
        return this.renderTextBox(field);
      case Fields.TEXTAREA:
        return this.renderTextBox(field);
      case Fields.HTMLFIELD:
        return this.renderTextBox(field);
      case Fields.RICHTEXT:
        return this.renderTextBox(field);
      case Fields.DROPDOWN:
        return this.renderDropDown(field);
      case Fields.IMAGE:
        return this.renderUploader(field);
      case Fields.FILE:
        return this.renderUploader(field);
      case Fields.CHECKBOX:
        return this.renderCheckBox(field);
      case Fields.CHECKBOXGROUP:
        return this.renderCheckBox(field);
      case Fields.RADIOGROUP:
        return this.renderRadioGroup(field);
      default:
        return <small>No component with such a field type ...</small>;
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { multiStep, fields } = props;
    const stateUpdates = {};
    if (multiStep && !state.currentField && fields && fields[0])
      stateUpdates["currentField"] = { ...fields[0], index: 0 };
    return stateUpdates;
  }

  componentDidMount() {
    this.setState({ data: this.getFieldDefaultsForState() });
  }

  renderNotification(fieldName) {
    const { errors } = this.state;
    const error = errors[fieldName];
    if (!error) return;
    if (error && this.props.multiStep)
      return (
        <p className={"error-label-css"}>
          <FontAwesomeIcon icon={faTimes} style={{ marginRight: 5 }} />
          {error}
        </p>
      );
  }

  /**
   * Takes in changes that happen in a text component and writes them to the state
   * Records all item in relation to the field name given in the field json
   * @param {Event} e
   * @param {object} field
   */
  handleTextFieldChanges(e, field) {
    const { data } = this.state;
    this.setState({ data: { ...data, [field.name]: e.target.value } });
  }
  /**
   * Records changes in components that are not textbox related to the state
   * @param {object} content
   * @param {object} field
   */
  acceptAndRecordOtherFieldChanges(content, field) {
    const { data } = this.state;
    this.setState({ data: { ...data, [field.name]: content } });
  }

  /**
   * The main function that decides which mode the fields should be displayed in
   * from start
   * @start
   * @returns
   */
  renderFormComponents() {
    const { multiStep, fields } = this.props;
    if (!fields || fields.length <= 0)
      return (
        <span>
          Specify fields in <b>array</b> to be displayed as a form
        </span>
      );
    if (multiStep) return this.renderComponentsInMultiStepLayout();
    else return this.renderComponentsInDefaultLayout();
  }

  handleFieldValidation(field, content) {
    if (!field) return { passed: true };
    const { validator, required, isRequired } = field;
    if ((isRequired || required) && !content)
      return { passed: false, message: "This field is required..." };
    if (validator) return validator(content); // validators must always return an obj that returns the state of the validation
    return { passed: true };
  }

  validateFormContent(e, field) {
    if (!field) return;
    const value = this.state.data[field.name];
    const errors = this.state.errors;
    if ((field.required || field.isRequired) && !value) {
      this.setState({
        errors: {
          ...errors,
          [field.name]: "This field is required",
        },
      });
      return false;
    }

    if (field.validator) {
      const validation = field.validator(value);
      if (!validation.passed)
        this.setState({
          errors: {
            ...errors,
            [field.name]: validation.message,
          },
        });
      return false;
    }

    //---- If runtime reaches here,  means all validations passed,
    // Now remove all errors if they exist
    this.setState({ errors: {} });
    return true;
  }
  /**
   * When in multiStep mode, there is no need for validation. All fields are validated before the user is able to
   * move to the next page.
   * In other modes however, validation is done here, and then if all pass, the data is sent to the onsubmit button
   * @param {Event} e
   * @returns
   */
  handleOnSubmit(e) {
    e.preventDefault();
    const { onSubmit, multiStep, fields } = this.props;
    if (!multiStep) {
      // extra field validation on No-Multistep mode
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        const validated = this.validateFormContent(null, field);
        // if any of the items isnt validated, dont go any further
        if (!validated) return;
      }
    }

    if (onSubmit) return onSubmit(this.state.data, this.resetForm);
  }

  /**
   * For many fields, just providing a "null" or "undefined" value
   * is good enough to clear out all the content and reset their value.
   * However, more complex components like ( Image uploader ) provide an in-built function that helps reset them.
   * This reset function is usually stored in the state, and associated with the "name" of the field.
   * Then, in the case of a form reset, this fxn just loops over the resetors if available.
   * So, two things are happening here,
   * set the "data" field of the state object to an empty object to reset the normal components that can be reset by simple "null" values
   * and reset the other complex components by firing their reset functions stored in the state
   * @returns
   */
  resetForm() {
    const { resetors } = this.state;
    this.setState({ data: {} });
    if (!resetors) return;
    Object.keys(resetors).forEach((key) => {
      const reset = resetors[key];
      if (reset) reset();
    });
  }

  renderComponentsInDefaultLayout() {
    const {
      fields,
      rootContainerStyle,
      rootContainerClassName,
      elevation,
    } = this.props;
    return (
      <div
        className={`main-container elevate-${elevation} ${rootContainerClassName}`}
        style={rootContainerStyle}
      >
        <h3>{this.props.title}</h3>
        <p style={{ marginTop: 0 }}>{this.props.subtitle}</p>
        {(fields || []).map((component, index) => (
          <div key={index.toString()}>
            {this.getComponentWithType(component)}
          </div>
        ))}
        <div className={"form-bottom-nav"}>
          <Button style={{ marginLeft: "auto" }} onClick={this.handleOnSubmit}>
            {this.props.formSubmitBtnText}
          </Button>
        </div>
      </div>
    );
  }

  /**
   *
   * Takes in a string param that represents one of two directions => forward or back (predefined constants) and uses  this value
   * to determine whether or not to repopulate the state with either the previous field item
   * or the next field item
   * @param {string} direction
   * @returns
   */
  moveBackAndForth(direction) {
    if (!direction) return;
    const { fields } = this.props;
    const { currentField } = this.state;
    const content = this.state.data[currentField.name];
    const animationKey = Math.random(2348723987293874).toString();
    if (direction === FORWARD) {
      const nextField = fields[currentField.index + 1];

      if (nextField) {
        const validation = this.handleFieldValidation(currentField, content);
        if (validation.passed)
          this.setState({
            currentField: { ...nextField, index: currentField.index + 1 },
            animationKey,
            movementDirection: FORWARD,
          });
        else
          this.setState({
            errors: {
              ...this.state.errors,
              [currentField.name]: validation.message,
            },
            animationKey,
          });
      }
    } else if (direction === BACK) {
      const prevField = fields[currentField.index - 1];
      if (prevField)
        this.setState({
          currentField: { ...prevField, index: currentField.index - 1 },
          animationKey,
          movementDirection: BACK,
        });
    }
  }

  /**
   * Similar to @moveBackAndForth function but implements validation on user's input
   * if a valid function is provided
   * @param {*} e
   */
  handleNextQuestionInMultiForm(e) {
    const { currentField } = this.state;
    const index = currentField.index + 1; // next index
    const nextField = this.props.fields[index];
    if (nextField) this.setState({ currentField: { ...nextField, index } });
  }

  renderComponentsInMultiStepLayout() {
    const { currentField, movementDirection } = this.state;
    const isLastQuestion = currentField.index === this.props.fields.length - 1;
    const isFirstQuestion = currentField.index === 0;
    const { rootContainerClassName, rootContainerStyle } = this.props;
    var animation = "move-up-animation-css";
    if (movementDirection !== null && movementDirection === FORWARD)
      animation = "move-down-animation-css";

    return (
      <div
        className={`multi-step-main-container-css ${rootContainerClassName}`}
        style={rootContainerStyle}
      >
        <div style={{ width: "inherit", position: "relative" }}>
          <div style={{}}>
            <h2 className="form-title">{this.props.title}</h2>
            <h5 style={{ color: "grey" }}>{this.props.subtitle}</h5>
          </div>
          <div className={animation} key={this.state.animationKey}>
            {this.getComponentWithType(currentField)}
            <div
              style={{
                textAlign: "left",
                display: "flex-inline",
                marginTop: 10,
              }}
            >
              {this.renderNotification(currentField.name)}
              <Button
                onClick={(e) => {
                  if (isLastQuestion) this.handleOnSubmit(e);
                  else this.moveBackAndForth(FORWARD);
                }}
                elevation={0}
                style={{ fontSize: 20, marginBottom: 10 }}
              >
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  style={{ marginRight: 6 }}
                />
                {!isLastQuestion ? "OK" : "Submit"}{" "}
              </Button>
              <br />

              {/* {(currentField.fieldType === Fields.INPUT ||
                currentField.fieldType === Fields.TEXTAREA) && (
                <small>
                  Press <b>Cmd or Enter</b>
                </small>
              )} */}
            </div>
          </div>
        </div>
        <div className={"bottom-nav-btns-container"}>
          <small
            className={`page-round-btn-css ${
              isFirstQuestion && "disable-round-btns"
            }`}
            onClick={() => this.moveBackAndForth(BACK)}
          >
            <FontAwesomeIcon icon={faArrowDown} />
          </small>
          <small
            className={`page-round-btn-css ${
              isLastQuestion && "disable-round-btns"
            }`}
            onClick={() => this.moveBackAndForth(FORWARD)}
          >
            <FontAwesomeIcon icon={faArrowUp} />
          </small>
        </div>
      </div>
    );
  }

  // ----------  initialise fields
  getFieldDefaultsForState() {
    const { fields } = this.props;
    if (!fields) return;
    const data = {};
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const defaultValue = field.value || field.defaultValue;
      if (
        field.fieldType === Fields.INPUT ||
        field.fieldType === Fields.TEXTAREA
      )
        data[field.name] = defaultValue || "";
      // just to ensure that an input field is never set to undefined or null
      else data[field.name] = defaultValue;
    }

    return data;
  }

  render() {
    return <div>{this.renderFormComponents()}</div>;
  }
}

FormGenerator.propTypes = {
  /** Title of the form; what this form is about */
  title: PropTypes.string,
  /** Any subtitle of the form that should go with the title */
  subtitle: PropTypes.string,
  /** Array of objects that represent the fields to be rendered */
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
  /** When not in multiStep mode, use this numerical value to  give the form a box-shadow elevation */
  elevation: PropTypes.number,
  /** Css classes for the root container of the  component.  */
  rootContainerClassName: PropTypes.string,
  /** Css inline styles for the roote container of the component */
  rootContainerStyle: PropTypes.object,
  /** Setting this value to true will change the display of the form from a free-falling vertically display to a form that has multiple pages
   * with each field on a different page
   */
  multiStep: PropTypes.bool,
  /** A form button does not always have to use "Submit" as it's text, use this field to change it */
  formSubmitBtnText: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  /** A custom function that provides the content of the form, as well as a function that allows to reset
   * the form.
   * @param data
   * @param formResetor
   * Do with the data as you please
   */
  onSubmit: PropTypes.func.isRequired,
};
FormGenerator.defaultProps = {
  title: "This is the form title bro",
  subtitle: "This is the form subtitle bro...",
  fields: [],
  formSubmitBtnText: "Submit",
  multiStep: false,
  rootContainerClassName: "",
  rootContainerStyle: {},
  elevation: 1,
};
