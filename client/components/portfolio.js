import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
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

  formatPortfolio(portfolioEntry) {
    let shareCount = portfolioEntry.shareCount
    let currentValue = convertToUSD(portfolioEntry.value * shareCount)
    let openDayPriceValue = convertToUSD(
      portfolioEntry.openDayPrice * shareCount
    )
    let stockPerfomance = 'equal'
    if (currentValue < openDayPriceValue) {
      stockPerfomance = 'down'
    } else if (currentValue > openDayPriceValue) {
      stockPerfomance = 'up'
    }
    return {
      shareCount: shareCount,
      currentValue: currentValue,
      openDayPriceValue: openDayPriceValue,
      stockPerfomance: stockPerfomance
    }
  }

  render() {
    const {funds, userFirstName, userLastName, portfolio} = this.props
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
        {portfolio &&
          Object.keys(portfolio).map((entry, idx) => {
            let portfolioDetails = this.formatPortfolio(portfolio[entry])
            return (
              <div
                key={idx}
                performance={portfolioDetails.stockPerfomance}
                className="portfolio-entry"
              >
                <div className="portfolio-qty">
                  {entry} - {portfolioDetails.shareCount} shares
                </div>
                <div className="portfolio-val">
                  {portfolioDetails.currentValue}
                </div>
              </div>
            )
          })}
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
