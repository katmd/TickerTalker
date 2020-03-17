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
    let stockInfo = await axios.get(`/api/stock/${symbol}`)
    dispatch(getStock(stockInfo.data))
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
