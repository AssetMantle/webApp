import GetMeta from "./GetMeta";
import base64url from "base64url";
import config from "../config";

async function ParseProperties(properties) {
    let propertiesDictionary = {};
    for (const property of properties) {
        if(property.value.fact.value.hash !== ""){
            const metaValue = await GetMeta.FetchMetaData(property.value.fact.value.hash);
            if(property.value.id.value.idString === config.URI){
                const UrlDecode = base64url.decode(metaValue);
                propertiesDictionary[property.value.id.value.idString] = UrlDecode;
            }else {
                propertiesDictionary[property.value.id.value.idString] = metaValue;

            }
        }
        // propertiesDictionary[property.value.id.value.idString] = property.value.fact.value.hash;
    }
    return propertiesDictionary;
}
export default {
    ParseProperties
};