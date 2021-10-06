import { Redirect, Route } from 'react-router-dom';
import React from 'react';

const PrivateRoute = ( {component: Component}) => {
    let token = localStorage.getItem('userName');
    return (
        <Route
            render={
                (props) => {
                    if (token === '' || token === null) {
                        return <Redirect to={'/'}/>;
                    }

                    return <Component {...props}/>;
                }
            }
        />
    );
};


export default PrivateRoute;
