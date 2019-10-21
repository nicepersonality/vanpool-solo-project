import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
// import moment from 'moment';


class DayEdit extends Component {
  state = {
    currentDay: this.props.currentDay,
    isRiding: false,
    isDriving: false
  }

  componentDidUpdate(prevProps) {
    if (prevProps.store !== this.props.store) {
      const newRiders = this.props.store.day.riders;
      const isRiding = newRiders.find(rider => rider.id === this.props.store.user.id)
        ? true
        : false;
      const isDriving = this.props.store.day.driver
        ? (this.props.store.day.driver.id === this.props.store.user.id)
        : false;
      this.setState({
        isRiding: isRiding,
        isDriving: isDriving
      });
    }
  }


  // setDayState(dayId) {
  //   this.props.dispatch({
  //     type: 'FETCH_DAY',
  //     payload: dayId
  //   });
  // }

  render() {
    return (
      <div className="DayEdit-component">
        {/* {JSON.stringify(this.state, null, 1)} */}
        <button className="button" onClick={()=>this.props.dispatch({type: 'CHANGE_RIDE_STATUS', payload: {dayId: this.state.currentDay, userId: this.props.store.user.id, rideStatus: this.state.isRiding}})}>Riding: {this.state.isRiding?'YES':'NO'}</button>
        <button className="button" onClick={()=>this.props.dispatch({type: 'CHANGE_DRIVE_STATUS', payload: {dayId: this.state.currentDay, userId: this.props.store.user.id, driveStatus: this.state.isDriving}})}>Driving: {this.state.isDriving?'YES':'NO'}</button>
        <div>
          <Link to={{ pathname: '/day/' + this.state.currentDay, hash: '' }}>Stop editing</Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  store,
});
export default connect(mapStateToProps)(DayEdit);
