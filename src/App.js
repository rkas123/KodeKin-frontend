import Header from './components/Header/Header';
import Login from './components/Login/Login';
import SignUp from './components/SignUp/Signup';
import Password from './components/Password/Password';
import Home from './components/Home/Home';
import {BrowserRouter as Router,Route} from 'react-router-dom';
import { ContextProvider } from './contexts/context';

import './App.css';

function App() {
  return (
    <>
    <ContextProvider>
      <Router>
        <Header/>
        <Route path="/login" exact  component={Login}/>
        <Route path="/signup" exact component={SignUp}/>
        <Route path="/forgotPassword" exact component={Password}/>
        <Route path="/" exact component={Home}/>
      </Router>
    </ContextProvider>
      
    </>
  );
}

export default App;
