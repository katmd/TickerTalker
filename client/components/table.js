import React from 'react'

export default class Table extends React.Component {
  constructor(props) {
    super()
    this.props = props
    this.tableHeader = props.tableHeader
    this.tableData = props.tableData
    this.getTableHeader = this.getTableHeader.bind(this)
    this.getTableData = this.getTableData.bind(this)
  }

  getTableHeader() {
    return this.props.tableHeader.map((key, idx) => {
      return <th key={idx}>{key}</th>
    })
  }

  getTableData() {
    return this.props.tableData.map((dataRow, idx) => {
      // file data into table elements
      return (
        <tr key={idx}>
          {dataRow.map((dataPoint, dpIdx) => {
            return <td key={dpIdx}>{dataPoint}</td>
          })}
        </tr>
      )
    })
  }

  render() {
    return (
      <div className="table-container">
        <table id="table">
          <tbody>
            <tr>{this.getTableHeader()}</tr>
            {this.getTableData()}
          </tbody>
        </table>
      </div>
    )
  }
}
