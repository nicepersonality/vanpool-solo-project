import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import moment from 'moment';
import { FaForward, FaBackward } from 'react-icons/fa';

import DayEdit from '../DayEdit/DayEdit';

const classNames = require('classnames');

class DayDetails extends Component {
  state = {
    prevDay: '',
    nextDay: '',
    riders: [],
    driver: 'Nobody',
    user: this.props.store.user.display_name,
    userRiding: undefined,
  }

  componentDidMount() {
    console.log('DayDetails did mount!');
    console.log('this.props.currentDay:', this.props.currentDay);
    this.props.dispatch({
      type: 'FETCH_DAY',
      payload: { date: this.props.currentDay, userId: this.props.store.user.id }
    });

    this.setDayState(this.props.currentDay);
  }

  componentDidUpdate(prevProps) {
    if ((prevProps.store.day[this.props.currentDay] !== this.props.store.day[this.props.currentDay])) {
      console.log('DayDetails did update!')
      console.log('this.props.currentDay:', this.props.currentDay);
      // this.props.dispatch({
      //   type: 'FETCH_DAY',
      //   payload: {date: this.props.currentDay, userId: this.props.store.user.id}
      //   // payload: this.props.currentDay
      // });
      const newRiders = this.props.store.day[this.props.currentDay].riders;
      const userRiding = newRiders.find(
        rider => rider.id === this.props.store.user.id
      ) ? true : false;
      this.setState({
        riders: newRiders,
        userRiding: userRiding
      });
      // ternary operator here, in case there's no driver
      const newDriver = this.props.store.day[this.props.currentDay].driver ? this.props.store.day[this.props.currentDay].driver.display_name : 'Nobody';
      this.setState({
        driver: newDriver
      });
    }
    // if (prevProps.match.params.dayId !== this.props.match.params.dayId) {
    //   this.setState({
    //     currentDay: this.props.match.params.dayId
    //   }, () => {
    //     this.setDayState(this.props.match.params.dayId)
    //   });
    // }
  }

  dayFormat = (format) => {
    // a shorter way to render (parts of) the current day
    return moment(this.props.currentDay, 'YYYYMMDD').format(format);
  }

  handleDayClick = (event) => {
    event.preventDefault();
    if (this.props.location.hash === '#edit') {
      // if this instance is in Edit mode in any view,
      // tapping the date will toggle ridership
      this.props.dispatch({
        type: 'CHANGE_RIDE_STATUS',
        payload: {
          dayId: this.props.currentDay, userId: this.props.store.user.id, rideStatus: this.state.userRiding
        }
      });
    } else if (this.props.inMultidayView) {
      // if this instance is in Week or Month views but not edit mode,
      // tapping the date will bring up the day page
      this.props.history.push(`/day/${this.props.currentDay}`);
    } else {
      // if this instance is in Day view but not edit mode,
      // tapping the date will do nothing
      return;
    }
  }

  setDayState(dayId) {
    console.log('in DayDetails -> setDayState');

    this.props.dispatch({
      type: 'FETCH_DAY',
      payload: {date: this.props.currentDay, userId: this.props.store.user.id}
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

    const newRiders = this.props.store.day[this.props.currentDay].riders;
    const userRiding = newRiders.find(
      rider => rider.id === this.props.store.user.id
    ) ? true : false;
    // ternary operator here, in case there's no driver
    const newDriver = this.props.store.day[this.props.currentDay].driver ? this.props.store.day[this.props.currentDay].driver.display_name : 'Nobody';
    this.setState({
      prevDay: prevDay,
      nextDay: nextDay,
      riders: newRiders,
      userRiding: userRiding,
      driver: newDriver
    });
  }

  render() {
    return (<>
      <div className="DayDetails-component dayDetails">
        <h2 className={classNames(
          'currentDay',
          {
            'in': this.state.userRiding,
            'noDriver': this.state.driver === 'Nobody'
          }
        )}
          onClick={this.handleDayClick}
        >
          <span className="currentDow">{this.dayFormat('ddd')}</span>
          <span className="currentMon">{this.dayFormat('MMM')}</span>
          <span className="currentDate">{this.dayFormat('DD')}</span>
        </h2>
        {
          this.props.displayDayNav &&
          <>
            <div className="prevDayLink">
              <Link className="svg-combo" to={{ pathname: '/day/' + this.state.prevDay }}><FaBackward /><b>Previous</b></Link>
            </div>
            <div className="nextDayLink">
              <Link className="svg-combo" to={{ pathname: '/day/' + this.state.nextDay }}><b>Next</b><FaForward /></Link>
            </div>
          </>
        }
        <div className="riderCount"><strong>{this.state.riders.length}</strong> rider{this.state.riders.length !== 1 && 's' /* pluralize unless it's 1 */}</div>
        <div className="driverInfo"><strong>{this.state.driver}</strong> is driving</div>
        {
          this.props.location.hash === '#edit' &&
          <DayEdit currentDay={this.props.currentDay} />
        }
      </div>
      <div>
        <hr /><pre className="wrapper -thin">DayDetail's this.state=
        {JSON.stringify(this.state, null, 2)}</pre>

        <hr /><pre className="wrapper -thin">DayDetail's this.props=
        {JSON.stringify(this.props, null, 2)}</pre>
      </div></>
    );
  }
}

const mapStateToProps = store => ({
  store,
});
export default withRouter(connect(mapStateToProps)(DayDetails));
