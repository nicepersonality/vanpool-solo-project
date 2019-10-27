import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { formatPhoneNumber } from 'react-phone-number-input';

class AdminUsers extends Component {
  state = {
    editMode: false
  }
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
      this.setState({ editMode: true });
    } else {
      this.setState({ editMode: false });
    }
  }

  userAccessDescribe(access) {
    access = parseInt(access);
    if (access === 0) return 'Pending user';
    if (access === 1) return 'Inactive user';
    if (access === 2) return 'Vanpool member';
    if (access > 2) return 'Administrator';
    return '';
  }

  render() {
    return (
      <li className="AdminUsers-component">
        <h4>{this.props.user.full_name}</h4>
        <div>“{this.props.user.display_name}”</div>
        <div><a href={`mailto:${this.props.user.username}`}>{this.props.user.username}</a></div>
        <div><a href={`sms:${this.props.user.cell}`}>{formatPhoneNumber(this.props.user.cell)}</a></div>
        {(this.state.editMode === true)
          ? <>
            <div>TODO: add editing features</div>
          </>
          : <>
            <div>{this.userAccessDescribe(this.props.user.access_level)}</div>
          </>
        }
      </li>
    );
  }
}

const mapStateToProps = store => ({
  store,
});
export default withRouter(connect(mapStateToProps)(AdminUsers));

