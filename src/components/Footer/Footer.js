import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Footer extends Component {
  render() {
    return (
      <footer className="Footer-component">
        <ul className="bottomNav">
          {(this.props.store.user.id)
            // Display the bottom nav links if the user is logged in
            ? <>
              <li><Link className="nav-link" to="/user">{this.props.store.user.display_name}</Link></li>
              <li><Link className="nav-link" to="/home" onClick={() => this.props.dispatch({ type: 'LOGOUT' })}>Log Out</Link></li>
              {(this.props.store.user.access_level > 2) && (
                // Only show the admin link if they have access
                <li><Link className="nav-link" to="/day">Admin</Link></li>
              )}
            </>
            // Display the login options and about page if not logged in
            : <>
              <li><Link className="nav-link" to="/home">Login / Register</Link></li>
              <li><Link className="nav-link" to="/about">About</Link></li>
            </>
          }
        </ul>
      </footer>
    );
  }
}

const mapStateToProps = store => ({
  store,
});

export default connect(mapStateToProps)(Footer);
