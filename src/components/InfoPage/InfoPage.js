import React, { Component } from 'react';
import { connect } from 'react-redux';


class InfoPage extends Component {
  componentDidMount() {
    this.props.dispatch({
      type: 'FETCH_WEEK',
      payload: {
        dayId: 20191031,
        userId: this.props.store.user.id
      }
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
