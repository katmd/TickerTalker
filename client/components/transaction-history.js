import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {getTransactionsThunk} from '../store/transactions'
import {Table} from './index'

/**
 * COMPONENT
 */
class TransactionHistory extends React.Component {
  componentDidMount() {
    const {userId, fetchTransactions} = this.props
    fetchTransactions(userId)
  }

  formatTableDetails() {
    const {userTransactions} = this.props
    let transactionsTableHeader = ['Date', 'Order', 'Symbol', 'Details']
    let transactionsTableData = userTransactions.map(transaction => {
      let sharePriceInfo = `${
        transaction.shareCount
      } shares @ ${Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
      }).format(transaction.price / 100)}`
      let transactionDate = transaction.createdAt.slice(0, 10)
      return [
        transactionDate,
        transaction.orderType,
        transaction.symbol,
        sharePriceInfo
      ]
    })
    return {header: transactionsTableHeader, data: transactionsTableData}
  }

  render() {
    let transactionsTableDetails = this.formatTableDetails()

    return (
      <div>
        <h1 className="page-header">Transaction History</h1>
        <Table
          tableHeader={transactionsTableDetails.header}
          tableData={transactionsTableDetails.data}
        />
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
    userTransactions: state.transactions
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchTransactions: userId => dispatch(getTransactionsThunk(userId))
  }
}

export default connect(mapState, mapDispatchToProps)(TransactionHistory)

/**
 * PROP TYPES
 */
TransactionHistory.propTypes = {
  userId: PropTypes.number,
  userTransactions: PropTypes.array
}
