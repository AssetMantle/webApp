import React from "react";
import { useHistory } from "react-router-dom";


const Transactions = () => {
    const history = useHistory();
    // const userTypeToken = localStorage.getItem('userType');
        return (     
          <div className="container">
          {/* {
          userTypeToken !== null ? */}
          <div className="transactions-tabs">
          <div className="row row-cols-1 row-cols-md-2 card-deck">
          <div className="col-md-6 custom-pad">
            <div className="card">
              <div className="card-body">
                <div className="leftImg imgBx"  onClick={() => history.push('/SendCoin')}>
                  <p>Bank</p>
                </div>
                <div className="content">
                  <p>Bank Info</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 custom-pad">
            <div className="card">
              <div className="card-body">
                <div className="rightImg imgBx" onClick={() => history.push('/Split')}>
                  <p >Split</p>
                </div>
                <div className="content">
                  <p>Info</p>
                </div>
              </div>
            </div>
          </div>
          </div>
            <div className="row row-cols-1 row-cols-md-2 card-deck">
            <div className="col-md-6 custom-pad">
              <div className="card">
                <div className="card-body">
                  <div className="leftImg imgBx" onClick={() => history.push('/BuyAsset')}>
                    <p>Order</p>
                  </div>
                  <div className="content">
                    <p>Info</p>
                  </div>
                </div>
              </div>
            </div>
            {/* { userTypeToken === 'Maintainer' ?  */}
            {/* <div className="col-md-6 custom-pad">
            <div className="card">
              <div className="card-body">
                <div className="rightImg imgBx">
                  <p onClick={() => history.push('/SendCoin')}>Identity</p>
                </div>
                <div className="content">
                  <p>Info</p>
                </div>
              </div>
            </div>
          </div>  */}
          {/* :  "" 
          } */}
          </div>
           {/* { userTypeToken === 'Maintainer' ?  */}
              {/* <div className="row row-cols-1 row-cols-md-2 card-deck">
              <div className="col-md-6 custom-pad">
                <div className="card">
                  <div className="card-body">
                    <div className="leftImg imgBx">
                      <p onClick={() => history.push('/SendCoin')}>Asset</p>
                    </div>
                    <div className="content">
                      <p>Info</p>
                    </div>
                  </div>
                </div>
              </div>
              </div>  */}
              {/* : "" 
              } */}
          </div> 
          {/* : "" 
          } */}
      </div>
             );
}

export default Transactions;
