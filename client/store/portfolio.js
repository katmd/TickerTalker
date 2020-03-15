import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_PORTFOLIO = 'GET_PORTFOLIO'

/**
 * INITIAL STATE
 */
const defaultPortfolio = []

/**
 * ACTION CREATORS
 */
export function getPortfolio(portfolio) {
  return {
    type: GET_PORTFOLIO,
    portfolio
  }
}

/**
 * THUNK CREATORS
 */

/*
export const getPortfolioThunk = userTransactionsObj => async dispatch => {
  console.log('Store user obj: ', userTransactionsObj)

  if (Object.keys(userTransactionsObj).length > 0) {
    // encode symbols since may contain reserved characters
    let encodedSymbols = encodeURI(Object.keys(userTransactionsObj))
    console.log('Store symbols: ', encodedSymbols)
    try {
      let tickerDetails = await axios.get(
        `https://api.iextrading.com/1.0/tops/last?symbols=${encodedSymbols}`
      )
      console.log('Store tickers: ', tickerDetails.data)
      // await userTransactionsObj.forEach(transaction => {
      //   let encodedSymbol = encodeURI(transaction.symbol)
      //   let tickerDetails = getTickerDetails(encodedSymbol)
      //   console.log("Ticker details: ", tickerDetails)
      //   transaction.price = tickerDetails.price
      // })
      dispatch(getPortfolio(tickerDetails.data))
      return tickerDetails
    } catch (err) {
      console.error(err)
    }
  }
}
*/

/**
 * REDUCER
 */
export default function(state = defaultPortfolio, action) {
  switch (action.type) {
    case GET_PORTFOLIO:
      return action.portfolio
    default:
      return state
  }
}
