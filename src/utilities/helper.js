import config from "../config";
import { create } from 'ipfs-http-client';

function SortObjectData(totalData) {
    const sortable = [];
    for (let item in totalData) {
        sortable.push([item, totalData[item]]);
    }

    const sorted = [];

    for (let i = 0; i<sortable.length ; i++) {
        if(sortable[i][0] === "URI"){
            sorted.unshift(sortable[i]);
        }else {
            sorted.push(sortable[i]);
        }
    }

    let objSorted = {};
    sorted.forEach(function(sortedItem){
        objSorted[sortedItem[0]]=sortedItem[1];
    });
    return objSorted;
}

async function IpfsPath(file) {
    const client = create(config.IPFS_URL);
    const added = await client.add(file);
    return added.path;
}

function GetIpfsUrl(path) {
    const url = `https://ipfs.infura.io/ipfs/${path}`;
    return url;
}
export default {
    SortObjectData,
    IpfsPath,
    GetIpfsUrl
};