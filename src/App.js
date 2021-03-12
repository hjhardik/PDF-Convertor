import React from "react"
//importing all the elements into the main App
import { BrowserRouter as Router, Route, Redirect} from 'react-router-dom'
//import css
import './App.css';
import Header from "./components/HeaderFooter/Header";
import Footer from "./components/HeaderFooter/Footer";
import Register from "./components/SignIn/Register";
import Login from "./components/SignIn/Login";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "./components/Draft/Dashboard";
import UserToken from "./UserToken";
import Viewer from './components/Viewer/Viewer';
import SignAuthorize from './components/Viewer/SignAuthorize';
import MergeFile from './components/Viewer/MergeFile';
import SplitFile from './components/Viewer/SplitFile';
import DeletePage from './components/Viewer/DeletePage';
import ReorderPage from './components/Viewer/ReorderPage';


function App() {
  // token based authentication used for login/signup
  const {token, setToken} = UserToken();
  return (
    <Router>
        <Route exact path="/">
            <Redirect to="/login"></Redirect>
        </Route>
        <div className="App">
        <Header isAuth={token} setToken={setToken} />
        <Route exact path="/login">{token? <Redirect to="/dashboard"></Redirect>: <Login setToken={setToken} />}</Route>
        <Route exact path="/register">{token? <Redirect to="/dashboard"></Redirect> : <Register setToken={setToken} />}</Route>
        <ProtectedRoute exact path="/dashboard" Component={Dashboard} isAuth={token} />
        <ProtectedRoute path="/viewpdf/:pdf" Component={Viewer} isAuth={token} />
        <ProtectedRoute path="/mergefiles" Component={MergeFile} isAuth={token} />
        <ProtectedRoute path="/splitfiles" Component={SplitFile} isAuth={token} />
        <ProtectedRoute path="/deletepages" Component={DeletePage} isAuth={token} />
        <ProtectedRoute path="/reorderpages" Component={ReorderPage} isAuth={token} />
        <ProtectedRoute path="/signfiles" Component={SignAuthorize} isAuth={token} />  
        <Footer />
        </div>
    </Router>
  );
}

export default App;
