import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { formatPhoneNumber } from 'react-phone-number-input';
import { FaForward, FaBackward } from 'react-icons/fa';

import DayEdit from '../DayEdit/DayEdit';

const classNames = require('classnames');

class Day extends Component {
  state = {
    currentDay: this.props.match.params.dayId,
    prevDay: '',
    nextDay: '',
    riders: [],
    driver: 'Nobody',
    user: this.props.store.user.display_name,
    userRiding: undefined,
    edit: false
  }

  componentDidMount() {
    this.setDayState(this.state.currentDay);
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
    if (prevProps.store.message !== this.props.store.message) {
      this.setState({
        messages: this.props.store.message
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

  setDayState(dayId) {
    this.props.dispatch({
      type: 'FETCH_DAY',
      payload: dayId
    });
    this.props.dispatch({
      type: 'FETCH_MESSAGES',
      payload: { date: dayId }
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
      nextDay: nextDay,
      messages: this.props.store.message
    });
  }

  render() {
    return (
      <div className="Day-component">
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
        <h4 className="userRiding">
          {this.state.user}: <strong>{this.state.userRiding ? 'IN' : 'OUT'}</strong>
        </h4>
        <ul className="riderList">
          {this.state.riders.map((rider) => {
            return (
              <li key={rider.id}>
                <span className="riderName">{rider.display_name}</span>
                <span className="riderCell"><a className="button -outlined" href={'sms:' + rider.cell}>{formatPhoneNumber(rider.cell)}</a></span>
              </li>
            );
          })}
        </ul>
        <h3>Notes</h3>
        {(this.state.messages && this.state.messages.length > 0)
          ?
          <ul>
            {this.state.messages.map((message) => {
              return (
                <li key={message.time}>
                  <h4>{message.display_name}, {moment(message.time).format('MMM D, h:mm a')}</h4>
                  <blockquote>{message.content}</blockquote>
                </li>
              );
            })}
          </ul>
          :
          <div>No notes</div>
        }

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
export default connect(mapStateToProps)(Day);
