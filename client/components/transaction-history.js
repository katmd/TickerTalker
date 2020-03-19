import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {getTransactionsThunk} from '../store/transactions'
import {convertToUSD} from '../utils/conversion'
import {Table} from './index'

/**
 * COMPONENT
 */
class TransactionHistory extends React.Component {
  componentDidMount() {
    const {userId, getTransactions} = this.props
    getTransactions(userId)
  }

  formatTableDetails() {
    const {userTransactions} = this.props
    if (userTransactions.length > 0) {
      let transactionsTableData = userTransactions.map(transaction => {
        let sharePriceInfo = `${transaction.shareCount} shares @ ${convertToUSD(
          transaction.price
        )}`
        let transactionDate = transaction.createdAt.slice(0, 10)
        return [
          transactionDate,
          transaction.orderType,
          transaction.symbol,
          sharePriceInfo
        ]
      })
      return transactionsTableData
    } else {
      return [[]]
    }
  }

  render() {
    let transactionsTableHeader = ['Date', 'Order', 'Symbol', 'Details']
    let transactionsTableData = this.formatTableDetails()
    return (
      <div>
        <h1 className="page-header">Transaction History</h1>
        {transactionsTableData.length > 1 ? (
          <Table
            tableHeader={transactionsTableHeader}
            tableData={transactionsTableData}
          />
        ) : (
          <div>No transaction history</div>
        )}
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
    userTransactions: state.transactions.history
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getTransactions: userId => dispatch(getTransactionsThunk(userId))
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
