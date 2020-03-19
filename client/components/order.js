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
      return 'ERROR: Symbol is invalid, please try your search again'
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
        {/* Only display the Search Stock page if the transaction is not ready for confirmation */}
        {readyForConfirmation ? (
          <TransactionConfirmation />
        ) : (
          <SearchStock errorMessage={searchErrorMessage} />
        )}
        {/* Only display the Transaction Form if the symbol search was successful and the transaction is not ready for confirmation */}
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
