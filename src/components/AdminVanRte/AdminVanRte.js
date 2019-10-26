import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class AdminVanRte extends Component {
  state = {
    name: '',
    description: '',
    max_seats: 0,
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

  handleInputChangeFor = propertyName => (event) => {
    this.setState({
      [propertyName]: event.target.value
    });
  }
  handleSubmit = (event) => {
    event.preventDefault();
    this.props.dispatch({
      type: 'UPDATE_ROUTE',
      payload: {
        id: 1,
        name: this.state.name,
        description: this.state.description,
        max_seats: this.state.max_seats
      },
    });
  } // end handleSubmit


  checkEditAccess() {
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
      <div className="AdminVanRte-component">
        {/* Make sure the user is authorized */}
        {(this.props.store.user.access_level > 2)
          ? <div className="adminTools">
            <h3>Van Route</h3>
            {(this.state.editMode === true)
              ? <div className="userView -edit">
                <form className="wrapper -thin" onSubmit={this.handleSubmit}>
                  <div>
                    <label htmlFor="name" className="field">
                      <input
                        type="text"
                        name="name"
                        value={this.state.name}
                        onChange={this.handleInputChangeFor('name')}
                      />
                      <span className="label">Route Name</span>
                    </label>
                  </div>
                  <div>
                    <label htmlFor="description" className="field">
                      <textarea
                        type="text"
                        name="description"
                        value={this.state.description}
                        onChange={this.handleInputChangeFor('description')}
                      />
                      <span className="label">Route description</span>
                    </label>
                  </div>
                  <div>
                    <label htmlFor="max_seats" className="field">
                      <input
                        type="number"
                        name="max_seats"
                        value={this.state.max_seats}
                        onChange={this.handleInputChangeFor('max_seats')}
                      />
                      <span className="label">Maximum seating capacity</span>
                    </label>
                  </div>
                  <div>
                    <button
                      className="button"
                      type="submit"
                      name="submit"
                    >Save Changes</button>
                  </div>
                </form>
              </div>

              : <div className="adminTools">
                  <p>Route name: {this.state.name}</p>
                  <p>Route description: {this.state.description}</p>
                  <p>Maximum seating capacity: {this.state.max_seats}</p>
              </div>
            }

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
export default withRouter(connect(mapStateToProps)(AdminVanRte));

