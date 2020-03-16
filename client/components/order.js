import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {addTransactionThunk, getTransactionsThunk} from '../store/transactions'
import {convertCentsToUSD} from '../utils/portfolio'

/**
 * COMPONENT
 */
class Order extends React.Component {
  componentDidMount() {
    const {userId, getTransactions} = this.props
    getTransactions(userId)
  }

  render() {
    const {funds} = this.props
    return (
      <div>
        <h1 className="page-header">Order</h1>
        <div className="portfolio-metrics">
          <h2>Cash Funds - {convertCentsToUSD(funds)}</h2>
        </div>
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
