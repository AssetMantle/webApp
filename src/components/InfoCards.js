import React, {useState, useEffect} from "react";
import axios from "axios";
import {getValidatorsURL} from "../constants/url"
import LatestBlock from "./LatestBlock"
import CountUp from 'react-countup';

const InfoCards = () =>{
  const [validatorsList, setValidatorsList] = useState([]);

  useEffect(() => {
    const url = getValidatorsURL();
    const fetchValidator = async () => {
      const response = await axios.get(url);
      setValidatorsList(response.data.result)
    } 
    fetchValidator();
  }, []);
  return(
   
    <div className="card h-100">
    <div className="card-body infoCard">
    <div className="row row-cols-1 row-cols-md-2 card-deck ">
        <div className="col-md-6 custom-pad">
              <LatestBlock />
              <h6 className="card-title">Blocks</h6>
        </div>
        {/* <div className="col-md-3 custom-pad">
              <p> <CountUp start={0} end={0} duration={2.75} /></p>
              <h6 className="card-title">Transactions</h6>
        </div>
        <div className="col-md-3 custom-pad">
              <p> <CountUp start={0} end={0} duration={2.75} /></p>
              <h6 className="card-title">Nodes</h6>
        </div> */}
        <div className="col-md-6 custom-pad">
              <p> <CountUp start={0} end={validatorsList.length} duration={2.75} /></p>
              <h6 className="card-title">Validators</h6>
        </div>
      </div>
      </div>
    </div>
  )
}

export default InfoCards
