import './App.css';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import axios from 'axios';
import Home from './components/Home';
import Question from './components/Question';
import Profile from './components/Profile';
import {Navbar, Container} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// axios.defaults.baseURL = 'http://localhost:8888';

function App() {
  return (
    <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/question/:question_id" component={Question} />
      <Route exact path="/profile/:user_id" component={Profile} />
    </Switch>
    </Router>
  );
}

export default App;
