import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import moment from 'moment';
// import { FaForward, FaBackward } from 'react-icons/fa';

// import DayEdit from '../DayEdit/DayEdit';

// const classNames = require('classnames');

class Week extends Component {
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
      <div className="Week-component">
        hello world
      </div>
    );
  }
}

const mapStateToProps = store => ({
  store,
});
export default connect(mapStateToProps)(Week);
