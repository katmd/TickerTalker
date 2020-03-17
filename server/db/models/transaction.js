const Sequelize = require('sequelize')
const db = require('../db')

const Transaction = db.define('transaction', {
  symbol: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  shareCount: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  price: {
    type: Sequelize.DECIMAL,
    allowNull: false,
    validate: {
      notEmpty: true
    },
    get() {
      // Workaround until sequelize issue #8019 is fixed
      const value = this.getDataValue('price')
      return value === null ? null : parseFloat(value)
    }
  },
  orderType: {
    type: Sequelize.ENUM('BUY', 'SELL'),
    defaultValue: 'BUY'
  }
})

module.exports = Transaction
