import React, { Component } from 'react';
import { connect } from 'react-redux';
// import moment from 'moment';
import { FaShuttleVan, FaPlusCircle, FaTimesCircle } from 'react-icons/fa';
import { GiSteeringWheel } from 'react-icons/gi';

const classNames = require('classnames');

class DayEdit extends Component {
  state = {
    currentDay: this.props.currentDay,
    isRiding: false,
    isDriving: false,
    noDriver: false
  }

  componentDidMount() {
    // this.setButtonStatus();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.store !== this.props.store) {
      this.setButtonStatus();
    }
  }

  setButtonStatus = () => {
    const newRiders = this.props.store.day.riders;
    const isRiding = newRiders.find(rider => rider.id === this.props.store.user.id)
      ? true
      : false;
    const isDriving = this.props.store.day.driver
      ? (this.props.store.day.driver.id === this.props.store.user.id)
      : false;
    const noDriver = (this.props.store.day.driver_id === null)
    this.setState({
      isRiding: isRiding,
      isDriving: isDriving,
      noDriver: noDriver
    });
  }

  render() {
    return (
      <div className="DayEdit-component">
        {/* {JSON.stringify(this.state, null, 1)} */}
        <button
          className={ classNames(
            'button', '-small', '-outlined', 'svg-combo',
            {'isRiding': this.state.isRiding}
          )}
          onClick={() => this.props.dispatch({
            type: 'CHANGE_RIDE_STATUS',
            payload: {
              dayId: this.state.currentDay, userId: this.props.store.user.id, rideStatus: this.state.isRiding
            }
          }
        )}>
          <FaShuttleVan/> <b>Riding:</b>
          {
            this.state.isRiding
            ? <><b>YES</b> <FaPlusCircle/></>
            : <><b>NO</b> <FaTimesCircle/></>
          }
        </button>
        <button
          className={ classNames(
            'button', '-small', '-outlined', 'svg-combo',
            {
              'isDriving': this.state.isDriving,
              'noDriver': this.state.noDriver
            }
          )}
          onClick={() => this.props.dispatch({
            type: 'CHANGE_DRIVE_STATUS',
            payload: {
              dayId: this.state.currentDay, userId: this.props.store.user.id, driveStatus: this.state.isDriving
            }
          }
        )}>
          <GiSteeringWheel/> <b>Driving:</b>
          {
            this.state.isDriving
            ? <><b>YES</b> <FaPlusCircle/></>
            : <><b>NO</b> <FaTimesCircle/></>
          }
        </button>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  store,
});
export default connect(mapStateToProps)(DayEdit);
