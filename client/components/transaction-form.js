import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {transactStock} from '../store/stock'
import {Table} from './index'

/**
 * COMPONENT
 */
class TransactionForm extends React.Component {
  constructor() {
    super()
    this.state = {
      quantity: '',
      orderType: 'BUY'
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange() {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit(event) {
    event.preventDefault()
    const {stock, transactStockDispatch} = this.props
    const {quantity, orderType} = this.state
    let stockPriceToCents = stock.latestPrice
    let totalTransactionPrice
    orderType === 'BUY'
      ? (totalTransactionPrice = stockPriceToCents * quantity)
      : (totalTransactionPrice = -(stockPriceToCents * quantity))
    let stockTransactionDetails = {
      symbol: stock.symbol,
      shareCount: quantity,
      orderType: orderType,
      stockPrice: stock.latestPrice,
      totalTransactionPrice: totalTransactionPrice
    }
    transactStockDispatch(stockTransactionDetails)
  }

  formatTableDetails() {
    const {stock} = this.props
    const {quantity, orderType} = this.state
    if (stock.symbol !== undefined && stock.symbol !== null) {
      return [
        [
          stock.symbol,
          stock.latestPrice,
          <select
            onChange={this.handleChange}
            name="orderType"
            value={orderType}
          >
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>,
          <input
            name="quantity"
            type="text"
            placeholder="0"
            value={quantity}
            onChange={this.handleChange}
          />
        ]
      ]
    } else {
      return [[]]
    }
  }

  render() {
    let transactionsTableHeader = ['Symbol', 'Price', 'Order Type', 'Quantity']
    let transactionsTableData = this.formatTableDetails()
    return (
      <form onSubmit={this.handleSubmit}>
        <Table
          tableHeader={transactionsTableHeader}
          tableData={transactionsTableData}
        />
        <button id="submit-btn" type="submit">
          SUBMIT
        </button>
      </form>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    userId: state.user.id,
    funds: state.user.funds,
    portfolio: state.transactions.portfolio,
    stock: state.stock
  }
}

const mapDispatchToProps = dispatch => {
  return {
    transactStockDispatch: stockDetails => dispatch(transactStock(stockDetails))
  }
}

export default connect(mapState, mapDispatchToProps)(TransactionForm)

/**
 * PROP TYPES
 */
TransactionForm.propTypes = {
  userId: PropTypes.number,
  funds: PropTypes.number,
  portfolio: PropTypes.object,
  stock: PropTypes.object
}
