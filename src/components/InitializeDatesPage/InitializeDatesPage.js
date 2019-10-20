import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

class InitializeDatesPage extends Component {
  state = {
    queryText: ''
  };

  buildYear = (year) => {
    // go through every day of the current and following year
    let query = `INSERT INTO "days" (id, date, year, week, month, weekday, day)
VALUES `;
    for (let d = 1; d <= 731; d++) {
      let day = moment().year(year).dayOfYear(d);
      // check if it's a weekday
      if ( day.day() > 0 && day.day() < 6) {
        let thisDay = {
          id: moment(day).format('YYYYMMDD'), // unique integer
          date: moment(day).format('YYYY-MM-DD'), // postgres format
          year: moment(day).format('YYYY'),
          week: moment(day).week(),
          month: moment(day).format('M'),
          weekday: moment(day).format('ddd'),
          day: moment(day).format('D')
        };
        // add the day to the query string
        query += `
(${thisDay.id}, '${thisDay.date}', ${thisDay.year}, ${thisDay.week}, ${thisDay.month}, '${thisDay.weekday}', ${thisDay.day}),`;
      } // end if
    } // end for
    // replace final comma with semicolon
    query = query.slice(0, -1) + ';';
    this.setState({queryText: query});
  }

  componentDidMount() {
    this.buildYear(2019);
  }

  render() {
    return (
      <div>
        <h2>Run this query on the <code>vanpool</code> database:</h2>
        <pre>{this.state.queryText}</pre>
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