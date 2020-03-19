const router = require('express').Router()
const {User} = require('../db/models')
const axios = require('axios')
const condensePortfolio = require('../utils/portfolio')
module.exports = router

// Grab all of user's transactions
router.get('/:userId', async (req, res, next) => {
  const userId = req.params.userId
  try {
    const currentUser = await User.findByPk(userId)
    const transactions = await currentUser.getTransactions({
      order: [['updatedAt', 'DESC']]
    })
    res.json(transactions)
  } catch (error) {
    next(error)
  }
})

// Add a user's new transaction
router.post('/:userId', async (req, res, next) => {
  const userId = req.params.userId
  const transactionDetails = req.body.transactionDetails
  try {
    const currentUser = await User.findByPk(userId)
    const totalTransactionPrice = transactionDetails.totalTransactionPrice
    const newFunds = currentUser.funds - totalTransactionPrice
    if (newFunds >= 0) {
      let transaction = await currentUser.createTransaction({
        symbol: transactionDetails.symbol,
        shareCount: transactionDetails.shareCount,
        price: transactionDetails.latestPrice,
        orderType: transactionDetails.orderType
      })
      res.json(transaction)
    } else {
      throw new Error('Insufficient funds for transaction')
    }
  } catch (error) {
    next(error)
  }
})

// Grab a user's portfolio
router.get('/portfolio/:userId', async (req, res, next) => {
  const userId = req.params.userId
  try {
    const currentUser = await User.findByPk(userId)
    // to populate the user's portfolio, must first grab the user's transactions before calls may be made to the IEX API with a series of Promises to ensure the requests are fulfilled in order.
    let portfolio = {}
    await currentUser.getTransactions().then(userTransactionsResponse => {
      // user transactions have been received, return response so separate IEX request may be made on tickers
      let condensedPortfolio = condensePortfolio(userTransactionsResponse)
      // initial portfolio without valued stocks has been condensed
      portfolio = condensedPortfolio
      // symbols must be encoded if they contain reserved characters
      let encodedSymbols = encodeURIComponent(
        Object.keys(condensedPortfolio).toString()
      )
      try {
        // separate axios request made to IEX API based on the user's transaction symbols
        axios
          .get(
            `https://cloud.iexapis.com/stable/stock/market/batch?types=quote&symbols=${encodedSymbols}&token=${
              process.env.IEX_TOKEN
            }`
          )
          .then(tickerDetailsResponse => {
            let tickerDetails = tickerDetailsResponse.data
            // populate portfolio and remove any stocks that a user has zero shares in
            for (let key of Object.keys(portfolio)) {
              portfolio[key].value = tickerDetails[key].quote.latestPrice
              portfolio[key].openDayPrice = tickerDetails[key].quote.open
              if (portfolio[key].shareCount === 0) {
                delete portfolio[key]
              }
            }
            // current details of ticker symbols have been received, send back as response
            res.json(portfolio)
          })
      } catch (error) {
        next(error)
      }
    })
  } catch (error) {
    next(error)
  }
})

// Grab a single stock's info from user's portfolio
router.get('/portfolio/:userId/:symbol', async (req, res, next) => {
  const userId = req.params.userId
  const symbol = req.params.symbol
  try {
    const currentUser = await User.findByPk(userId)
    let userTransactionsResponse = await currentUser.getTransactions()
    let condensedPortfolio = condensePortfolio(userTransactionsResponse)
    let portfolioStock = {[symbol]: condensedPortfolio[symbol]}
    if (portfolioStock.shareCount !== 0) {
      res.json(portfolioStock)
    } else {
      res.json({shareCount: 0})
    }
  } catch (error) {
    next(error)
  }
})
