'use strict'
import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {bindAsyncActionCreators} from './store/flux/utils'
import * as asyncActionCreators from './store/flux/asyncActions'
import * as transactionActions from './store/transactions'
import * as portfolioActions from './store/portfolio'

import {Navbar} from './components'
import Routes from './routes'

class App extends React.Component {
  render() {
    let {actions} = this.props
    return (
      <div>
        <Navbar />
        <Routes actions={actions} />
      </div>
    )
  }
}

function stateMapper(state) {
  return {
    ...state
  }
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  let {objects} = stateProps
  let {dispatch} = dispatchProps

  return {
    actions: {
      ...bindActionCreators(
        {...transactionActions, ...portfolioActions},
        dispatch
      ),
      ...bindAsyncActionCreators(asyncActionCreators, dispatch, objects)
    },
    ...ownProps,
    ...stateProps,
    ...dispatchProps
  }
}

export default connect(stateMapper, dispatch => ({dispatch}), mergeProps)(App)

// export default App
