import React, { Component } from 'react';
import { connect } from 'react-redux';


class InfoPage extends Component {
  componentDidMount() {
    this.props.dispatch({
      type: 'FETCH_DAY',
      payload: {date: 20191021, userId: this.props.store.user.id}
    });
    this.props.dispatch({
      type: 'FETCH_DAY',
      payload: {date: 20191022, userId: this.props.store.user.id}
    });
    this.props.dispatch({
      type: 'FETCH_DAY',
      payload: {date: 20191023, userId: this.props.store.user.id}
    });
  }
  render() {
    return (
      <div>
        <pre className="wrapper -thin">{JSON.stringify(this.props.store, null, 2)}</pre>
        <button onClick={() => this.props.dispatch({ type: 'FETCH_DAY', payload: {date: 20191021, userId: this.props.store.user.id} })}>20191021</button>
        <button onClick={() => this.props.dispatch({ type: 'FETCH_DAY', payload: {date: 20191022, userId: this.props.store.user.id} })}>20191022</button>
        <button onClick={() => this.props.dispatch({ type: 'FETCH_DAY', payload: {date: 20191023, userId: this.props.store.user.id} })}>20191023</button>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  store,
});
export default connect(mapStateToProps)(InfoPage);
