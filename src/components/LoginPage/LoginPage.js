import React, { Component } from 'react';
import { connect } from 'react-redux';

class LoginPage extends Component {
  state = {
    username: '',
    password: '',
  };

  login = (event) => {
    event.preventDefault();

    if (this.state.username && this.state.password) {
      this.props.dispatch({
        type: 'LOGIN',
        payload: {
          username: this.state.username,
          password: this.state.password,
        },
      });
    } else {
      this.props.dispatch({ type: 'LOGIN_INPUT_ERROR' });
    }
  } // end login

  handleInputChangeFor = propertyName => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  }

  render() {
    return (
      <div>
        {this.props.errors.loginMessage && (
          <h2
            className="alert"
            role="alert"
          >
            {this.props.errors.loginMessage}
          </h2>
        )}
        <form className="wrapper" onSubmit={this.login}>
          <h1>Login</h1>
          <div>
            <label htmlFor="username" className="field">
              <input
                type="email"
                name="username"
                value={this.state.username}
                onChange={this.handleInputChangeFor('username')}
              />
              <span className="label">Email address</span>
            </label>
          </div>
          <div>
            <label htmlFor="password" className="field">
              <input
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.handleInputChangeFor('password')}
              />
              <span className="label">Password</span>
            </label>
          </div>
          <div>
            <button
              className="log-in"
              type="submit"
              name="submit"
            >Log In</button>
          </div>
        </form>
        <button
          type="button"
          className="link-button button"
          onClick={() => { this.props.dispatch({ type: 'SET_TO_REGISTER_MODE' }) }}
        >
          Register
          </button>
      </div>
    );
  }
}

// Instead of taking everything from state, we just want the error messages.
// if you wanted you could write this code like this:
// const mapStateToProps = ({errors}) => ({ errors });
const mapStateToProps = state => ({
  errors: state.errors,
});

export default connect(mapStateToProps)(LoginPage);
