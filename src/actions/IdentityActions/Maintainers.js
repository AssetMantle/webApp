import React, {useState, useEffect} from "react";
import Identities from "persistencejs/transaction/identity/query";
import maintainersQueryJS from "persistencejs/transaction/maintainers/query";
import Helpers from "../../utilities/helper";
import identitiesQueryJS from "persistencejs/transaction/identity/query";

const identitiesQuery = new identitiesQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const maintainersQuery = new maintainersQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)


const Maintainers = () => {
    const Helper = new Helpers();
    const [maintainersList, setMaintainersList] = useState([]);
    const [mutableProperties, setMutableProperties] = useState([]);
    const userAddress = localStorage.getItem('address');
    useEffect(() => {
        const fetchOrder = () => {
            const identities = identitiesQuery.queryIdentityWithID("all")
            identities.then(function (item) {
                const data = JSON.parse(item);
                const dataList = data.result.value.identities.value.list;
                const filterIdentities = Helper.FilterIdentitiesByProvisionedAddress(dataList, userAddress)
                const maintainersData = maintainersQuery.queryMaintainerWithID("all")
                maintainersData.then(function (item) {
                    const parsedMaintainersData = JSON.parse(item);
                    const maintainersDataList = parsedMaintainersData.result.value.maintainers.value.list;
                    if (maintainersDataList) {
                        const filterMaintainersByIdentity = Helper.FilterMaintainersByIdentity(filterIdentities, maintainersDataList)
                        setMaintainersList(filterMaintainersByIdentity);
                    } else {
                        console.log("no maintainers found")
                    }
                })

            })
        }
        fetchOrder();
    }, []);

    return (
        <div className="container">

            <div className="accountInfo">
                <div className="row row-cols-1 row-cols-md-2 card-deck ">

                    {maintainersList.map((maintainer, index) => {
                        const maintainerPropertyList = Helper.ParseProperties(maintainer.value.maintainedTraits.value.properties.value.propertyList)
                        var keys = Object.keys(maintainerPropertyList);
                        return (<div className="col-md-6" key={index}>
                                <div className="card">
                                    <a href="#" key={index}>{maintainer.value.id.value.identityID.value.idString}</a>
                                    {
                                        keys.map((keyName) => {
                                            return (
                                                <a key={index + keyName}>{keyName} {maintainerPropertyList[keyName]}</a>)
                                        })
                                    }
                                </div>
                            </div>
                        )
                    })}

                </div>
            </div>
        </div>
    );
};

export default Maintainers;
