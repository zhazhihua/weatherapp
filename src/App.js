import './App.css';
import Home from './page/Home/Home.jsx'
import City from './page/city/city.jsx'
import {Route,Redirect} from 'react-router-dom'
function App() {
  return (
    <div>
      <Route exact path="/home" component={Home}/>
      <Route path="/city" component={City}/>
      <Redirect exact from="/" to="home"/>
    </div>
  );
}

export default App;
