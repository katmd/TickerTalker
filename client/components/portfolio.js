import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Table} from './index'
import {getPortfolioThunk} from '../store/transactions'
import {convertToUSD} from '../utils/conversion'

/**
 * COMPONENT
 */
class Portfolio extends React.Component {
  componentDidMount() {
    let {userId, getPortfolio} = this.props
    getPortfolio(userId)
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
        let currentValue = convertToUSD(portfolio[entry].value * shareCount)
        return [entry, shareCount, currentValue]
      })
      return portfolioTableData
    } else {
      return [[]]
    }
  }

  render() {
    const {funds, userFirstName, userLastName} = this.props
    let portfolioTableHeader = ['Symbol', 'Shares', 'Current Value']
    let portfolioTableData = this.formatTableDetails()
    return (
      <div>
        <h1 className="page-header">Portfolio</h1>
        <p>
          Welcome {userFirstName} {userLastName}
        </p>
        <div className="portfolio-metrics">
          <h2>Total Value - {convertToUSD(this.totalPortfolioValue())}</h2>
          <h2>Cash Funds - {convertToUSD(funds)}</h2>
        </div>
        <Table
          tableHeader={portfolioTableHeader}
          tableData={portfolioTableData}
        />
        <a href="https://iexcloud.io">Stock price data provided by IEX Cloud</a>
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
    userFirstName: state.user.firstName,
    userLastName: state.user.lastName,
    funds: state.user.funds,
    portfolio: state.transactions.portfolio
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getPortfolio: userId => dispatch(getPortfolioThunk(userId))
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
