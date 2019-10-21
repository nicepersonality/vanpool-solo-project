import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import moment from 'moment';

class Home extends Component {
  render() {
    const now = moment();
    const dayId = now.format('YYYYMMDD');
    
    if (now.weekday() > 0 && now.weekday() < 6) {
      // if it's Mon-Fri, redirect to today's view
      return <Redirect to={{ pathname: '/day/' + dayId }} />
    } else {
      // redirect to the user page
      return <Redirect to='/user' />
    }
  }
}

export default Home;
