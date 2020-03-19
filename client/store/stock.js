import axios from 'axios'

function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true
  }

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) {
    return false
  }

  // Test for A's keys different from B.
  const hasOwn = Object.prototype.hasOwnProperty
  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false
    }
  }

  return true
}

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

export const transactStock = stockWithTransactionDetails => ({
  type: TRANSACT_STOCK,
  stockWithTransactionDetails
})

export const clearStock = () => ({type: CLEAR_STOCK})

/**
 * THUNK CREATORS
 */
export const getStockThunk = symbol => async dispatch => {
  try {
    let {data} = await axios.get(`/api/stock/${symbol}`)
    dispatch(getStock(data))
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
      for (let detail of Object.keys(action.stockWithTransactionDetails)) {
        stockCopy[detail] = action.stockWithTransactionDetails[detail]
      }
      return stockCopy
    }
    case CLEAR_STOCK:
      return {}
    default:
      return state
  }
}
