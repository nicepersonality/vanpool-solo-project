import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Nav from '../Nav/Nav';

class Header extends Component {
  state = {
    today: null
  }

  componentDidMount() {
    const todayVerbose = moment().format('ddd, MMM D, YYYY');
    this.setState({
      today: todayVerbose
    });
  }

  render() {
    return (
      <header className="Header-component">
        <h1 className="nav-title">
          <Link to="/home">Van Hailin’!</Link>
        </h1>
        {
          this.state.today
          ? <p>Today is <b>{this.state.today}</b>.</p>
          : <p className="warning">There was a problem loading the date.</p>
        }
        <Nav />
      </header>
    );
  }
}

const mapStateToProps = store => ({
  store,
});

export default connect(mapStateToProps)(Header);
