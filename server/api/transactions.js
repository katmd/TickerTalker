const router = require('express').Router()
const {User} = require('../db/models')
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
  const transactionPrice = req.body.transactionPrice
  try {
    const currentUser = await User.findByPk(userId)
    const newFunds = currentUser.funds + transactionPrice
    if (newFunds >= 0) {
      await currentUser.createTransaction({
        symbol: req.body.symbol,
        shareCount: req.body.shareCount,
        price: req.body.price,
        orderType: req.body.orderType
      })
    } else {
      throw new Error('Insufficient funds for transaction')
    }
    res.sendStatus(201)
  } catch (error) {
    next(error)
  }
})
