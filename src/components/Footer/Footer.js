import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

class Footer extends Component {
  state = {
    hash: window.location.hash 
  }
  render() {
    return (
      <footer className="Footer-component">
        {/* {JSON.stringify(this.props, null, 2)} */}
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
              {(this.props.location.hash !== '#edit')
                // Toggle edit move based on hash
                ? <li><Link className="nav-link" to={{ hash: '#edit' }}>Edit</Link></li>
                : <li><Link className="nav-link isEditing" to={{ hash: '' }}>Stop</Link></li>
              }
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

export default withRouter(connect(mapStateToProps)(Footer));
