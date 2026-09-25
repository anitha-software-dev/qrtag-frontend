import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
//TODO: do we really need lodash??

class TableBody extends Component {
  renderCell = (item, column) => {
    if (column.content) {
      return column.content(item);
    }

    return _.get(item, column.path);
  };

  createKey = (item, column) => {
    return item.uuid + (column.path || column.key);
  };

  render() {
    const { data, columns } = this.props;

    return (
      <tbody>
        {data.map((item) => (
          <tr key={item.uuid}>
            {columns.map((column) => (
              <td key={this.createKey(item, column)}>
                {this.renderCell(item, column)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }
}

TableBody.propTypes = {
    data: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
}

export default TableBody;
