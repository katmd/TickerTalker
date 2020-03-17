import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_TRANSACTIONS = 'GET_TRANSACTIONS'
const ADD_TRANSACTION = 'ADD_TRANSACTION'
const GET_PORTFOLIO = 'GET_PORTFOLIO'

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

const getPortfolio = portfolio => ({
  type: GET_PORTFOLIO,
  portfolio
})

/**
 * THUNK CREATORS
 */
export const getTransactionsThunk = userId => async dispatch => {
  try {
    let userTransactions = await axios.get(`/api/transactions/${userId}`)
    dispatch(getTransactions(userTransactions.data))
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

export const getPortfolioThunk = userId => async dispatch => {
  try {
    let portfolio = await axios.get(`/api/transactions/portfolio/${userId}`)
    dispatch(getPortfolio(portfolio.data))
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
    case GET_PORTFOLIO:
      return Object.assign({}, state, {portfolio: action.portfolio})
    default:
      return state
  }
}
