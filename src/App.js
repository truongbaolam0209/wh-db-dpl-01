import 'antd/dist/antd.css';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import PageDashboard from './layouts/PageDashboard';


const App = () => {

   return (
      <BrowserRouter>
         <Switch>
            <Route exact path='/' component={PageDashboard} />
            {/* <Route exact path='/dashboard' component={PageDashboard} /> */}
         </Switch>
      </BrowserRouter>
   );
};

export default App;
