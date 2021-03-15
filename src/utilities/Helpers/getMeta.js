import ReactDOM from "react-dom";
import React from "react";
import base64url from "base64url";
import config from "../../constants/config.json"
var bigdecimal = require("bigdecimal");
var bigDecimal = require('js-big-decimal');
export default class GetMeta {

    FetchMetaValue(data, hash) {
        let metaValue = "";
        if (data.result.value.metas.value.list === null) {
            metaValue = hash;
        } else {
            switch (data.result.value.metas.value.list[0].value.data.type) {
                case "xprt/idData":
                    metaValue = data.result.value.metas.value.list[0].value.data.value.value.value.idString;
                    break;
                case "xprt/stringData":
                    metaValue = data.result.value.metas.value.list[0].value.data.value.value;
                    break;
                case "xprt/heightData":
                    metaValue = data.result.value.metas.value.list[0].value.data.value.value.value.height;
                    break;
                case "xprt/decData":
                    metaValue = data.result.value.metas.value.list[0].value.data.value.value;
                    break;
                default :
            }
        }
        return metaValue;
    }

    FetchMutableInputFieldMeta(immutableList, metasQuery, FileName) {

        let $this = this
        if (immutableList !== null) {
            immutableList.map((immutable, index) => {

                const immutableType = immutable.value.fact.value.type;
                const immutableHash = immutable.value.fact.value.hash;
                const immutableName = immutable.value.id.value.idString;
               if(immutableName === config.URI){

                   const id = `${FileName}${immutableName}|${immutableType}${index}`

                   if (immutableHash !== "" && immutableHash !== null) {
                       const metaQueryResult = metasQuery.queryMetaWithID(immutableHash);
                       metaQueryResult.then(function (item) {
                           const data = JSON.parse(JSON.parse(JSON.stringify(item)));
                           let metaValue = $this.FetchMetaValue(data, immutableHash)
                           if (document.getElementById(id)) {
                               document.getElementById(id).value = metaValue;
                           }
                       })
                   }
               }
            })
        }
    }

    FetchInputFieldMeta(immutableList, metasQuery, FileName) {
        let $this = this;
        console.log(immutableList,"immutableList")
        if (immutableList !== null) {
            immutableList.map((immutable, index) => {
                const immutableType = immutable.value.fact.value.type;
                const immutableHash = immutable.value.fact.value.hash;
                const immutableName = immutable.value.id.value.idString;
                const id = `${FileName}${immutableName}|${immutableType}${index}`;

                if (immutableHash !== "" && immutableHash !== null) {
                    const metaQueryResult = metasQuery.queryMetaWithID(immutableHash);
                    metaQueryResult.then(function (item) {
                        const data = JSON.parse(JSON.parse(JSON.stringify(item)));
                        let metaValue = $this.FetchMetaValue(data, immutableHash)

                        if (document.getElementById(id)) {
                            document.getElementById(id).value = metaValue;
                        }
                    })
                }

            })
        }
    }

    AssignMetaValue(keys, properties, metasQuery, idPrefix, index, urlId) {
        let $this = this;
        let exchangeRate='';
        let makersplit='';
        let previousID='';

        keys.map((keyName, index1) => {
            if (properties[keyName] !== "") {

                const metaQueryResult = metasQuery.queryMetaWithID(properties[keyName]);
                if (metaQueryResult) {
                    metaQueryResult.then(function (item) {
                        const data = JSON.parse(item);
                        let myElement = "";
                        let metaValue = $this.FetchMetaValue(data, properties[keyName])

                        if(urlId === 'assetViewMutableViewUrlId' && keyName === 'ArtistName'){
                            localStorage.setItem("ArtistName", metaValue);
                        }
                        if(urlId === 'assetViewUrlId' && keyName === 'identifier'){
                            localStorage.setItem("identifierName", metaValue);
                        }
                        if(urlId === 'assetViewUrlId' && keyName === 'description'){
                            localStorage.setItem("descriptionName", metaValue);
                        }
                        if (keyName === config.URI) {
                            let img = document.createElement('img');
                            const UrlDecode = base64url.decode(metaValue);
                            img.src = UrlDecode;
                            img.alt = keyName;
                            let imageElement = document.getElementById(urlId + index + index1)
                            if (typeof (imageElement) != 'undefined' && imageElement != null) {
                                document.getElementById(urlId + index + index1).appendChild(img);
                            }
                        } else if(keyName === 'exchangeRate'){
                            if(makersplit !== ''){
                                let inputValue = new bigdecimal.BigDecimal(metaValue);
                                // exchangeRate=inputValue*makersplit;
                                let newValue = inputValue.multiply(makersplit).toPlainString();
                                // newValue = bigDecimal.round(newValue, 18);
                                console.log(newValue,keyName, idPrefix + index + index1 ,"metaValueexchangeRate");
                                myElement = <span>$STAKE{newValue}</span>;
                                let element = document.getElementById(idPrefix + index + index1)
                                if (typeof (element) != 'undefined' && element != null) {
                                    ReactDOM.render(myElement, document.getElementById(idPrefix + index + index1));
                                } else {
                                    return "";
                                }
                            }else{
                                exchangeRate= new bigdecimal.BigDecimal(metaValue);
                                previousID=idPrefix + index + index1;
                            }
                        }
                        else if(keyName === 'makerOwnableSplit'){
                            if(exchangeRate !== ''){
                                let inputValue = new bigdecimal.BigDecimal(metaValue);
                                // makersplit=inputValue*exchangeRate;
                                let newValue = exchangeRate.multiply(inputValue).toPlainString();
                                // newValue = bigDecimal.round(newValue, 18);
                                console.log(metaValue,keyName, idPrefix + index + index1 ,"metaValueexchangeRate");
                                myElement = <span>$STAKE{newValue}</span>;
                                var element = document.getElementById(previousID)
                                if (typeof (element) != 'undefined' && element != null) {
                                    ReactDOM.render(myElement, document.getElementById(previousID));
                                } else {
                                    return "";
                                }
                            }else{
                                makersplit=new bigdecimal.BigDecimal(metaValue);;
                            }
                        }
                            else {
                            if (metaValue == "Blue") {
                                myElement = <span className="Blue"></span>;
                            } else if (metaValue == "Red") {
                                myElement = <span className="Red"></span>;
                            } else if (metaValue == "Green") {
                                myElement = <span className="Green"></span>;
                            } else if (metaValue == "Black") {
                                myElement = <span className="Black"></span>;
                            } else {
                                myElement = <span>{metaValue}</span>;
                            }

                            var element = document.getElementById(idPrefix + index + index1)
                            if (typeof (element) != 'undefined' && element != null) {
                                ReactDOM.render(myElement, document.getElementById(idPrefix + index + index1));
                            } else {
                                return "";
                            }
                        }
                    });
                }
            }
        })
    }
}
