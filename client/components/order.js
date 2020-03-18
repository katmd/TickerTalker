import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {SearchStock, TransactionForm, TransactionConfirmation} from './index'
import {convertToUSD} from '../utils/conversion'

/**
 * COMPONENT
 */
class Order extends React.Component {
  handleSearchError() {
    const {stock} = this.props
    if (stock.symbol === null) {
      return 'Symbol is invalid, please try your search again'
    } else if (stock.symbol === undefined) {
      return null
    } else {
      return 'Valid'
    }
  }

  handleConfirmation() {
    const {stock} = this.props
    if (stock.readyToConfirm === undefined) {
      return false
    } else {
      return stock.readyToConfirm
    }
  }

  render() {
    const {funds} = this.props
    let searchErrorMessage = this.handleSearchError()
    let readyForConfirmation = this.handleConfirmation()
    return (
      <div>
        <h1 className="page-header">Order</h1>
        <div className="portfolio-metrics">
          <h2>Cash Funds - {convertToUSD(funds)}</h2>
        </div>
        {readyForConfirmation ? (
          <TransactionConfirmation />
        ) : (
          <SearchStock errorMessage={searchErrorMessage} />
        )}
        {searchErrorMessage === 'Valid' &&
          !readyForConfirmation && <TransactionForm />}
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
    stock: state.stock
  }
}

export default connect(mapState, null)(Order)

/**
 * PROP TYPES
 */
Order.propTypes = {
  funds: PropTypes.number,
  stock: PropTypes.object
}
