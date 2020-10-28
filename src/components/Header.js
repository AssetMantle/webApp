import React from "react";
import { withRouter } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

const Header = () =>{
    const history = useHistory();
    const userTypeToken = localStorage.getItem('userType');
   const handleRoute = route => () => {
        history.push(route)
    };
    const logout = route => () => {
        localStorage.clear();
        history.push('/');
    }
    return(
<>  
                <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Brand ><Nav.Link onClick={handleRoute("/")}>Asset Mantle</Nav.Link></Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link target="_blank" href="https://notes.persistence.one/zy_qyjhZSJ-jOxS8OwMKAw">Docs</Nav.Link>
                        {
                            userTypeToken !== null  ?
                            <div>
                                <NavDropdown title="Transactions" id="basic-nav-dropdown">
                              { userTypeToken === 'Maintainer' ?
                                <>
                                    <NavDropdown.Item onClick={() => history.push('/Assetactions')}>Asset</NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => history.push('/Orderactions')}>Order</NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => history.push('/IssueIdentity')}>Identity</NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => history.push('/SendCoin')}>Bank</NavDropdown.Item>
                                </>
                            :
                                <>
                                    <NavDropdown.Item onClick={() => history.push('/SendCoin')}>Bank</NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => history.push('/Split')}>Split</NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => history.push('/BuyAsset')}>Order</NavDropdown.Item>
                                </>
                                }
                                 </NavDropdown>
                                </div>
                                : 
                                <>
                                  <Nav.Link onClick={handleRoute("/Login")}>Transactions</Nav.Link>
                                </>
                        }
                    </Nav>
                   
                    {
                    userTypeToken == null ?
                    <Nav>
                        <Nav.Link >Contact Us</Nav.Link>
                        <Nav.Link onClick={handleRoute("/LoginAction")}>Login with addr</Nav.Link>
                     <Nav.Link onClick={handleRoute("/CreateAccount")}>Sign Up</Nav.Link>
                   {/* <Nav.Link onClick={handleRoute("/Login")}>Login</Nav.Link> */}
                    {/* <Nav.Link onClick={handleRoute("/AccountRecover")}>Recover</Nav.Link> */}
                    </Nav>
                    :
                    <Nav>
                        <Nav.Link >Contact Us</Nav.Link>
                    <Nav.Link onClick={logout("/")}>Logout</Nav.Link>
                    </Nav>
                    }
                   </Navbar.Collapse>
                </Navbar>
        
            </>
    )
}


export default withRouter(Header);
