import axios from 'axios'
import {condensePortfolio, valueTickers} from '../utils/portfolio'

/**
 * ACTION TYPES
 */
const GET_TRANSACTIONS = 'GET_TRANSACTIONS'
const ADD_TRANSACTION = 'ADD_TRANSACTION'
const START_PORTFOLIO = 'START_PORTFOLIO'
const VALUE_PORTFOLIO = 'VALUE_PORTFOLIO'

/**
 * INITIAL STATE
 */
const defaultTransactions = {
  history: [],
  portfolio: {}
}

/**
 * ACTION CREATORS
 */
const getTransactions = transactions => ({
  type: GET_TRANSACTIONS,
  transactions
})

const addTransaction = transaction => ({
  type: ADD_TRANSACTION,
  transaction
})

const startPortfolio = portfolio => ({
  type: START_PORTFOLIO,
  portfolio
})

const valuePortfolio = tickerValues => ({
  type: VALUE_PORTFOLIO,
  tickerValues
})

/**
 * THUNK CREATORS
 */
export const getTransactionsThunk = userId => async dispatch => {
  try {
    // to populate the user's portfolio, must first grab the user's transactions before calls may be made to the IEX API with a series of Promises to ensure the requests are fulfilled in order.
    await axios
      .get(`/api/transactions/${userId}`)
      .then(userTransactionsResponse => {
        let userTransactions = userTransactionsResponse.data
        // user transactions have been received, dispatch to reducer
        dispatch(getTransactions(userTransactions))
        return userTransactionsResponse
      })
      .then(userTransactionsResponse => {
        let condensedPortfolio = condensePortfolio(
          userTransactionsResponse.data
        )
        // initial portfolio without valued stocks has been received, dispatch to reducer
        dispatch(startPortfolio(condensedPortfolio))
        // symbols must be encoded if they contain reserved characters
        let encodedSymbols = encodeURIComponent(
          Object.keys(condensedPortfolio).toString()
        )
        // separate axios request made to IEX API based on the user's transactions
        axios
          .get(
            `https://api.iextrading.com/1.0/tops/last?symbols=${encodedSymbols}`
          )
          .then(tickerDetailsResponse => {
            let tickerDetails = tickerDetailsResponse.data
            let valuedTickers = valueTickers(tickerDetails)
            // current values of ticker symbols have been received, dispatch to reducer
            dispatch(valuePortfolio(valuedTickers))
          })
      })
  } catch (err) {
    console.error(err)
  }
}

export const addTransactionThunk = (userId, stockDetails) => async dispatch => {
  try {
    const currentUser = await axios.get('/auth/me')
    let transactionPrice = stockDetails.price
    let newFunds = currentUser.funds + transactionPrice
    if (newFunds >= 0) {
      let symbol = stockDetails.symbol
      let shareCount = stockDetails.shareCount
      let orderType = stockDetails.orderType
      let transaction = await axios.post(
        `/api/transactions/${userId}`,
        symbol,
        shareCount,
        transactionPrice,
        orderType
      )
      dispatch(addTransaction(transaction))
    }
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultTransactions, action) {
  switch (action.type) {
    case GET_TRANSACTIONS:
      return Object.assign({}, state, {history: action.transactions})
    case ADD_TRANSACTION:
      return Object.assign({}, state, {
        history: [...state.history, action.transaction]
      })
    case START_PORTFOLIO:
      return Object.assign({}, state, {portfolio: action.portfolio})
    case VALUE_PORTFOLIO: {
      let portfolioCopy = {...state.portfolio}
      let tickerValues = action.tickerValues
      for (let key of Object.keys(portfolioCopy)) {
        portfolioCopy[key].value = tickerValues[key]
      }
      return Object.assign({}, state, {portfolio: portfolioCopy})
    }
    default:
      return state
  }
}
