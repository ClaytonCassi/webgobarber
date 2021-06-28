import React from "react";
import GlobalStyle from './styles/global';
import SignIn from './pages/SignIn';
import { BrowserRouter as Router } from 'react-router-dom';
//import SignUp from './pages/SignUp';

import AppProvider  from "./hooks"

import Routes from './routes'


const App: React.FC = () =>  (
  <Router>
  <AppProvider>
  <Routes/>
  </AppProvider>

     <GlobalStyle/>
 </Router>
)

export default App;
