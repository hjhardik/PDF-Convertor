import {useHistory} from "react-router-dom";
import React from "react";

//eslint-disable-next-line
const Header = ({isAuth, setToken}) => {
    const history = useHistory();
    //logout button
    const handleLogout = () => {
        //clears token and user info
        localStorage.clear();
        // setToken value to false
        setToken({token: false, email: false})
        //redirect to login route
        history.push("/login"); 
    }
    return(
        <div className="header">
            <div className="header-text">
                PDF CONVERTOR
            </div>
            <div className="header-buttons">
            {!isAuth &&
            <> 
            <button className="btn btn-secondary" onClick={() => history.push("/login")}>Login</button>
            <button className="btn btn-success" onClick={() => history.push("/register")}>Sign Up</button>
            
            </>
            }
            {isAuth && <button className="btn btn-light" onClick={handleLogout}>Logout</button>}
            </div>
        </div>
    )
}

export default Header;