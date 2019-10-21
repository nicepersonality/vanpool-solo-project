import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import {connect} from 'react-redux';

import moment from 'moment';

import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';

import ProtectedRoute from '../ProtectedRoute/ProtectedRoute'

import AboutPage from '../AboutPage/AboutPage';
import UserPage from '../UserPage/UserPage';
import InfoPage from '../InfoPage/InfoPage';
import Day from '../Day/Day';

import 'cutestrap/dist/css/cutestrap.min.css';
import './App.css';

class App extends Component {
  state = {
    today: {
      date: '',
      week: '',
      month: '',
      year: '',
      day: ''
    }
  }

  componentDidMount () {
    this.props.dispatch({type: 'FETCH_USER'});
    const now = moment();
    this.setToday(now);
  }

  setToday = (day) => {
    const todayDate = moment(day).format('D');
    const todayWeek = moment(day).week();
    const todayMonth = moment(day).format('MMM');
    const todayYear = moment(day).format('YYYY');
    const todayDay = moment(day).format('ddd');
    this.setState({
      today: {
        date: todayDate,
        week: todayWeek,
        month: todayMonth,
        year: todayYear,
        day: todayDay
      }
    });
  }

  render() {
    return (
      <Router>
        <div>
          <Nav />
          <Switch>
            {/* Visiting localhost:3000 will redirect to localhost:3000/home */}
            <Redirect exact from="/" to="/home" />
            {/* Visiting localhost:3000/about will show the about page.
            This is a route anyone can see, no login necessary */}
            <Route
              exact
              path="/about"
              component={AboutPage}
            />
            {/* For protected routes, the view could show one of several things on the same route.
            Visiting localhost:3000/home will show the UserPage if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the 'Login' or 'Register' page.
            Even though it seems like they are different pages, the user is always on localhost:3000/home */}
            <ProtectedRoute
              exact
              path="/home"
              component={UserPage}
            />
            {/* This works the same as the other protected route, except that if the user is logged in,
            they will see the info page instead. */}
            <ProtectedRoute
              exact
              path="/info"
              component={InfoPage}
            />
            {/* This shows the details for a given day */}
            <ProtectedRoute
              path="/day/:dayId"
              component={Day}
            />
            {/* If none of the other routes matched, we will show a 404. */}
            <Route render={() => <h1>404</h1>} />
          </Switch>
          <Footer />
        </div>
      </Router>
  )}
}

export default connect()(App);
