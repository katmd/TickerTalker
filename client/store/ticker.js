import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_TICKER = 'GET_TICKER'

/**
 * INITIAL STATE
 */
const defaultTicker = {}

/**
 * ACTION CREATORS
 */
export const getTicker = symbol => ({
  type: GET_TICKER,
  symbol
})

/**
 * THUNK CREATORS
 */
export const getTickerThunk = symbol => async dispatch => {
  try {
    let encodedSymbol = encodeURI(symbol)
    let tickerDetails = await axios.get(
      `https://api.iextrading.com/1.0/tops/last?symbols=${encodedSymbol}`
    )
    dispatch(getTicker(tickerDetails[0]))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultTicker, action) {
  switch (action.type) {
    case GET_TICKER:
      return action.symbol
    default:
      return state
  }
}
