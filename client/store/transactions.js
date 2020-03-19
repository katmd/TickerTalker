import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_TRANSACTIONS = 'GET_TRANSACTIONS'
const ADD_TRANSACTION = 'ADD_TRANSACTION'
const GET_PORTFOLIO = 'GET_PORTFOLIO'
const GET_PORTFOLIO_SINGLE_STOCK = 'GET_PORTFOLIO_SINGLE_STOCK'

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

const getPortfolioSingleStock = portfolio => ({
  type: GET_PORTFOLIO_SINGLE_STOCK,
  portfolio
})

/**
 * THUNK CREATORS
 */
export const getTransactionsThunk = userId => async dispatch => {
  try {
    let {data} = await axios.get(`/api/transactions/${userId}`)
    dispatch(getTransactions(data))
  } catch (err) {
    console.error(err)
  }
}

export const addTransactionThunk = (
  userId,
  userFunds,
  transactionDetails
) => async dispatch => {
  try {
    let transactionPrice = transactionDetails.totalTransactionPrice
    let newFunds = userFunds - transactionPrice
    if (newFunds >= 0) {
      let {data} = await axios.post(`/api/transactions/${userId}`, {
        transactionDetails: transactionDetails
      })
      dispatch(addTransaction(data))
    }
  } catch (err) {
    console.error(err)
  }
}

export const getPortfolioThunk = userId => async dispatch => {
  try {
    let {data} = await axios.get(`/api/transactions/portfolio/${userId}`)
    dispatch(getPortfolio(data))
  } catch (err) {
    console.error(err)
  }
}

export const getPortfolioSingleStockThunk = (
  userId,
  symbol
) => async dispatch => {
  try {
    let {data} = await axios.get(
      `/api/transactions/portfolio/${userId}/${symbol}`
    )
    dispatch(getPortfolioSingleStock(data))
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
    case GET_PORTFOLIO_SINGLE_STOCK:
      return Object.assign({}, state, {portfolio: action.portfolio})
    default:
      return state
  }
}
