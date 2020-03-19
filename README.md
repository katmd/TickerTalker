# Ticker Talker

Utilize tools to simulate stock market choices and performance.

## Build Status

Visit the deployed app at [https://ticker-talker.herokuapp.com/](https://ticker-talker.herokuapp.com/)

[![Build Status](https://travis-ci.org/katmd/TickerTalker.svg?branch=master)](https://travis-ci.org/katmd/TickerTalker) [![Coverage Status](https://coveralls.io/repos/github/katmd/TickerTalker/badge.svg?branch=master)](https://coveralls.io/github/katmd/TickerTalker?branch=master)

## Technologies Used

Built with: React, Redux, Node, Postgres, Heroku, Travis

## Features

1.  View portfolio of stocks with indicators of their performance compared to the current day's open prices.
2.  Review past orders to audit your transaction history and see what the stock was valued at in the past.
3.  Search by stock symbol and place buy or sell order.

## Setup

1.  Clone the repo to your local machine
2.  Run `npm install` to install packages
3.  Create two postgres databases (`MY_APP_NAME` should match the name parameter in package.json):

```
export MY_APP_NAME=ticker-talker
createdb $MY_APP_NAME
createdb $MY_APP_NAME-test
```

> By default, running `npm test` will use `ticker-talker-test`, while regular development uses `ticker-talker`

4.  Run `npm run start-dev` to bundle and run the app on the localhost (defaulted to `localhost:8080`)

## Credits

Template Code: [Fullstack Academy](https://github.com/FullstackAcademy)

Stock price data: [IEX Cloud](https://iexcloud.io)

Image Icon: [game-icons.net](https://game-icons.net/)
