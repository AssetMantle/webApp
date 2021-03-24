import ReactDOM from "react-dom";
import React from "react";
import base64url from "base64url";
import config from "../../constants/config.json"

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

    FetchMutableInputFieldMeta(mutableList, metasQuery, FileName) {

        let $this = this;
        if (mutableList !== null) {
            mutableList.map((mutable, index) => {

                const mutableType = mutable.value.fact.value.type;
                const mutableHash = mutable.value.fact.value.hash;
                const mutableName = mutable.value.id.value.idString;

               if(mutableName === config.URI){
                   const id = `${FileName}${mutableName}|${mutableType}${index}`;
                   if (mutableHash !== "" && mutableHash !== null) {
                       const metaQueryResult = metasQuery.queryMetaWithID(mutableHash);
                       metaQueryResult.then(function (item) {
                           const data = JSON.parse(JSON.parse(JSON.stringify(item)));
                           let metaValue = $this.FetchMetaValue(data, mutableHash);
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
                        let metaValue = $this.FetchMetaValue(data, immutableHash);
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
        keys.map((keyName, index1) => {
            if (properties[keyName] !== "") {
                const metaQueryResult = metasQuery.queryMetaWithID(properties[keyName]);
                if (metaQueryResult) {
                    metaQueryResult.then(function (item) {
                        const data = JSON.parse(item);
                        let myElement = "";
                        let metaValue = $this.FetchMetaValue(data, properties[keyName])
                        if (keyName === config.URI) {
                            let img = document.createElement('img');
                            const UrlDecode = base64url.decode(metaValue);
                            img.src = UrlDecode;
                            img.alt = keyName;
                            let imageElement = document.getElementById(urlId + index + index1)
                            if (typeof (imageElement) != 'undefined' && imageElement != null) {
                                document.getElementById(urlId + index + index1).appendChild(img);
                            }
                        } else {
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
