import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PhoneInput, { formatPhoneNumber } from 'react-phone-number-input';


class UserPage extends Component {
  state = {
    user_id: this.props.store.user.id,
    username: this.props.store.user.username,
    full_name: this.props.store.user.full_name,
    display_name: this.props.store.user.display_name,
    cell: this.props.store.user.cell,
    access_level: this.props.store.user.access_level,
    access_description: '',
    editMode: false
  }

  componentDidMount() {
    this.setState({
      access_description: this.userAccessDescribe(this.state.access_level)
    });
    this.checkEditAccess();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match !== this.props.match) {
      this.checkEditAccess();
    }
    if (prevProps.store.user !== this.props.store.user) {
      this.checkEditAccess();
    }
  }

  handleInputChangeFor = propertyName => (event) => {
    this.setState({
      [propertyName]: event.target.value
    });
  }
  handleSubmit = (event) => {
    event.preventDefault();
    this.props.dispatch({
      type: 'UPDATE_USER',
      payload: {
        id: this.state.user_id,
        full_name: this.state.full_name,
        display_name: this.state.display_name,
        cell: this.state.cell
      },
    });
  } // end handleSubmit


  checkEditAccess() {
    if (this.props.location.hash === '#edit') {
      if ((this.props.store.user.id === this.state.user_id) || (this.props.store.access_level > 2)) {
        this.setState({ editMode: true });
      } else {
        this.props.history.push({ pathname: this.props.location.pathname, hash: '' });
      }
    } else {
      this.setState({ editMode: false });
    }
  }

  userAccessDescribe(access) {
    access = parseInt(access);
    if (access === 0) return 'Unconfirmed user';
    if (access === 1) return 'Inactive user';
    if (access === 2) return 'Vanpool member';
    if (access > 2) return 'Administrator';
    return '';
  }

  render() {
    return (
      <div className="UserPage-component">
        {/* toggle edit mode */}
        {(this.state.editMode === true)
          ? <div className="userView -edit">
            <h2 id="welcome">
              Welcome, {this.props.store.user.display_name}!
            </h2>
            <form className="wrapper -thin" onSubmit={this.handleSubmit}>
              <div>
                <label htmlFor="username" className="field">
                  <input
                    type="email"
                    name="username"
                    disabled
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
                <button
                  className="button"
                  type="submit"
                  name="submit"
                >Save Changes</button>
              </div>
            </form>
          </div>

          : <div className="userView">
            <h3>{this.state.full_name}<br />
              <div className="userRole">
                {this.state.access_description}
              </div></h3>
            <p>Display name: {this.state.display_name}</p>
            <p>Email address: <a href={`mailto:${this.state.username}`}>{this.state.username}</a></p>
            <p>Cell number: <a href={`sms:${this.state.cell}`}>{formatPhoneNumber(this.state.cell)}</a></p>
          </div>
        }
        <pre className="wrapper -thin">{JSON.stringify(this.state, null, 2)}</pre>
        <pre className="wrapper -thin">{JSON.stringify(this.props, null, 2)}</pre>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  store,
});
export default withRouter(connect(mapStateToProps)(UserPage));

