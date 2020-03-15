import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {getTransactionsThunk} from '../store/transactions'
import {getPortfolioThunk} from '../store/portfolio'
import {getTickerThunk} from '../store/ticker'

/**
 * COMPONENT
 */
class Portfolio extends React.Component {
  componentDidMount() {
    let {actions, userId} = this.props
    console.log(this.props)
    console.log('transaction thunks')
    console.log('userid')
    console.log(userId)

    actions.getTransactionsThunk(userId)
  }

  render() {
    const {funds, userTransactions, portfolio} = this.props
    console.log('Render funds: ', funds)
    console.log('Render user Transactions: ', userTransactions)
    console.log('Render portfolio: ', portfolio)
    return (
      <div>
        <h1 className="page-header">Portfolio</h1>
        <div id="portfolio-metrics">
          <h2>Current Value - $</h2>
          <h2>
            Cash Funds -{' '}
            {Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 2
            }).format(funds / 100)}
          </h2>
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
    userTransactions: state.transactions,
    portfolio: state.portfolio
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getTransactions: userId => dispatch(getTransactionsThunk(userId)),
    getPortfolio: userTransactions =>
      dispatch(getPortfolioThunk(userTransactions)),
    getTickerDetails: symbol => dispatch(getTickerThunk(symbol))
  }
}

export default connect(mapState, mapDispatchToProps)(Portfolio)

/**
 * PROP TYPES
 */
Portfolio.propTypes = {
  funds: PropTypes.number
}
