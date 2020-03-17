const condensePortfolio = userTransactions => {
  // traverse transactions and add condensed transaction details to symbolTracker object
  if (userTransactions.length > 0) {
    let symbolTracker = {}
    userTransactions.forEach(transaction => {
      let currentSymbol = transaction.dataValues.symbol
      let shareCountChange = 0
      transaction.orderType === 'BUY'
        ? (shareCountChange += transaction.dataValues.shareCount)
        : (shareCountChange -= transaction.dataValues.shareCount)
      if (currentSymbol in symbolTracker) {
        symbolTracker[currentSymbol].shareCount += shareCountChange
      } else {
        symbolTracker[currentSymbol] = {
          shareCount: shareCountChange
        }
      }
    })
    return symbolTracker
  } else {
    return {}
  }
}

module.exports = condensePortfolio
