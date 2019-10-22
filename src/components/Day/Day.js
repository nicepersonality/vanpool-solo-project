import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { formatPhoneNumber } from 'react-phone-number-input'

import DayEdit from '../DayEdit/DayEdit';

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
    console.log('this.props.location.hash', this.props.location.hash);
    
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
      <div className="Day-component">
        <div className="dayDetails">
          <h2 className="currentDay">
            <span className="currentMon">{moment(this.state.currentDay, 'YYYYMMDD').format('MMM')}</span> 
            <span className="currentDate">{moment(this.state.currentDay, 'YYYYMMDD').format('DD')}</span> 
            <span className="currentDow">{moment(this.state.currentDay, 'YYYYMMDD').format('ddd')}</span>
          </h2>
          <div className="editDayLink">
            {
              this.props.location.hash === '#edit'
                ?
              <DayEdit currentDay={this.state.currentDay} />
                :
              <Link to={{ pathname: '/day/' + this.state.currentDay, hash: '#edit' }}>Edit</Link>
            }
          </div>
          <div className="prevDayLink">
            <Link to={{ pathname: '/day/' + this.state.prevDay }}>Previous</Link>
          </div>
          <div className="nextDayLink">
            <Link to={{ pathname: '/day/' + this.state.nextDay }}>Next</Link>
          </div>
          <div className="riderCount"><strong>{this.state.riders.length}</strong> rider{this.state.riders !== 1 && 's' /* pluralize unless it's 1 */}</div>
          <div className="driverInfo"><strong>{this.state.driver}</strong> is driving</div>
        </div>
        <div className="userRiding">
          {this.state.user}: <strong>{this.state.userRiding ? 'IN' : 'OUT'}</strong>
        </div>
        <ul className="riderList">
        {this.state.riders.map((rider) => {
            return (
              <li key={rider.id}>
                <span className="riderName">{rider.display_name}</span>
                <span className="riderCell"><a href={'sms:' + rider.cell}>{formatPhoneNumber(rider.cell)}</a></span>
              </li>
            );
          })}
        </ul>

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
