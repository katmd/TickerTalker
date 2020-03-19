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
    let targetName = event.target.name
    let targetValue = event.target.value
    // check if number of shares is a positive whole number, if not, return error immediately
    if (targetName === 'quantity' && !Number.isInteger(+targetValue)) {
      this.setState({
        errorMessage:
          'ERROR: Orders can only be placed on positive, whole numbers of shares'
      })
      return
    } else {
      this.setState({
        errorMessage: null
      })
    }
    this.setState({
      [targetName]: targetValue
    })
  }

  handleSubmit(event) {
    event.preventDefault()
    const {stock, funds, portfolio, transactStockDispatch} = this.props
    const {quantity, orderType} = this.state

    /* submitting form will compare the stock's current value and selected quantity to a user's available funds and, if selling, their total number of stocks under the same symbol */

    // portfolio stats for current stock if in portfolio
    let portfolioShareCount = 0
    if (portfolio[stock.symbol] !== undefined) {
      portfolioShareCount = portfolio[stock.symbol].shareCount
    }

    // transaction details
    let transactionShareCount = parseInt(quantity, 10)
    let stockPrice = stock.latestPrice
    let totalTransactionPrice
    orderType === 'BUY'
      ? (totalTransactionPrice = stockPrice * quantity)
      : (totalTransactionPrice = -(stockPrice * quantity))
    let stockTransactionDetails = {
      symbol: stock.symbol,
      shareCount: transactionShareCount,
      orderType: orderType,
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

    // check if submission is valid
    if (newFunds <= 0) {
      this.setState({errorMessage: 'ERROR: Insufficient funds for transaction'})
    } else if (newShareCount <= 0) {
      this.setState({
        errorMessage: 'ERROR: Insufficient shares for transaction'
      })
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
          <div>
            <input
              name="quantity"
              type="text"
              placeholder="0"
              value={quantity}
              onChange={this.handleChange}
              required
            />
          </div>
        ]
      ]
    } else {
      return [[]]
    }
  }

  render() {
    let transactionsTableHeader = ['Symbol', 'Price', 'Order Type', 'Quantity']
    let transactionsTableData = this.formatTableDetails()
    const {stock, portfolio} = this.props
    const {orderType, errorMessage} = this.state
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
        {/* if available, show user how many stocks they have to sell */}
        {orderType === 'SELL' &&
          portfolio[stock.symbol] && (
            <p>
              You have {portfolio[stock.symbol].shareCount} shares of{' '}
              {stock.symbol} available
            </p>
          )}
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
