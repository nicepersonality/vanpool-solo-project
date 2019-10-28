import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { formatPhoneNumber } from 'react-phone-number-input';
import swal from '@sweetalert/with-react';

class AdminUsers extends Component {
  state = {
    editMode: false,
    access_level: this.props.user.access_level
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

  handleAccessChange = (event) => {
    this.setState({
      access_level: event.target.value
    });
    this.props.dispatch({
      type: 'CHANGE_USER_ACCESS',
      payload: {
        userId: this.props.user.id,
        access_level: event.target.value
      },
    });
  }
  handleDelete = (event) => {
    event.preventDefault();
    swal({
      title: "Delete user?",
      text: "Are you sure? This cannot be undone!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          this.props.dispatch({
            type: 'DELETE_USER',
            payload: {
              userId: this.props.user.id,
            },
          });
          swal("The user has been deleted!", {
            icon: "success",
          });
        } else {
          swal("The user will not be deleted.");
        }
      });
  } // end handleDelete

  render() {
    return (
      <li className="AdminUsers-component">
        <h4>{this.props.user.full_name}</h4>
        <div>“{this.props.user.display_name}”</div>
        <div><a href={`mailto:${this.props.user.username}`}>{this.props.user.username}</a></div>
        <div><a href={`sms:${this.props.user.cell}`}>{formatPhoneNumber(this.props.user.cell)}</a></div>
        {(this.state.editMode === true)
          ? <>
            <div>
              <label htmlFor="accessSelect" className="field">
                <select name="accessSelect"
                  value={this.state.access_level}
                  onChange={this.handleAccessChange}
                >
                  {(this.props.user.access_level < 1) &&
                    <option value="0">{this.userAccessDescribe(0)}</option>
                  }
                  <option value="1">{this.userAccessDescribe(1)}</option>
                  <option value="2">{this.userAccessDescribe(2)}</option>
                  <option value="3">{this.userAccessDescribe(3)}</option>
                </select>
                <span className="label">Access level</span>
              </label>
            </div>
            {(this.props.user.access_level < 1) &&
              <div>
                <button onClick={this.handleDelete} className="button -outlined">Delete user</button>
              </div>
            }
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

