import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  faFileAlt,
  faFilePdf,
  faTimes,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import {
  base64StringtoFile,
  getRandomStringKey,
  stripItemFromArray,
} from "./../../shared/js/utils";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./FileUploader.css";
import {
  DEFAULT_FIELDS,
  SIZE_OUT_OF_BOUNDS,
  FILE_TYPES,
  MEGA,
  KILO,
} from "./Constants";
const { PDF, JPEG, JPG, PNG } = FILE_TYPES;
const IMAGE_TYPES = [JPEG, JPG, PNG];
const OLD_OUTPUT = "K_FILE_UPLOADER_OLD_OUT";
const DB = window.localStorage;
const DEFAULT_CROP_INFO = {
  aspect: 4 / 3,
  unit: "%",
  x: 5,
  y: 5,
};
/**
 * @TODO Extract all the jsx in functions and turn them into functional components
 */

export default class FileUploader extends Component {
  static PNG = PNG;
  static JPEG = JPEG;
  static JPG = JPG;
  static KILO = KILO;
  static MEGA = MEGA;
  static PDF = PDF;
  constructor(props) {
    super(props);
    this.state = {
      previews: [],
      fileInFocus: null,
      selectedFile: null,
      processedFile: null,
      src: null,
      cropMode: false,
      croppedSrc: null,
      crop: DEFAULT_CROP_INFO,
      croppedFiles: [],
      output: undefined, // data that is actually sent outside onFileSelected is stored here
      tempBasket: [], // temporary collection space to gather data before its finally set to output
      files: null, // contains all files that have been selected.
      contentReview: DEFAULT_FIELDS.CONTENT_REVIEW,
    };
    this.cropperRef = null;
    this.fileOpener = React.createRef();
    this.handleOnFileSelected = this.handleOnFileSelected.bind(this);
    this.searchForImage = this.searchForImage.bind(this);
    this.reset = this.reset.bind(this);
    this.finaliseCropping = this.finaliseCropping.bind(this);
    this.onCropComplete = this.onCropComplete.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (state.crop.aspect !== props.ratioWidth / props.ratioHeight) {
      return {
        crop: {
          ...DEFAULT_CROP_INFO,
          aspect: props.ratioWidth / props.ratioHeight,
        },
      };
    }

    return null;
  }

  setNotification = (data) => {
    if (!data) return;
    this.setState((prev) => ({
      contentReview: {
        errors: [...prev.contentReview.errors, data],
        passed: !data,
      },
    }));
  };

  removeNotification = (id) => {
    if (!id) return;
    const { contentReview } = this.state;
    const rem = contentReview.errors.filter((error) => error.id !== id);
    this.setState({ contentReview: { ...contentReview, errors: rem } });
  };
  /**
   * Activates the invisible file selector
   * For a user to select an image
   * @param {*} e
   * @returns
   */
  searchForImage(e) {
    e.preventDefault();
    this.fileOpener.current.click();
    return false;
  }

