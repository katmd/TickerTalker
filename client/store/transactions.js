import axios from 'axios'
import {getPortfolioThunk} from './flux/asyncActions'

/**
 * ACTION TYPES
 */
const GET_TRANSACTIONS = 'GET_TRANSACTIONS'

/**
 * INITIAL STATE
 */
const defaultTransactions = []

/**
 * ACTION CREATORS
 */
export function getTransactions(transactions) {
  return {
    type: GET_TRANSACTIONS,
    transactions
  }
}

/**
 * THUNK CREATORS
 */
/*
export const getTransactionsThunk = userId => async dispatch => {
  try {
    let userTransactions = await axios.get(`/api/transactions/${userId}`)
    console.log("dispatching get transactions")
    dispatch(getTransactions(userTransactions.data))
  } catch (err) {
    console.error(err)
  }
}
*/

/*
export const getTransactionsThunk = async function(dispatch, userId) {
  try {
    console.log("dispatching get transactions")
    axios.get(`/api/transactions/${userId}`).then(function(response) {
      dispatch(getTransactions(response.data))
    })
    .catch(function(error){
      console.log(error)
    })
  } catch (err) {
    console.error(err)
  }
}
*/

/**
 * REDUCER
 */
export default function(state = defaultTransactions, action) {
  switch (action.type) {
    case GET_TRANSACTIONS:
      return action.transactions
    default:
      return state
  }
}
