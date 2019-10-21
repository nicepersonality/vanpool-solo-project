import React, { Component } from 'react';
import { connect } from 'react-redux';


class InfoPage extends Component {
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
export default connect(mapStateToProps)(InfoPage);
