import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import axios from 'axios';

class InitializeDatesPage extends Component {
  state = {
    status: 'Adding dates…'
  };

  buildYear = (year) => {
    // go through every day of the current and following year
    for (let d = 1; d <= 731; d++) {
      let day = moment().year(year).dayOfYear(d);
      // check if it's a weekday
      if ( day.day() > 0 && day.day() < 6) {
        let thisDay = {
          id: moment(day).format('YYYYMMDD'), // unique integer
          date: moment(day).format('YYYY-MM-DD'), // postgres formate
          year: moment(day).format('YYYY'),
          week: moment(day).week(),
          month: moment(day).format('MMM'),
          weekday: moment(day).format('ddd'),
          day: moment(day).format('D')
        };
        // add the day to the year array
        axios.post('/api/day/add', thisDay);
      } // end if
    } // end for
  }

  componentDidMount() {
    const now = moment();
    this.setState({
      now: now.format(),
      today: now.format('ddd, MMM D, YYYY')
    });
    this.buildYear(2019);
  }

  render() {
    return (
      <div>
        <h2>{this.state.status}</h2>
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

export default connect(mapStateToProps)(InitializeDatesPage);