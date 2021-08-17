import React, { Component } from "react";
import PropTypes from "prop-types";
import "./Table.css";
import { TABLE_DATA, TABLE_COLUMNS } from "./dummy";
import * as TableConstants from "./TableConstants";
// import Spinner from "./../Spinner/Spinner";
const { LIGHT, CHECKERED } = TableConstants;

export default class Table extends Component {
  static LIGHT = LIGHT;
  static CHECKERED = CHECKERED;

  render() {
    const { theme, columns, data, hoverAnimation } = this.props;

    return (
      <div>
        <table
          className={`${theme} ${hoverAnimation ? "hover-animation" : ""}`}
        >
          <thead>
            {columns
              ? columns.map((head, index) => <th key={index}>{head}</th>)
              : ""}
          </thead>
          <tbody>
            {data
              ? data.map((data, index) => (
                  <tr key={index}>
                    {data.slice(0, columns?.length).map((dat) => (
                      <td>{dat}</td>
                    ))}
                  </tr>
                ))
              : ""}
          </tbody>
        </table>
      </div>
    );
  }
}

Table.propTypes = {
  /** table theme */
  theme: PropTypes.string,

  /** should table rows animate when hovered */
  hoverAnimation: PropTypes.bool,
  /** table columns */
  columns: PropTypes.array,
  /** table data */
  data: PropTypes.array,
};

Table.defaultProps = {
  hoverAnimation: true,
  theme: Table.LIGHT,
  columns: TABLE_COLUMNS,
  data: TABLE_DATA,
};
