import axios from 'axios'
import {getTransactions} from '../transactions'
import {getPortfolio} from '../portfolio'
import {condensePortfolio} from '../../utils/portfolio'

export function getTransactionsThunk(dispatch, object, userId) {
  try {
    console.log('dispatching get transactions')
    console.log(userId)
    axios
      .get(`/api/transactions/${userId}`)
      .then(function(response) {
        let transactionResp = response.data
        console.log(transactionResp)
        dispatch(getTransactions(transactionResp))
        dispatch(getPortfolioThunk(dispatch, {}, transactionResp))
      })
      .catch(function(error) {
        console.log(error)
      })
  } catch (err) {
    console.error(err)
  }
}

export function getPortfolioThunk(dispatch, object, userTransactions) {
  let userTransactionsObj = condensePortfolio(userTransactions)
  console.log('Store user obj: ', userTransactionsObj)

  if (Object.keys(userTransactionsObj).length > 0) {
    // encode symbols since may contain reserved characters
    let encodedSymbols = encodeURI(Object.keys(userTransactionsObj))
    console.log('Store symbols: ', encodedSymbols)
    try {
      axios
        .get(
          `https://api.iextrading.com/1.0/tops/last?symbols=${encodedSymbols}`
        )
        .then(function(response) {
          let tickerDetails = response.data
          console.log('Store tickers: ', tickerDetails)
          dispatch(getPortfolio(tickerDetails))
        })
        .catch(function(error) {
          console.log(error)
        })
      // await userTransactionsObj.forEach(transaction => {
      //   let encodedSymbol = encodeURI(transaction.symbol)
      //   let tickerDetails = getTickerDetails(encodedSymbol)
      //   console.log("Ticker details: ", tickerDetails)
      //   transaction.price = tickerDetails.price
      // })
    } catch (err) {
      console.error(err)
    }
  }
}
