import React, { Component } from "react";
import PropTypes from "prop-types";
import { Editor } from "@tinymce/tinymce-react";
import { createRef } from "react";
export default class RichTextEditor extends Component {
  constructor(props) {
    super(props);
    this.self = createRef();
  }
  handleOnChange = (e) => {
    const { onChange } = this.props;
    if (!onChange) return;
    onChange(e, e.target.getContent());
  };
  render() {
    const {
      containerClassName,
      containerStyle,
      height,
      value,
      defaultValue,
    } = this.props;
    return (
      <div className={containerClassName} style={containerStyle}>
        <Editor
          style={{ background: "blue" }}
          apiKey="80lq3n3m7xebl6kwua0dn00w3ifn3c14odcgsr644hz8o9by" // Will hide this when we get a real api-key for a kehilla account on tinyMCE
          initialValue={value || defaultValue}
          onChange={this.handleOnChange}
          init={{
            statusbar: false,
            height,
            menubar: true,
            plugins: [
              "advlist autolink lists link image charmap print preview anchor",
              "searchreplace visualblocks fullscreen",
              "insertdatetime media table paste help wordcount",
            ],
            toolbar:
              "undo redo | formatselect | " +
              "bold italic backcolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "removeformat | help",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          }}
        />
      </div>
    );
  }
}

RichTextEditor.propTypes = {
  containerClassName: PropTypes.string,
  containerStyle: PropTypes.object,
  height: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
  value: PropTypes.string,
};
RichTextEditor.defaultProps = {
  height: 500,
  containerClassName: "",
  containerStyle: {},
  value: "On your mark, set, type...!",
  defaultValue: "On your mark, set, type...!",
};
