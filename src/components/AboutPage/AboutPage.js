import React, { Component } from 'react';
import { connect } from 'react-redux';


class AboutPage extends Component {
  componentDidMount() {
    this.props.dispatch({ type: 'FETCH_ROUTE' });
  }
  render() {
    return (
      <div className="AboutPage-component">
        <h2>About Van Hailin’!</h2>
        <p>VH! is a web app to simplify the coordination of vanpool riders, drivers, and schedulers.</p>
        { (this.props.store.route[0])
          && <>
          <h3>About this route</h3>
          <p>This installation serves the route <strong>{this.props.store.route[0].name}</strong>.</p>
          <p>The adminstrator has provided additional information:</p>
          <blockquote>{this.props.store.route[0].description}</blockquote>
        </>}
        <pre className="wrapper -thin">{JSON.stringify(this.props, null, 2)}</pre>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  store,
});
export default connect(mapStateToProps)(AboutPage);
