import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
  // Link,
  // useRouteMatch,
} from "react-router-dom";
import Login from './components/Login';
import Signup from './components/Signup';
import CurdForm from './components/CurdForm';

const PrivateRoute = ({ element }) => {
  const authToken = localStorage.getItem('authToken');
  return authToken ? element : <Navigate to="/" />;
};

function App() {
  return (
    <>
    <Router>
   <div>
   <Routes>
    <Route path="/" element={<Login/>} />
    <Route path="/signup" element={<Signup/>} />
    <Route path="/crudForm" element={<PrivateRoute element={<CurdForm />} />} />
    {/* <Route path="/createuser" element={<SignUp />} /> */}
   </Routes>
   </div>

    </Router>
    </>
  );
}

export default App;
