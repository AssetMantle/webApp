import GetMeta from "./GetMeta";
import base64url from "base64url";
import config from "../config";

// import helper from "./helper";

async function ParseProperties(properties) {
    let propertiesDictionary = {};
    let propertiesType = {};
    await Promise.all(properties.map(async (property)=>{
        if (property.value.fact.value.hash !== "") {
            const metaValue = await GetMeta.FetchMetaData(property.value.fact.value.hash);
            if (property.value.id.value.idString === "propertyName") {
                const UrlDecode = base64url.decode(metaValue);
                propertiesDictionary[property.value.id.value.idString] = UrlDecode;
                propertiesType[property.value.id.value.idString] = property.value.fact.value.type;
            } else if (property.value.id.value.idString === config.URI) {
                const UrlDecode = base64url.decode(metaValue);
                propertiesDictionary[property.value.id.value.idString] = UrlDecode;
                propertiesType[property.value.id.value.idString] = property.value.fact.value.type;
            } else {
                propertiesDictionary[property.value.id.value.idString] = metaValue;
                propertiesType[property.value.id.value.idString] = property.value.fact.value.type;
            }
        }
    }));

    //
    // for (const property of properties) {
    //     if (property.value.fact.value.hash !== "") {
    //         const metaValue = await GetMeta.FetchMetaData(property.value.fact.value.hash);
    //         if (property.value.id.value.idString === "propertyName") {
    //             const UrlDecode = base64url.decode(metaValue);
    //             propertiesDictionary[property.value.id.value.idString] = UrlDecode;
    //             propertiesType[property.value.id.value.idString] = property.value.fact.value.type;
    //         } else if (property.value.id.value.idString === config.URI) {
    //             const UrlDecode = base64url.decode(metaValue);
    //             propertiesDictionary[property.value.id.value.idString] = UrlDecode;
    //             propertiesType[property.value.id.value.idString] = property.value.fact.value.type;
    //         } else {
    //             propertiesDictionary[property.value.id.value.idString] = metaValue;
    //             propertiesType[property.value.id.value.idString] = property.value.fact.value.type;
    //         }
    //     }
    // }
    return [propertiesDictionary, propertiesType];
}


//
// function test(){
//     let data = {
//         property: "123",
//         name: "234"
//     };
//     let encoded = getUrlEncode(data);
//     console.log(encoded);
//     const UrlDecode = base64url.decode(encoded);
//     console.log(UrlDecode);
//
// }
//
// test();
export default {
    ParseProperties
};