import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';


class Day extends Component {
  state = {
    editMode: false,
    currentDay: null
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'FETCH_DAY',
      payload: 20191021
    });
  }
  render() {
    return (
      <div>
        <pre className="wrapper -thin">{JSON.stringify(this.props, null, 2)}</pre>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  store,
});
export default connect(mapStateToProps)(Day);
