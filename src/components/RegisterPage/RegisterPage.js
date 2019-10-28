import React, { Component } from 'react';
import { connect } from 'react-redux';
import PhoneInput from 'react-phone-number-input';

class RegisterPage extends Component {
  state = {
    username: '',
    password: '',
    full_name: '',
    display_name: '',
    cell: ''
  };

  registerUser = (event) => {
    event.preventDefault();

    if (this.state.username && this.state.password) {
      this.props.dispatch({
        type: 'REGISTER',
        payload: {
          username: this.state.username,
          password: this.state.password,
          full_name: this.state.full_name,
          display_name: this.state.display_name,
          cell: this.state.cell
        },
      });
    } else {
      this.props.dispatch({ type: 'REGISTRATION_INPUT_ERROR' });
    }
  } // end registerUser

  handleInputChangeFor = propertyName => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  }

  render() {
    return (
      <div>
        {this.props.errors.registrationMessage && (
          <h2
            className="alert"
            role="alert"
          >
            {this.props.errors.registrationMessage}
          </h2>
        )}
        <form className="wrapper -thin" onSubmit={this.registerUser}>
          <h1 onClick={() => {
            this.setState({
              username: 'frankie.folsom@example.com',
              full_name: 'Frankie Folsom',
              display_name: 'Frankie',
              cell: '+15559871234',
              password: 'frank'
            });
          }}>Register User</h1>
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
            <label htmlFor="full_name" className="field">
              <input
                type="text"
                name="full_name"
                value={this.state.full_name}
                onChange={this.handleInputChangeFor('full_name')}
              />
              <span className="label">Full name</span>
            </label>
          </div>
          <div>
            <label htmlFor="display_name" className="field">
              <input
                type="text"
                name="display_name"
                value={this.state.display_name}
                onChange={this.handleInputChangeFor('display_name')}
              />
              <span className="label">Display name (nickname)</span>
            </label>
          </div>
          <div>
            <label htmlFor="cell" className="field">
              <PhoneInput
                country="US" // remove this line for international support
                name="cell"
                value={this.state.cell}
                onChange={cell => this.setState({ cell })}
              />
              <span className="label">Cell number</span>
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
              className="register button"
              type="submit"
              name="submit"
            >Register</button>
          </div>
        </form>
        <button
          type="button"
          className="button -link"
          onClick={() => { this.props.dispatch({ type: 'SET_TO_LOGIN_MODE' }) }}
        >
          Login
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

export default connect(mapStateToProps)(RegisterPage);

