import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';

class Home extends Component {
  render() {
    if (this.props.store.user.access_level < 1) {
      return <Redirect to='/pending' />
    }

    const now = moment();
    const dayId = now.format('YYYYMMDD');
    
    if (now.weekday() === 0) {
      // if it's Sunday, add a day
      return <Redirect to={{ pathname: '/day/' + now.add(1, 'days').format('YYYYMMDD') }} />
    } else if (now.weekday === 6) {
      // if it's Saturday, add two days
      return <Redirect to={{ pathname: '/day/' + now.add(2, 'days').format('YYYYMMDD') }} />
    }
    // otherwise, show today's info
    return <Redirect to={{ pathname: '/day/' + dayId }} />
  }
}

const mapStateToProps = store => ({
  store,
});
export default connect(mapStateToProps)(Home);
