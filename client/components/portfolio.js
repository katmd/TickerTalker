import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Table} from './index'
import {getTransactionsThunk} from '../store/transactions'
import {convertCentsToUSD} from '../utils/portfolio'

/**
 * COMPONENT
 */
class Portfolio extends React.Component {
  componentDidMount() {
    let {userId, getTransactions} = this.props
    getTransactions(userId)
  }

  totalPortfolioValue() {
    const {portfolio} = this.props
    if (Object.keys(portfolio).length > 0) {
      let total = 0
      for (let stock of Object.keys(portfolio)) {
        total += portfolio[stock].value * portfolio[stock].shareCount
      }
      return total
    } else {
      return 0
    }
  }

  formatTableDetails() {
    const {portfolio} = this.props
    if (Object.keys(portfolio).length > 0) {
      let portfolioTableData = Object.keys(portfolio).map(entry => {
        let shareCount = portfolio[entry].shareCount
        let currentValue = convertCentsToUSD(
          portfolio[entry].value * shareCount
        )
        return [entry, shareCount, currentValue]
      })
      return portfolioTableData
    } else {
      return []
    }
  }

  render() {
    const {funds} = this.props
    let portfolioTableHeader = ['Symbol', 'Shares', 'Current Value']
    let portfolioTableData = this.formatTableDetails()
    return (
      <div>
        <h1 className="page-header">Portfolio</h1>
        <div className="portfolio-metrics">
          <h2>
            Current Value - {convertCentsToUSD(this.totalPortfolioValue())}
          </h2>
          <h2>Cash Funds - {convertCentsToUSD(funds)}</h2>
        </div>
        <Table
          tableHeader={portfolioTableHeader}
          tableData={portfolioTableData}
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
    funds: state.user.funds,
    portfolio: state.transactions.portfolio
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getTransactions: userId => dispatch(getTransactionsThunk(userId))
  }
}

export default connect(mapState, mapDispatchToProps)(Portfolio)

/**
 * PROP TYPES
 */
Portfolio.propTypes = {
  funds: PropTypes.number,
  portfolio: PropTypes.object
}
