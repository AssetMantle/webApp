import { queryMeta } from "mantlejs/build/transaction/meta/query";

const metasQuery = new queryMeta(process.env.REACT_APP_ASSET_MANTLE_API);

async function FetchMetaData(hash) {
    const metaQueryResult = await metasQuery.queryMetaWithID(hash);
    const data = JSON.parse(metaQueryResult);
    let metaValue = FetchMetaValue(data, hash);
    return metaValue;
}

function FetchMetaValue(data, hash) {
    let metaValue = "";
    if (data.result.value.metas.value.list === null) {
        metaValue = hash;
    } else {
        switch (data.result.value.metas.value.list[0].value.data.type) {
        case "idData":
            metaValue = data.result.value.metas.value.list[0].value.data.value.value.value.idString;
            break;
        case "stringData":
            metaValue = data.result.value.metas.value.list[0].value.data.value.value;
            break;
        case "heightData":
            metaValue = data.result.value.metas.value.list[0].value.data.value.value.value.height;
            break;
        case "decData":
            metaValue = data.result.value.metas.value.list[0].value.data.value.value;
            break;
        default:
        }
    }
    return metaValue;
}

export default {
    FetchMetaData
};