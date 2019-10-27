import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { FaForward, FaBackward } from 'react-icons/fa';

import DayEdit from '../DayEdit/DayEdit';
import DayList from '../DayList/DayList';

const classNames = require('classnames');

class Week extends Component {
  state = {
    currentDay: this.props.match.params.dayId,
    currentWeek: [],
    prevDay: '',
    nextDay: '',
    riders: [],
    driver: 'Nobody',
    user: this.props.store.user.display_name,
    userRiding: undefined,
    edit: false
  }

  componentDidMount() {
    // this.setDayState(this.state.currentDay);
    this.getWeek(this.state.currentDay);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.store.day.riders !== this.props.store.day.riders) {
      const newRiders = this.props.store.day.riders;
      const userRiding = newRiders.find(
        rider => rider.id === this.props.store.user.id
      ) ? true : false;
      this.setState({
        riders: newRiders,
        userRiding: userRiding
      });
    }
    if (prevProps.store.day.driver !== this.props.store.day.driver) {
      // ternary operator here, in case there's no driver
      const newDriver = this.props.store.day.driver ? this.props.store.day.driver.display_name : 'Nobody';
      this.setState({
        driver: newDriver
      });
    }
    if (prevProps.match.params.dayId !== this.props.match.params.dayId) {
      this.setState({
        currentDay: this.props.match.params.dayId
      });
      this.setDayState(this.props.match.params.dayId);
    }
  }

  dayFormat = (format) => {
    // a shorter way to render (parts of) the current day
    return moment(this.state.currentDay, 'YYYYMMDD').format(format);
  }

  getWeek = (date) => {
    let workWeek = []
    // find the Monday of the current week (or the next, if it's Saturday)
    const weekBase = moment(date, 'YYYYMMDD').add(1, 'days').day('Monday');
    for (let d = 1; d <= 5; d++) {
      const newDay = weekBase.day(d).format('YYYYMMDD');
      workWeek.push(newDay);
    }
    this.setState({
      currentWeek: workWeek
    });
  }

  setDayState(dayId) {
    this.props.dispatch({
      type: 'FETCH_DAY',
      payload: dayId
    });
    const dayOfWeek = moment(dayId, 'YYYYMMDD').weekday();
    // calculate the previous and next days, skipping weekends
    let prevDay = 0;
    let nextDay = 0;
    if (dayOfWeek === 1) {
      prevDay = moment(dayId, 'YYYYMMDD').subtract(3, 'days').format('YYYYMMDD');
    } else {
      prevDay = moment(dayId, 'YYYYMMDD').subtract(1, 'days').format('YYYYMMDD');
    }
    if (dayOfWeek === 5) {
      nextDay = moment(dayId, 'YYYYMMDD').add(3, 'days').format('YYYYMMDD');
    } else {
      nextDay = moment(dayId, 'YYYYMMDD').add(1, 'days').format('YYYYMMDD');
    }
    this.setState({
      prevDay: prevDay,
      nextDay: nextDay
    });
  }

  render() {
    return (
      <div className="Week-component">
        {console.log('this.state.currentWeek:', this.state.currentWeek)}
        {console.log('this.state.currentWeek[0]:', this.state.currentWeek[0])}
        {this.state.currentWeek.map((weekday) => {
          return (
            <DayList key={weekday} currentDay={weekday} />
          );
        })}
        <div className="dayDetails">
          <h2 className={classNames(
            'currentDay',
            {
              'in': this.state.userRiding,
              'noDriver': this.state.driver === 'Nobody'
            }
          )}>
            <span className="currentDow">{this.dayFormat('ddd')}</span>
            <span className="currentMon">{this.dayFormat('MMM')}</span>
            <span className="currentDate">{this.dayFormat('DD')}</span>
          </h2>
          <div className="prevDayLink">
            <Link className="svg-combo" to={{ pathname: '/day/' + this.state.prevDay }}><FaBackward /><b>Previous</b></Link>
          </div>
          <div className="nextDayLink">
            <Link className="svg-combo" to={{ pathname: '/day/' + this.state.nextDay }}><b>Next</b><FaForward /></Link>
          </div>
          <div className="riderCount"><strong>{this.state.riders.length}</strong> rider{this.state.riders.length !== 1 && 's' /* pluralize unless it's 1 */}</div>
          <div className="driverInfo"><strong>{this.state.driver}</strong> is driving</div>
          {
            this.props.location.hash === '#edit' &&
            <DayEdit currentDay={this.state.currentDay} />
          }
        </div>

        <hr /><pre className="wrapper -thin">this.state=
        {JSON.stringify(this.state, null, 2)}</pre>

        <hr /><pre className="wrapper -thin">this.props=
        {JSON.stringify(this.props, null, 2)}</pre>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  store,
});
export default connect(mapStateToProps)(Week);
