import './App.css';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import axios from 'axios';
import Home from './components/Home';
import Question from './components/Question';
import Profile from './components/Profile';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import {Navbar, Container} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/question/:question_id" component={Question} />
      <Route exact path="/profile/:user_id" component={Profile} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />
      <Route exact path="/dashboard" component={Dashboard} />
    </Switch>
    </Router>
  );
}

export default App;
