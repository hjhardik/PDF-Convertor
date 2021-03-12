import React from "react";
// buttons 
const Button = (props) => {
        return(
            //eslint-disable-next-line
            <button className={props.class} type={props.btnType} style={{backgroundColor: props.color}} onClick={props.onClick}>{props.text}</button>
        )
};

export default Button;