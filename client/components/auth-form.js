import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {auth} from '../store'

/**
 * COMPONENT
 */
const AuthForm = props => {
  const {name, displayName, handleSubmit, error} = props
  return (
    <div className="authentication-page">
      <div className="landing">
        <div className="site-info">
          <h2>Welcome to Ticker Talker</h2>
          <p>
            Utilize our tools to simulate your stock market choices and
            performance.
          </p>
          <p>
            View your portfolio of stocks with indicators of their performance
            compared to the current day's open prices.
          </p>
          <p>
            Review your past orders to audit your transaction history and see
            what the stock was valued at in the past.
          </p>
        </div>
        <form
          className="authentication-form"
          onSubmit={handleSubmit}
          name={name}
        >
          <h3>{name.toUpperCase()}</h3>
          {name === 'signup' && (
            <React.Fragment>
              <div>
                <label htmlFor="firstName">
                  <small>First Name</small>
                </label>
                <input name="firstName" type="text" />
              </div>
              <div>
                <label htmlFor="lastName">
                  <small>Last Name</small>
                </label>
                <input name="lastName" type="text" />
              </div>
            </React.Fragment>
          )}
          <div>
            <label htmlFor="email">
              <small>Email</small>
            </label>
            <input name="email" type="text" />
          </div>
          <div>
            <label htmlFor="password">
              <small>Password</small>
            </label>
            <input name="password" type="password" />
          </div>
          <div>
            <button type="submit">{displayName}</button>
          </div>
          {error && error.response && <div> {error.response.data} </div>}
        </form>
      </div>
      <div className="landing-footer">
        <a className="external-link" href="https://iexcloud.io">
          Stock price data provided by IEX Cloud
        </a>{' '}
        |{' '}
        <a
          className="external-link"
          href="https://github.com/katmd/TickerTalker"
        >
          Github
        </a>
        <p>Test Email: murphy@email.com - Test Pass: 123</p>
      </div>
    </div>
  )
}

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = state => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.user.error
  }
}

const mapSignup = state => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.user.error
  }
}

const mapDispatch = dispatch => {
  return {
    handleSubmit(evt) {
      evt.preventDefault()
      const formName = evt.target.name
      const email = evt.target.email.value
      const password = evt.target.password.value
      let firstName, lastName
      if (formName === 'signup') {
        firstName = evt.target.firstName.value
        lastName = evt.target.lastName.value
      }
      dispatch(auth(email, password, formName, firstName, lastName))
    }
  }
}

export const Login = connect(mapLogin, mapDispatch)(AuthForm)
export const Signup = connect(mapSignup, mapDispatch)(AuthForm)

/**
 * PROP TYPES
 */
AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object
}
