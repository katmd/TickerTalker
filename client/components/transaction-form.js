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
      orderType: 'BUY',
      errorMessage: null
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
    const {stock, funds, portfolio, transactStockDispatch} = this.props
    const {quantity, orderType} = this.state

    // portfolio stats for current stock if in portfolio
    let portfolioShareCount = 0
    if (portfolio[stock.symbol] !== undefined) {
      portfolioShareCount = portfolio[stock.symbol].shareCount
    }

    // transaction details
    let transactionShareCount = parseInt(quantity, 10)
    let stockPriceToCents = stock.latestPrice
    let totalTransactionPrice
    orderType === 'BUY'
      ? (totalTransactionPrice = stockPriceToCents * quantity)
      : (totalTransactionPrice = -(stockPriceToCents * quantity))
    let stockTransactionDetails = {
      symbol: stock.symbol,
      shareCount: transactionShareCount,
      orderType: orderType,
      stockPrice: stock.latestPrice,
      totalTransactionPrice: totalTransactionPrice
    }

    // transaction results
    let newFunds = funds - stockTransactionDetails.totalTransactionPrice
    let newShareCount
    orderType === 'BUY'
      ? (newShareCount =
          portfolioShareCount + stockTransactionDetails.shareCount)
      : (newShareCount =
          portfolioShareCount - stockTransactionDetails.shareCount)

    if (newFunds <= 0) {
      this.setState({errorMessage: 'Insufficient funds for transaction'})
    } else if (newShareCount <= 0) {
      this.setState({errorMessage: 'Insufficient shares for transaction'})
    } else {
      this.setState({errorMessage: null})
      transactStockDispatch(stockTransactionDetails)
    }
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
    const {errorMessage} = this.state
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <Table
            tableHeader={transactionsTableHeader}
            tableData={transactionsTableData}
          />
          <button id="submit-btn" type="submit">
            SUBMIT
          </button>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    funds: state.user.funds,
    stock: state.stock,
    portfolio: state.transactions.portfolio
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
  funds: PropTypes.number,
  stock: PropTypes.object,
  portfolio: PropTypes.object
}
