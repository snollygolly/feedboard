import React from 'react';
import { Router, Route, Link, browserHistory } from 'react-router';

import AppComponent from '../AppComponent';

class RootComponent extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={AppComponent}>
        </Route>
      </Router>
    );
  }
}
export default RootComponent;
