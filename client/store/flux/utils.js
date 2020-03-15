'use strict'

export function bindAsyncActionCreators(actionCreators, ...args) {
  let boundActionCreators = {}
  for (let [k, fn] of Object.entries(actionCreators)) {
    if (typeof fn == 'function') {
      boundActionCreators[k] = fn.bind(actionCreators, ...args)
    }
  }
  return boundActionCreators
}
