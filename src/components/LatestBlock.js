import React, {useState, useEffect} from "react";
import {getLatestBlockURL} from "../constants/url"
import axios from "axios";
import CountUp from 'react-countup';

const LatestBlock = () => {
  const [latestBlock, setLatestBlock] = useState(0);
  
  
  useEffect(() => {
    const url = getLatestBlockURL();
    const fetchLatestBlock = async () => {
      const response = await axios.get(url);
      const height = Number(response.data.result.block.header.height)
      setLatestBlock(height)
      } 
    fetchLatestBlock();
  }, []);
  return (
    <p>
      <CountUp start={0} end={latestBlock} duration={2.75} />
    </p>
  );
}

export default LatestBlock;
