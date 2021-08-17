import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import "./Modal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Button from "../Button/Button";

export default class Modal extends Component {
  static SMALL = "small";
  static MEDIUM = "medium";
  static LARGE = "large";
  constructor(props) {
    super(props);
  }

  state = {
    showModal: false,
  };

  modalDisplay = (e, display) => {
    this.setState({ showModal: display });
  };

  render() {
    const {
      style,
      modalRootStyle,
      modalContainerStyle,
      className,
      size,
      showClose,
      showOverlay,
      title,
      content,
    } = this.props;
    return (
      <div style={{ position: "relative" }}>
        <div>
          <button
            onClick={() => this.setState({ showModal: true })}
            style={{ backgroundColor: "darkblue" }}
          >
            click to show modal
          </button>
        </div>
        <div
          className={`modal-root ${className ?? ""}`}
          style={{
            ...modalRootStyle,
            backgroundColor: `${
              !showOverlay ? "transparent" : "rgba(13,12,14,0.3)"
            }`,
            display: `${this.state.showModal ? "flex" : "none"}`,
          }}
        >
          <div
            className={`modal-container modal-container-${size}`}
            style={{ ...modalContainerStyle }}
          >
            <div className="modal-header">
              <div className="model-title">{title ?? "Modal Title"}</div>
              <div
                className="modal-close-btn"
                style={{ display: `${!showClose ? "none" : "inline-flex"}` }}
                onClick={(e) => this.modalDisplay(e, false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </div>
            </div>
            <div className="modal-content">{content ?? "Modal Content"}</div>
            <div className="modal-btns">
              <Button size={Button.SMALL} theme={Button.DANGER} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  /** additional custom class name */
  className: PropTypes.string,

  /** modal size */
  size: PropTypes.string,
  /** hide or show close button */
  showClose: PropTypes.bool,
  /** show or hide overlay */
  showOverlay: PropTypes.bool,
  /** title of modal */
  title: PropTypes.string,
  /** modal content */
  content: PropTypes.string,

  /** additional custom styling for root of modal */
  modalRootStyle: PropTypes.object,
  /** additional custom styling for modal container */
  modalContainerStyle: PropTypes.object,
};

Modal.defaultProps = {
  size: Modal.SMALL,
  showClose: true,
  showOverlay: true,
  title: "Title this via props",
  content: "Put your content here via props",
  modalRootStyle: {},
  modalContainerStyle: {},
};
