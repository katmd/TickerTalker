import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {addTransactionThunk, getTransactionsThunk} from '../store/transactions'
import {convertCentsToUSD} from '../utils/portfolio'
import {SearchStock} from './index'

/**
 * COMPONENT
 */
class Order extends React.Component {
  componentDidMount() {
    const {userId, getTransactions} = this.props
    getTransactions(userId)
  }

  handleSearchError() {
    const {stock} = this.props
    if (stock.symbol === null) {
      return 'Symbol is invalid, please try your search again'
    } else {
      return null
    }
  }

  render() {
    const {funds, stock} = this.props
    let searchErrorMessage = this.handleSearchError()
    return (
      <div>
        <h1 className="page-header">Order</h1>
        <div className="portfolio-metrics">
          <h2>Cash Funds - {convertCentsToUSD(funds)}</h2>
        </div>
        <SearchStock stock={stock} errorMessage={searchErrorMessage} />
      </div>
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
    addTransaction: (userId, stockDetails) =>
      dispatch(addTransactionThunk(userId, stockDetails)),
    getTransactions: userId => dispatch(getTransactionsThunk(userId))
  }
}

export default connect(mapState, mapDispatchToProps)(Order)

/**
 * PROP TYPES
 */
Order.propTypes = {
  userId: PropTypes.number,
  portfolio: PropTypes.object,
  stock: PropTypes.object
}
