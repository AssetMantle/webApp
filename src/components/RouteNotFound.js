import React from "react";
import Footer from "./Footer";

export default class RouteNotFound extends React.Component {
    render() {
        return (
            <div className="container pageError">
                <h3>Page Not Found</h3>
                <Footer />
            </div>
        );
    }
}
