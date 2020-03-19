import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {addTransactionThunk} from '../store/transactions'
import {updateFundsThunk} from '../store/user'
import {clearStock} from '../store/stock'
import {convertToUSD} from '../utils/conversion'

/**
 * COMPONENT
 */
class TransactionConfirmation extends React.Component {
  constructor() {
    super()
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
    const {
      userId,
      funds,
      stock,
      addTransaction,
      updateFunds,
      clearStockDispatch
    } = this.props
    Promise.all(
      addTransaction(userId, funds, stock),
      updateFunds(userId, funds, stock.totalTransactionPrice)
    )
    clearStockDispatch()
  }

  handleCancel() {
    const {clearStockDispatch} = this.props
    clearStockDispatch()
  }

  render() {
    const {stock, funds} = this.props
    return (
      <form id="transaction-confirmation" onSubmit={this.handleSubmit}>
        <h3>Transaction Details</h3>
        <div id="transaction-details">
          <p>
            Please confirm the following details before submitting your order:
          </p>
          <p>
            {stock.orderType} order for {stock.shareCount} shares of{' '}
            {stock.symbol} @ ${stock.latestPrice} for a total of{' '}
            {convertToUSD(Math.abs(stock.totalTransactionPrice))}
          </p>
          <p>
            New Balance: {convertToUSD(funds - stock.totalTransactionPrice)}
          </p>
        </div>
        <div className="transaction-buttons">
          <button id="confirm-btn" type="submit">
            CONFIRM
          </button>
          <button
            id="cancel-btn"
            type="button"
            onClick={() => this.handleCancel()}
          >
            CANCEL
          </button>
        </div>
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
    stock: state.stock
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addTransaction: (userId, funds, stockDetails) =>
      dispatch(addTransactionThunk(userId, funds, stockDetails)),
    updateFunds: (userId, funds, transactionPrice) =>
      dispatch(updateFundsThunk(userId, funds, transactionPrice)),
    clearStockDispatch: () => dispatch(clearStock())
  }
}

export default connect(mapState, mapDispatchToProps)(TransactionConfirmation)

/**
 * PROP TYPES
 */
TransactionConfirmation.propTypes = {
  userId: PropTypes.number,
  funds: PropTypes.number,
  stock: PropTypes.object
}
