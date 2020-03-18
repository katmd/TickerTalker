import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {getStockThunk} from '../store/stock'
import {getPortfolioSingleStockThunk} from '../store/transactions'

/**
 * COMPONENT
 */
class SearchStock extends React.Component {
  constructor() {
    super()
    this.state = {
      symbol: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange() {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit(event) {
    event.preventDefault()
    const {userId, getStock, getPortfolioSingleStock} = this.props
    // Put both the stock's current details and any portfolio entries for the stock on the store state for access by the transaction form
    Promise.all(
      getStock(this.state.symbol),
      getPortfolioSingleStock(userId, this.state.symbol)
    )
  }

  render() {
    const symbol = this.state.symbol
    const {errorMessage} = this.props
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div>
            <input
              name="symbol"
              type="text"
              placeholder="Enter Stock Symbol"
              value={symbol}
              onChange={this.handleChange}
            />
          </div>
          <button id="search-btn" type="submit">
            Search
          </button>
        </form>
        {errorMessage &&
          errorMessage !== 'Valid' && (
            <p className="error-message">{errorMessage}</p>
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
    userId: state.user.id
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getStock: symbol => dispatch(getStockThunk(symbol)),
    getPortfolioSingleStock: (userId, symbol) =>
      dispatch(getPortfolioSingleStockThunk(userId, symbol))
  }
}

export default connect(mapState, mapDispatchToProps)(SearchStock)

/**
 * PROP TYPES
 */
SearchStock.propTypes = {
  userId: PropTypes.number
}