  /**
   * Creates a new image with fixed dimensions based an image element
   * whose src is already set.
   * @param {Element} img
   * @returns base64String data
   */
  drawAnImage(img = new Image()) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = img.width > 300 ? 300 : img.width;
    canvas.height = canvas.width * (img.height / img.width);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const data = canvas.toDataURL("image/jpeg");
    return data;
  }

  /**
   * Removes selected image and clears out state fields that
   * have values related to the user's selected image.
   * Also passes a null value as @data to the @onFileSelected function
   * This function is also passed outside in order to enable components outside of this component
   * To reset the whole image selection process
   * @param {*} e
   */
  reset(e) {
    if (e) e.preventDefault();
    const { onFileSelected } = this.props;
    this.setState({
      selectedFile: null,
      src: null,
      processedFile: null,
      croppedSrc: null,
      files: [],
      previews: [],
      srcId: null,
      output: undefined,
      oldOutputState: undefined,
      croppedFiles: [],
      contentReview: DEFAULT_FIELDS.CONTENT_REVIEW,
    });
    window.localStorage.removeItem(OLD_OUTPUT);

    if (onFileSelected) onFileSelected(null, this.reset);
  }

  /**
   * Reads the content of the selected file
   * and sets a viewable base64 string version and the related file object to the state

   * @param {object} file
   */
  async putImageInFocus(file, params = {}, stateValueName = "src") {
    if (!file) return;
    var src = file;
    if (typeof file !== "string")
      src = await this.readContentOfSelectedFile(file);
    this.setState({ [stateValueName]: src, ...params });
  }

  /**
   * Reads the content of an image file object
   * and returns its value in a promise
   * @param {*} file
   * @returns {Promise <base64String>}
   */
  readContentOfSelectedFile(file, cb) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (cb) cb(reader.result);
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Takes in an array of selected files,
   * Read files asynchronously and sets them to the state to the state to
   * Be used as previews
   * @param {*} files
   */
  handleImageSelectionForPreview(files, identifier = "") {
    const { multiple } = this.props;
    Object.keys(files).map(async (key) => {
      const file = files[key];
      const id = file.name + identifier;
      var src;
      if (IMAGE_TYPES.includes(file.type))
        src = await this.readContentOfSelectedFile(file);

      this.setState((prevState) => ({
        previews: [
          { file, src, id },
          ...(!multiple ? [] : [...prevState.previews]),
        ],
      }));
    });
  }
  /**
   * Fires initial processing functions
   * Processes files for preview
   * Processes files to be sent as output
   * @param {*} e
   * @returns
   */
  handleOnFileSelected(e) {
    e.preventDefault();
    const theFiles = e.target.files;
    if (!theFiles || theFiles.length < 1) return;
    const file = theFiles[0];
    const identifier = "-image-id-" + getRandomStringKey();
    this.setState({
      selectedFile: file,
      srcId: file.name + identifier,
    });
    this.putImageInFocus(file);
    this.setState({ files: theFiles });
    this.handleImageSelectionForPreview(theFiles, identifier);
    // collect all files and compress if necessary then ship them here
    this.processFilesAndSetToOutput(theFiles, identifier);
  }
  /**
   * Renders the default state of the file selector.
   * No image selected
   * @returns
   */
  renderDefaultUntouchedState() {
    return (
      <>
        <center>
          <span onClick={this.searchForImage}>
            <FontAwesomeIcon icon={faUpload} className={"uploader-icon"} />
          </span>
          <p style={{}}>Select An Image To Upload</p>
        </center>
      </>
    );
  }
  /**
   * Uses the state object & props to determine which elements to
   * show
   * untouched state, preview mode or cropping mode
   * @returns
   */
  renderDifferentUploaderStates() {
    const { selectedFile, src, cropMode, croppedSrc } = this.state;
    if ((this.props.defaultValue || this.props.value) && !croppedSrc && !src)
      return this.showImagePreviewFromExternalSource();
    if (cropMode) return this.renderCroppingMode();
    if (croppedSrc || src) return this.renderPreviewMode();
    if (!selectedFile) return this.renderDefaultUntouchedState();
  }

  /**
   * Loads an image from an external source incase an image link is provided as default value
   * on load
   * @returns
   */
  showImagePreviewFromExternalSource() {
    return (
      <>
        <center>
          <img
            src={this.props.defaultValue || this.props.value}
            alt="selected media"
            className={"uploader-preview-img"}
            onClick={this.searchForImage}
          />
          <br />
          <small>
            Loaded image from external source, as default image. Click to change
          </small>
        </center>
      </>
    );
  }

  getPreviewDisplay(params) {
    const { type, src } = params;
    if (IMAGE_TYPES.includes(type))
      return (
        <img
          src={src}
          alt="selected media"
          className={"uploader-preview-img"}
          onClick={this.searchForImage}
        />
      );

    if (type === PDF)
      return (
        <div className="pdf-preview-box " onClick={this.searchForImage}>
          {" "}
          <FontAwesomeIcon icon={faFilePdf} />
        </div>
      );

    return (
      <div className="pdf-preview-box " onClick={this.searchForImage}>
        {" "}
        <FontAwesomeIcon icon={faFileAlt} />
      </div>
    );
  }
  /**
   * Given a numberical value, theis function checks if the value exceeds the limit
   * of the set maximum file limit of the uploader
   * @param {Number} size
   * @returns {Boolean}
   */

  fileIsWithinLimits(size) {
    return size <= this.props.maxSize * MEGA;
  }
  /**
   * Renders the preview image
   * with tools to allow the user crop their selected image
   * @returns
   */
  renderPreviewMode() {
    const { allowCrop } = this.props;
    const file = this.state.selectedFile;
    const size = this.getFileSize(file);
    const [croppedFile, compressedFile] = this.getDifferentVersionOfFile(
      this.state.srcId
    );
    const imageSizeIsOk = this.fileIsWithinLimits(file.size);
    const isAnImage = IMAGE_TYPES.includes(file && file.type);
    return (
      <>
        <center>
          <div>
            <small>
              {" "}
              A preview of your image, click the photo to change <br />
              <a
                href="#void"
                onClick={this.searchForImage}
                className="link-btn"
              >
                {this.props.multiple ? "Add" : "Select New"}
              </a>
              <a href="#void" onClick={this.reset} className="link-btn">
                {this.props.multiple &&
                this.state.files &&
                this.state.files.length > 1
                  ? "Remove All"
                  : "Remove"}
              </a>
              {allowCrop && isAnImage && (
                <>
                  <a
                    className="link-btn"
                    href="#void"
                    onClick={(e) => {
                      e.preventDefault();
                      this.setState({ cropMode: true });
                    }}
                    style={{ marginLeft: 7 }}
                  >
                    {croppedFile ? "Re-crop" : "Crop"}
                  </a>
                  {croppedFile && (
                    <a
                      className="link-btn"
                      href="#void"
                      onClick={(e) => {
                        e.preventDefault();
                        this.undoCropping(this.state.srcId);
                      }}
                      style={{ marginLeft: 7 }}
                    >
                      Undo-cropping
                    </a>
                  )}
                </>
              )}
            </small>
          </div>
          {/* ------- PREVIEW IMAGE IN DISPLAY ----------------- */}
          {this.getPreviewDisplay({
            type: this.state.selectedFile.type,
            src: this.state.src,
          })}
          {/* --------------------------------------------------- */}
          <br />
          <small>
            File Name:{" "}
            <span style={{ color: "green", fontWeight: "bold" }}>
              {this.state.selectedFile && this.state.selectedFile.name}
            </span>
          </small>
          <br />
          <small>
            <span>
              Max Size:{" "}
              <span style={{ color: "green" }}>
                <b>{this.props.maxSize + " Mbs  " || "..."}</b>
              </span>
            </span>
          </small>
          <small>
            <span style={{}}>
              File Size:{" "}
              <span style={{ color: imageSizeIsOk ? "green" : "maroon" }}>
                <b>{size}</b>
              </span>
            </span>{" "}
          </small>
          <br />
          {croppedFile && (
            <small>
              <span style={{}}>
                Cropped File Size:{" "}
                <span style={{ color: "green" }}>
                  <b>{croppedFile.size.text}</b>
                </span>
              </span>{" "}
            </small>
          )}

          {compressedFile && this.props.compress && (
            <small>
              <span style={{}}>
                Compressed File Size:{" "}
                <span style={{ color: "green" }}>
                  <b>{compressedFile.size.text}</b>
                </span>
              </span>{" "}
            </small>
          )}
          <br />
        </center>
      </>
    );
  }
  /**
   * Handles removing one of the list of selected images
   * and replacing the item in focus if needed
   * A few places to remove item from ( preview, output, tempBasket, contentReview.errors)
   * @param {*} id
   * @returns
   */
  removePreviewImage(id) {
    const { previews, srcId, tempBasket } = this.state;
    var rem = previews.filter((item) => item.id !== id);
    var tempRem = tempBasket.filter((item) => item.id !== id); //
    if (rem.length === 0) this.reset();
    // just in case the preview item the user is about to remove is the one in display,
    // choose another preview item on the list to show
    this.setState({ previews: rem, tempBasket: tempRem });
    if (srcId === id) {
      //get the first item in the array
      const firstItem = rem[0] || {};
      this.putImageInFocus(firstItem.src, {
        selectedFile: firstItem.file,
        srcId: firstItem.id,
      });
    }
    this.removeFromOutput(id);
  }

  /**
   * When an item is removed from the preview list, this function
   * makes sure to reflect the changes in the output content ready to be shipped out
   * @param {*} id of just removed item.
   * @returns
   */
  removeFromOutput(id) {
    var { output } = this.state;
    if (!output) return;
    this.removeNotification(id);
    if (this.props.multiple) {
      var rem = output.filter((item) => item.id !== id);
      return this.setState({ output: rem });
    }

    this.reset();
  }

  /**
   * Given an id, the function retrieves all versions of an original file
   * Whether cropped, or compressed
   * @param {String} id  of selected image file
   * @returns {Array} Array of [cropped, compressed]
   */
  getDifferentVersionOfFile(id) {
    const { output } = this.state;
    if (!output) return [];
    if (!this.props.multiple) return [output.cropped, output.compressed];
    const file = output.filter((item) => item.id === id)[0];
    if (file) return [file.cropped, file.compressed];
    return [];
  }

  getThumbnailDisplay(params) {
    const { type, image, cropped, data } = params;

    if (IMAGE_TYPES.includes(type))
      return (
        <div style={{ position: "relative", margin: 6 }} key={image.id}>
          <span
            className="thumb-close"
            onClick={() => this.removePreviewImage(image.id)}
          >
            <FontAwesomeIcon icon={faTimes} />
          </span>

          <img
            onClick={() =>
              this.putImageInFocus(image.src, {
                selectedFile: image.file,
                srcId: image.id,
              })
            }
            src={image.src}
            className="thumbnail-img"
          />
          {cropped && <img src={cropped.src} className="thumbnail-img-baby" />}
        </div>
      );

    if (type === PDF)
      return (
        <div
          className="thumbnail-pdf-box"
          onClick={() =>
            this.putImageInFocus("No-Source", {
              selectedFile: data.file,
              srcId: data.id,
            })
          }
        >
          <FontAwesomeIcon icon={faFilePdf} />
        </div>
      );

    return (
      <div
        className="thumbnail-pdf-box"
        onClick={() =>
          this.putImageInFocus("No-Source", {
            selectedFile: data.file,
            srcId: data.id,
          })
        }
      >
        <FontAwesomeIcon icon={faFileAlt} />
      </div>
    );
  }
  /**
   * Renders preview of all selected items as tiny thumbnail images
   * horizontally at the bottom of the uploader
   * @TODO modify this div to act as a horizontal corousel when a lot of images are slected
   * @returns
   */
  renderThumbnailsInMultipleMode() {
    const { previews, files, cropMode } = this.state;
    if (!files || !previews || cropMode) return;
    return (
      <div className="thumbnail-area">
        {previews.map((image) => {
          const [cropped] = this.getDifferentVersionOfFile(image.id);
          return (
            <div style={{ position: "relative", margin: 6 }} key={image.id}>
              {this.getThumbnailDisplay({
                type: image.file.type,
                image,
                cropped,
                data: image,
              })}
            </div>
          );
        })}
      </div>
    );
  }

  readyNonImageFilesForShipment(file) {
    var content = {};
    content = {
      ...content,
      file: {
        data: file,
        size: { text: this.getFileSize(file), value: file && file.size },
      },
      _file: file,
    };

    return content;
  }

  /**
   * Given a file, this function collects other related file objects and fixes them
   * into one collection of related files. (original, compressed, etc)
   * @param {Object} file
   * @returns
   */
  async readyFileForShipment(file) {
    const { compress } = this.props;
    var compressed;
    var content = {};
    content = {
      ...content,
      file: {
        data: file,
        size: { text: this.getFileSize(file), value: file && file.size },
      },
      _file: file,
    };

    if (compress && IMAGE_TYPES.includes(file.type)) {
      const baseString = await this.readContentOfSelectedFile(file);
      const img = new Image();
      img.src = baseString;
      const newCompressedImage = this.drawAnImage(img);
      compressed = base64StringtoFile(newCompressedImage, file.name);
      content = {
        ...content,
        compressed: {
          data: compressed,
          src: baseString,
          size: {
            text: this.getFileSize(compressed),
            value: compressed.size,
          },
        },
      };
      return content;
    }
  }

  readyFileForShipmentSync(file) {
    var content = {};
    content = {
      ...content,
      file: {
        data: file,
        size: { text: this.getFileSize(file), value: file && file.size },
      },
      _file: file,
    };

    return content;
  }

  /**
   * Goes over the file(s), checks and processes with the appropriate functions
   * Puts everything together, and sets the final content to the "output" field of the state
   * to be shipped
   * @param {*} files
   * @param {String} identifier
   * @returns {Object}
   */
  async processFilesAndSetToOutput(files, identifier = "") {
    const { onFileSelected, multiple, compress } = this.props;
    if (!onFileSelected || !files) return;
    var val, isAnImage;
    if (multiple) {
      Object.keys(files).forEach(async (key, index) => {
        const file = files[key];
        const id = file.name + identifier;
        isAnImage = IMAGE_TYPES.includes(file.type);
        if (isAnImage) {
          if (compress) val = await this.readyFileForShipment(file);
          // Run a non async function when the file does not need compression
          else val = this.readyFileForShipmentSync(file);
        } else val = this.readyNonImageFilesForShipment(file);
        val = { ...val, id };
        const notLastItem = index !== files.length - 1;
        const imageSizeIsOk = this.fileIsWithinLimits(file.size);
        if (!imageSizeIsOk)
          this.setNotification({ message: SIZE_OUT_OF_BOUNDS.file, id });
        if (notLastItem)
          this.setState((prevState) => ({
            tempBasket: [...prevState.tempBasket, val],
          }));
        else {
          var output;
          if (multiple) output = [...this.state.tempBasket, val];
          else output = val;
          this.setState({ output, tempBasket: output });
        }
      });
    } else {
      const file = files[0];
      isAnImage = IMAGE_TYPES.includes(file.type);
      if (isAnImage) {
        if (compress) val = await this.readyFileForShipment(file);
        // Run a non async function when the file does not need compression
        else val = this.readyFileForShipmentSync(file);
      } else val = this.readyNonImageFilesForShipment(file);
      const id = file.name + identifier;
      const imageSizeIsOk = this.fileIsWithinLimits(file.size);
      if (!imageSizeIsOk)
        this.setNotification({ message: SIZE_OUT_OF_BOUNDS.file, id });
      this.setState({ output: { ...val, id } });
    }
  }

  /**
   * Checks if anything has changed in the selected files
   * and ships via onFileSelected
   * @returns
   */
  sendOutputWhenReady() {
    const { output, contentReview } = this.state;
    const { onFileSelected } = this.props;
    const oldOutputState = DB.getItem(OLD_OUTPUT); // Uses local storage to store old state so that there is no need to update state in render()
    if (output === undefined || !onFileSelected) return;
    if (output === null) {
      onFileSelected(
        null,
        this.reset,
        contentReview.errors,
        contentReview.passed
      );
      DB.setItem(OLD_OUTPUT, null);
    }
    var outputObjString = this.generateOutputString(output);
    if (outputObjString !== oldOutputState) {
      onFileSelected(
        output,
        this.reset,
        contentReview.errors,
        contentReview.passed
      );

      DB.setItem(OLD_OUTPUT, outputObjString);
    }
  }

  generateOutputString(output) {
    const { multiple } = this.props;
    if (!multiple) return output.id;
    const arr = [];
    output.forEach((content) => arr.push(content.id));
    return arr.toString();
  }
  /**
   * Renders the cropping state of the uploader
   * @returns
   */
  renderCroppingMode() {
    const { src, crop } = this.state;
    const { maxHeight, maxWidth } = this.props;
    return (
      <center>
        <p>Hold and drag your cursor over the parts you wish to use</p>
        <div style={{ margin: 15 }}>
          <a
            className="link-btn"
            href="#void"
            onClick={(e) => {
              e.preventDefault();
              this.finaliseCropping();
            }}
          >
            Complete Cropping
          </a>
          <a
            className="link-btn"
            href="#void"
            style={{ marginLeft: 6 }}
            onClick={(e) => {
              e.preventDefault();
              this.setState({ cropMode: false });
            }}
          >
            Cancel
          </a>
        </div>
        <div>
          <ReactCrop
            src={src}
            crop={crop}
            onImageLoaded={(ref) => (this.cropperRef = ref)}
            onComplete={this.onCropComplete}
            onChange={(newCrop) => this.whenCropChanges(newCrop)}
            maxWidth={maxWidth}
            maxHeight={maxHeight}
            style={{ maxHeight, maxWidth }}
          />
        </div>
        <br />
      </center>
    );
  }

  /**
   * Joins list of accepted file type extensions into
   * the single string method HTML understands
   * @returns
   */
  getAcceptedFileTypes() {
    const { accepts, accept } = this.props;
    if (!accepts && !accept) return {};
    return { accept: (accepts || accept).join(", ") };
  }

  allowMultiple() {
    const { multiple } = this.props;
    if (multiple) return { multiple: true };
    return {};
  }
  render() {
    this.sendOutputWhenReady();
    return (
      <div className={`uploader-container`}>
        <input
          type="file"
          ref={this.fileOpener}
          style={{ display: "none" }}
          onChange={this.handleOnFileSelected}
          {...this.getAcceptedFileTypes()}
          {...this.allowMultiple()}
        />
        {this.renderDifferentUploaderStates()}
        {this.renderThumbnailsInMultipleMode()}
      </div>
    );
  }

  /**
   * Removes the cropped version of a file
   * @param {String} id
   */
  undoCropping(id) {
    const { output } = this.state;
    var parentFile, rest;
    if (this.props.multiple) {
      [parentFile, rest] = stripItemFromArray(id, "id", output);
      delete parentFile.cropped;
      this.setState({ output: [...rest, parentFile] });
    }
    parentFile = output;
    delete parentFile.cropped;
    this.setState({ output: parentFile });
  }

  /**
   * Fired when user finalises cropping.
   * The funtion deactivates crop mode, and ships the newly recreated image
   * based on the crop dimensions
   * NB: This function is not what does the cropping. By the time this function runs, cropping would already be done
   *
   * @returns
   */
  finaliseCropping() {
    const { onFileSelected, multiple } = this.props;
    if (!onFileSelected) return;
    const { croppedFile, output, srcId, croppedSrc } = this.state;
    var rest = [],
      parentFile = output;
    if (multiple) [parentFile, rest] = stripItemFromArray(srcId, "id", output);
    if (!parentFile)
      return console.error(
        "The file you just cropped does not have a parent file"
      );

    parentFile.cropped = {
      data: croppedFile,
      src: croppedSrc,
      id: srcId,
      size: { text: this.getFileSize(croppedFile), value: croppedFile.size },
    };
    this.setState({
      output: multiple ? [...rest, parentFile] : parentFile,
      cropMode: false,
    });
  }

  /**
   * Just a function the updates the new crop size frame that
   * the user has specified
   * @param {object} crop
   */
  whenCropChanges = (crop) => {
    this.setState({ crop });
  };

  /**
   * Collects the crop dimensions that a user has marked
   * and checks for requirement then passes it to @getCroppedImg
   * for a new image to be drawn
   * @param {object} crop
   */
  onCropComplete(crop) {
    if (this.cropperRef && crop.width && crop.height) {
      const filename = this.state.selectedFile && this.state.selectedFile.name;
      const [croppedImageUrl, croppedFile] = this.getCroppedImg(
        this.cropperRef,
        crop,
        filename || "newCroppedFile.jpeg"
      );
      this.setState({ croppedSrc: croppedImageUrl, croppedFile });
    }
  }
  /**
   * Uses crop dimensions as blue print to create a canvas that
   * draws the preferred area of the image after crop
   *
   * @param {HTMLImageElement} image -
   * @param {Object} crop - crop dimensional object
   * @param {String} fileName - Name of the returned file in Promise
   * @returns {Array} Return an a array with base64 string  and an image file object, based on a crop frame
   */
  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
    // As Base64 string
    const base64Image = canvas.toDataURL("image/jpeg");
    const newCroppedFileObject = base64StringtoFile(base64Image, fileName);
    return [base64Image, newCroppedFileObject];
  }
  /**
   * Calculates and returns a user friendly numerical value that represents
   * The size of the Image File Object provided as a parameter
   * @param {File} file
   * @returns {Number} file size
   */
  getFileSize(file) {
    if (!file) return "";

    var size = file.size;
    // var unit = size < MEGA ? "KB" : "MB";
    if (size < MEGA) return Math.round(size / KILO).toString() + " KB";
    return Math.round(size / MEGA).toString() + " MB";
  }
}

