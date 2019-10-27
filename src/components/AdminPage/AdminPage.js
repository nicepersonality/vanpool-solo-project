import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import AdminVanRte from '../AdminVanRte/AdminVanRte'

class AdminPage extends Component {
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
    console.log('this.props.location.hash:', this.props.location.hash)
    if (this.props.location.hash === '#edit') {
        this.setState({ editMode: true });
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
      <div className="AdminPage-component">
        <h2>Administration</h2>
        {/* Make sure the user is authorized */}
        {(this.props.store.user.access_level > 2)
          ? <div className="adminTools">
            <AdminVanRte />
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
export default withRouter(connect(mapStateToProps)(AdminPage));

