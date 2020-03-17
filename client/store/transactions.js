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
    let {data} = await axios.get(`/api/transactions/${userId}`)
    dispatch(getTransactions(data))
  } catch (err) {
    console.error(err)
  }
}

export const addTransactionThunk = (
  userId,
  userFunds,
  stockDetails
) => async dispatch => {
  try {
    console.log('Thunk stock details: ', stockDetails)
    console.log('User funds: ', userFunds, typeof userFunds)
    let transactionPrice = stockDetails.totalTransactionPrice
    let newFunds = userFunds - transactionPrice
    console.log('Transaction old to new funds: ', userFunds, ' -> ', newFunds)
    if (newFunds >= 0) {
      let {data} = await axios.post(`/api/transactions/${userId}`, {
        symbol: stockDetails.symbol,
        shareCount: stockDetails.shareCount,
        stockPrice: stockDetails.stockPrice,
        orderType: stockDetails.orderType,
        transactionPrice: transactionPrice
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
