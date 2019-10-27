import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class AdminUsers extends Component {
  componentDidMount() {
    this.checkEditAccess();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match !== this.props.match) {
      this.checkEditAccess();
    }
    if (prevProps.store.user !== this.props.store.user) {
      this.checkEditAccess();
    }
  }

  checkEditAccess() {
    if (this.props.location.hash === '#edit') {
      if ((this.props.store.access_level > 2)) {
        this.setState({ editMode: true });
      } else {
        this.props.history.push({ pathname: this.props.location.pathname, hash: '' });
      }
    } else {
      this.setState({ editMode: false });
    }
  }

  userAccessDescribe(access) {
    access = parseInt(access);
    if (access === 0) return 'Unconfirmed user';
    if (access === 1) return 'Inactive user';
    if (access === 2) return 'Vanpool member';
    if (access > 2) return 'Administrator';
    return '';
  }

  render() {
    return (
      <div className="AdminUsers-component">
        {/* Make sure the user is authorized */}
        {(this.props.store.user.access_level > 2)
          ? <div className="adminTools">
            <p>Admin controls go here</p>
          </div>
          : <div className="adminTools -unauthorized">
            <h3>Unauthorized</h3>
            <p>Sorry! You must be an administrator to view this page.</p>
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = store => ({
  store,
});
export default withRouter(connect(mapStateToProps)(AdminUsers));

