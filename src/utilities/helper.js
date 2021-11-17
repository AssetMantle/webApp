import config from "../config";
import {create} from 'ipfs-http-client';
import base64url from "base64url";
import sha1 from "crypto-js/sha1";
import Base64 from "crypto-js/enc-base64";
const encoding = require("@cosmjs/encoding");
const pinataSDK = require('@pinata/sdk');
const bigdecimal = require("bigdecimal");
const bigDecimal = require('js-big-decimal');

const pinata = pinataSDK(
    'a021b51c3eee8d65e427', 'b7422d9d3a4d275bbb43ea05599f706883e5163277124bb6e9c9b86b0dd0a4e2'
);

pinata.testAuthentication().then((result) => {
    //handle successful authentication here
    console.log(result);
}).catch((err) => {
    //handle error here
    console.log(err);
});

function SortObjectData(totalData) {
    const sortable = [];
    for (let item in totalData) {
        sortable.push([item, totalData[item]]);
    }

    const sorted = [];

    for (let i = 0; i < sortable.length; i++) {
        if (sortable[i][0] === "URI") {
            sorted.unshift(sortable[i]);
        } else {
            sorted.push(sortable[i]);
        }
    }

    let objSorted = {};
    sorted.forEach(function (sortedItem) {
        objSorted[sortedItem[0]] = sortedItem[1];
    });
    return objSorted;
}

async function IpfsPath(file) {
    const client = create(config.IPFS_URL);
    const added = await client.add(file);

    // const added = await client.add(
    // //     { path: file.name, content: file },
    // //     { wrapWithDirectory: true }
    // // );
    const options = {
        "name": file.name,
        "description": "adsfasfd",
        "image": "ipfs://" + added.path,
    };
    await pinataFile(options);
    return added.path;
}

async function pinataFile(file, path) {
    const options = {
        "name": file.name,
        "description": "adsfasfd",
        "image": "ipfs://" + path,
    };
    let result = await pinata.pinJSONToIPFS(options);
    return result;
}

function GetIpfsUrl(path) {
    // const updateFileUrl ="https://demo-assetmantle.mypinata.cloud/ipfs/"+.IpfsHash+"/"+file.name;
    const url = `https://ipfs.infura.io/ipfs/${path}`;
    return url;
}

function stringFilter(data, initialCharacter, replaceableText) {
    const re = new RegExp(initialCharacter, "g");
    return data.replace(re, replaceableText);
}

function getUrlEncode(Url) {
    let UrlEncode;
    if (Url) {
        UrlEncode = base64url.encode(Url) + "=";
    }
    return UrlEncode;
}

function getBase64Hash(fileData) {
    let pwdHash = sha1(fileData);
    let joinedDataHashB64 = Base64.stringify(pwdHash);
    let finalHash = base64url.fromBase64(joinedDataHashB64) + "=";
    return finalHash;
}

function getExchangeRate(value) {
    let inputValue = new bigdecimal.BigDecimal(value);
    let smallestNumber = new bigdecimal.BigDecimal(0.000000000000000001);
    let newValue = inputValue.multiply(smallestNumber).toPlainString();
    return mantleConversion(bigDecimal.round(newValue)*1);
    // return bigDecimal.round(newValue, 3);
}

function mantleConversion(data){
    return data/config.denomValue;
}

function stringValidation(evt){
    if(evt.target.value.length > 60){
        evt.preventDefault();
    }
}

function passwordValidation(data){
    const regex= /^\S{3}\S+$/;
    return regex.test(data);
}

function handleChangePassword(evt){
    if(evt.target.value.length > 30){
        evt.preventDefault();
    }
}

function inputAmountValidation(e){
    if (e.key === "e" || e.key === "-" || e.key === "+") {
        e.preventDefault();
    }
}
function imageTypeCheck(filePath) {
    let allowedExtensions =
        /(\.jpg|\.jpeg|\.png|\.gif|\.svg)|\.webm$|\.mp4/i;
    return allowedExtensions.exec(filePath);
}

function isBech32Address(address, prefix) {
    try {
        let decodedAddress = encoding.Bech32.decode(address);
        return decodedAddress.prefix === prefix;
    } catch (e) {
        return false;
    }
}

export default {
    SortObjectData,
    IpfsPath,
    GetIpfsUrl,
    pinataFile,
    stringFilter,
    getUrlEncode,
    getBase64Hash,
    getExchangeRate,
    mantleConversion,
    stringValidation,
    passwordValidation,
    handleChangePassword,
    inputAmountValidation,
    imageTypeCheck,
    isBech32Address
};