FileUploader.propTypes = {
  /** Will enable cropping functionalities when set to true */
  allowCrop: PropTypes.bool,
  /** Will include a compressed version of the selected image if selected to true */
  compress: PropTypes.bool,
  /** A link, or an object that should prefil the uploader on start */
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  /** A link, or an object that should prefil the uploader on start */
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  /** Width of aspect ratio */
  ratioWidth: PropTypes.number,
  /** Height of aspect ratio */
  ratioHeight: PropTypes.number,
  /** Maximum allowed width  the crop frame if cropping is allowed  */
  maxWidth: PropTypes.number,
  /** Maximum allowed height of the crop frame if cropping is allowed */
  maxHeight: PropTypes.number,
  /** Provides ( data ,reset, errors, validationPassed ) that corresponds to latest changes based on selected image, cropping, and compression whenever any happen. A reset function
   * is added to enable outside components to reset the ImageSelector
   * @param data
   * @param reset
   * @param errors
   * @param validationPassed
   */
  onFileSelected: PropTypes.func.isRequired,
  /** Specify accepted file types in an array. Eg. ["image/png", "image/gif"]. Can be "accepts" or "accept" */
  accepts: PropTypes.arrayOf(PropTypes.string),
  /** Specifies the file size limit of the user's selected media in Megabytes */
  maxSize: PropTypes.number,
  /** Allow multiple files to be selected and uploaded */
  multiple: PropTypes.bool,
};
FileUploader.defaultProps = {
  allowCrop: false,
  compress: false,
  defaultValue: null,
  ratioWidth: 4,
  ratioHeight: 3,
  maxHeight: 400,
  maxWidth: 400,
  accepts: ["image/jpg", "image/png", "image/jpeg", "application/pdf"],
  maxSize: 2,
  multiple: false,
};
