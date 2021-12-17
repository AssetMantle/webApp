const FAUCET_LIST_LIMIT = 15;
const AMOUNT = "10000000";
const DENOM = "umantle";
const CHAIN_ID = "test-mantle-1";
let FaucetList=[];
const prefix= "mantle";
const gas_price = "0.0025umantle";
const gas = "500000";
const IP_WINDOW = 24 * 60 * 60 * 1000; // 24 hours
const IP_DRIP_LIMIT = 10;
module.exports = {
    FAUCET_LIST_LIMIT,
    AMOUNT,
    DENOM,
    CHAIN_ID,
    FaucetList,
    prefix,
    gas_price,
    IP_WINDOW,
    IP_DRIP_LIMIT,
    gas
}