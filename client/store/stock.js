import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_STOCK = 'GET_STOCK'
const TRANSACT_STOCK = 'TRANSACT_STOCK'
const CLEAR_STOCK = 'CLEAR_STOCK'

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

export const transactStock = transactionDetails => ({
  type: TRANSACT_STOCK,
  transactionDetails
})

export const clearStock = () => ({type: CLEAR_STOCK})

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
      action.stock.readyToConfirm = false
      return action.stock
    case TRANSACT_STOCK: {
      let stockCopy = {...state}
      stockCopy.readyToConfirm = true
      for (let detail of Object.keys(action.transactionDetails)) {
        stockCopy[detail] = action.transactionDetails[detail]
      }
      return stockCopy
    }
    case CLEAR_STOCK:
      return {}
    default:
      return state
  }
}
