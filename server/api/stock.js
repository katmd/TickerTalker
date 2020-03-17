const router = require('express').Router()
const axios = require('axios')
module.exports = router

// Grab a stock's details from IEX API
router.get('/:symbol', async (req, res, next) => {
  const symbol = req.params.symbol
  let stockInfo
  try {
    let encodedSymbol = encodeURIComponent(symbol)
    stockInfo = await axios.get(
      `https://cloud.iexapis.com/stable/stock/market/batch?types=quote&symbols=${encodedSymbol}&token=${
        process.env.IEX_TOKEN
      }`
    )
  } catch (error) {
    res.json({symbol: null})
  }
  res.json(stockInfo.data[symbol].quote)
})
