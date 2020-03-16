import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_STOCK = 'GET_STOCK'

/**
 * INITIAL STATE
 */
const defaultStock = {}

/**
 * ACTION CREATORS
 */
const getStock = stock => ({
  type: GET_STOCK,
  stock
})

/**
 * THUNK CREATORS
 */
export const getStockThunk = symbol => async dispatch => {
  try {
    // symbol must be encoded if it contains reserved characters
    let encodedSymbol = encodeURIComponent(symbol)
    let stockInfo = await axios.get(
      `https://api.iextrading.com/1.0/tops/last?symbols=${encodedSymbol}`
    )
    let dispatchedStock
    if (stockInfo.data[0]) {
      dispatchedStock = stockInfo.data[0]
    } else {
      dispatchedStock = {symbol: null}
    }
    dispatch(getStock(dispatchedStock))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultStock, action) {
  switch (action.type) {
    case GET_STOCK:
      return action.stock
    default:
      return state
  }
}
