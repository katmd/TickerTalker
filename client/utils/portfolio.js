export function condensePortfolio(userTransactions) {
  // traverse transactions and add condensed transaction details to symbolTracker object
  if (userTransactions.length > 0) {
    let symbolTracker = {}
    userTransactions.forEach(transaction => {
      let currentSymbol = transaction.symbol
      let shareCountChange = 0
      transaction.orderType === 'BUY'
        ? (shareCountChange += transaction.shareCount)
        : (shareCountChange -= transaction.shareCount)
      if (currentSymbol in symbolTracker) {
        symbolTracker[currentSymbol].shareCount += shareCountChange
      } else {
        symbolTracker[currentSymbol] = {
          shareCount: shareCountChange,
          price: transaction.price
        }
      }
    })
    return symbolTracker
  } else {
    return {}
  }
}
