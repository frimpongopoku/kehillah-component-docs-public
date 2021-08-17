import React, { Component } from "react";
import PropTypes from "prop-types";
import "./Textbox.css";
import RichTextEditor from "./RichTextEditor";
/**
 *
 * Modified Input/TextArea
 */
export default class TextBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: undefined,
    };
    this.handleOnChange = this.handleOnChange.bind(this);
  }
  handleOnChange(e) {
    const { onChange } = this.props;
    this.setState({
      value: e.target.value,
    });
    if (!onChange) return;
    onChange(e, e.target.value);
  }
  static getDerivedStateFromProps(props, state) {
    if (state.value === undefined && (props.value || props.defaultValue))
      return { value: props.value || props.defaultValue };

    return null;
  }

  render() {
    const { textarea, rich, richtext } = this.props;
    if (rich || richtext) return <RichTextEditor {...this.props} />;
    if (textarea)
      return (
        <TextAreaComponent
          {...this.props}
          value={this.state.value}
          onChange={this.handleOnChange}
        />
      );
    return (
      <InputBoxComponent
        {...this.props}
        value={this.state.value}
        onChange={this.handleOnChange}
      />
    );
  }
}
TextBox.defaultProps = {
  placeholder: "Enter text...",
  containerStyle: {},
  containerClassName: "",
  className: "",
  style: {},
  _generics: {},
  textarea: false,
  rich: false,
  richtext: false,
  defaultValue: "",
  value: "",
};
TextBox.propTypes = {
  /** A function that will receive all keystrokes of the textbox */
  onChange: PropTypes.func,
  /** Inline style for the root container of the entire textbox */
  containerStyle: PropTypes.object,
  /** Classnames for the root container of the entire textbox */
  containerClassName: PropTypes.string,
  /** Inline style for input textbox element itself */
  style: PropTypes.object,
  /** Classnames for the input textbox element itself */
  className: PropTypes.string,
  /** Placeholder text */
  placeholder: PropTypes.string,
  /** Properties of normal HTML input boxes that are used but have not been targeted by the custom defined props Eg. required, max, min, onKeyDown etc */
  __HTML_DEFAULTS: PropTypes.object,
  /** An indicator that an HTML textarea should be shown instead of a normal input */
  textarea: PropTypes.bool,
  /** If set to true, textbox will be a rich text editor */
  rich: PropTypes.bool,
  /** If set to true, textbox will be a rich text editor */
  richtext: PropTypes.bool,
  /** Default value that the textbox should have */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.string]),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.string]),
};

export const InputBoxComponent = (props) => {
  const {
    placeholder,
    style,
    className,
    __HTML_DEFAULTS,
    onChange,
    containerClassName,
    containerStyle,
    value,
  } = props;
  return (
    <div style={containerStyle} className={containerClassName}>
      <input
        onChange={onChange}
        style={style}
        className={`textbox input ${className}`}
        placeholder={placeholder}
        value={value ?? ""}
        {...__HTML_DEFAULTS}
      />
    </div>
  );
};

export const TextAreaComponent = (props) => {
  const {
    placeholder,
    style,
    className,
    __HTML_DEFAULTS,
    onChange,
    containerStyle,
    containerClassName,
    value,
  } = props;
  return (
    <div style={containerStyle} className={containerClassName}>
      <textarea
        style={style}
        className={`textbox textarea ${className}`}
        onChange={onChange}
        placeholder={placeholder}
        value={value ?? ""}
        rows={7}
        {...__HTML_DEFAULTS}
      ></textarea>
    </div>
  );
};
