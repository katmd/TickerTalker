import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {getStockThunk} from '../store/stock'

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
    const {getStock} = this.props
    getStock(this.state.symbol)
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
        {errorMessage && <p id="search-error">{errorMessage}</p>}
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    stock: state.stock
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getStock: symbol => dispatch(getStockThunk(symbol))
  }
}

export default connect(mapState, mapDispatchToProps)(SearchStock)

/**
 * PROP TYPES
 */
SearchStock.propTypes = {
  stock: PropTypes.object
}
