import React, { Component } from 'react';
import { connect } from 'react-redux';


class Pending extends Component {
  // componentDidMount() {
  //   this.props.dispatch({
  //     type: 'FETCH_DAY',
  //     payload: 20191021
  //   });
  // }
  render() {
    return (
      <div>
        <h3>Confirmation Pending</h3>
        <p>Thanks for registering!</p>
        <p>Once an administrator approves your account, you will have access to the vanpool schedule.</p>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  store,
});
export default connect(mapStateToProps)(Pending);
