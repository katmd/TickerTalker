const Sequelize = require('sequelize')
const db = require('../db')

const Transaction = db.define('transaction', {
  symbol: {
    type: Sequelize.STRING
  },
  shares: {
    type: Sequelize.INTEGER
  },
  price: {
    type: Sequelize.INTEGER
  },
  orderType: {
    type: Sequelize.ENUM('BUY', 'SELL'),
    defaultValue: 'BUY'
  }
})

module.exports = Transaction
