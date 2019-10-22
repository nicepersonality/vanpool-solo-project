import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const Nav = (props) => (
  <nav className="Nav-component">
    {/* display the calendar nav links if the user is logged in,
    and the Login/Register & About links if not */}
    <ul className="topNav">
      {( props.store.user.id )
        // Display the calendar nav links if the user is logged in
        ? <>
          <li><Link className="nav-link" to="/day">Day</Link></li>
          <li><Link className="nav-link" to="/day">Week</Link></li>
          <li><Link className="nav-link" to="/day">Month</Link></li>
        </>
        // Display the login options and about page if not logged in
        : <>
          <li><Link className="nav-link" to="/home">Login / Register</Link></li>
          <li><Link className="nav-link" to="/about">About</Link></li>
        </>
      }
    </ul>
  </nav>
);

const mapStateToProps = store => ({
  store,
});

export default connect(mapStateToProps)(Nav);
