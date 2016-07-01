import React from 'react';
import { render } from 'react-dom';
import AppComponent from './components/AppComponent';
import injectTapEventPlugin from "react-tap-event-plugin";

import '../assets/css/custom.css';

injectTapEventPlugin();

const rootInstance = render(<AppComponent />, document.getElementById('react-wrapper'));

if(module.hot) {
  require('react-hot-loader/Injection').RootInstanceProvider.injectProvider({
    getRootInstances: function () {
      // Help React Hot Loader figure out the root component instances on the page:
      return [rootInstance];
    }
  });
}
