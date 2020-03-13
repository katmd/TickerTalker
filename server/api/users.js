const router = require('express').Router()
const {User} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'email']
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})

// Update a user's available funds after a transaction is made
router.put('/:userId', async (req, res, next) => {
  const userId = req.params.userId
  const transactionPrice = req.body.transactionPrice
  try {
    const currentUser = await User.findByPk(userId)
    const newFunds = currentUser.funds + transactionPrice
    if (newFunds >= 0) {
      await currentUser.update({
        funds: newFunds
      })
    } else {
      throw new Error('Insufficient funds for transaction')
    }
    res.sendStatus(200)
  } catch (error) {
    next(error)
  }
})
