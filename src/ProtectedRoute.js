// handles all the protected routes
// if the user is logged in, display the routes otherwise redirect to login
import {Route, useHistory} from "react-router-dom";
import React from "react";

//isAuth:Boolean representing if user is logged in or not
//component is the component which was intended
//eslint-disable-next-line
const ProtectedRoute = ({isAuth, Component, ...rest}) => {
    const history = useHistory();
    return (
        <div>
            <Route 
            {...rest} 
            //eslint-disable-next-line
            render={(props) => {
                if (isAuth){
                    return <Component />
                }else{
                    history.push("/login")
                }
            }}   
            /> 
        </div>
    )
}

export default ProtectedRoute
