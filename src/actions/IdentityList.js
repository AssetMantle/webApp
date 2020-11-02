import React, {useState, useEffect} from "react";
import Identities from "persistencejs/transaction/identity/query";
import Helper from "../utilities/helper";

const IdentityList = () => {
    const HelperF = new Helper();
    const [identityList, setIdentityList] = useState([]);
    const userAddress = localStorage.getItem('address');
    useEffect(() => {
        const fetchtoIdentities = () => {
            const identities = Identities.queryIdentityWithID("all")
            identities.then(function (item) {
                const data = JSON.parse(item);
                const dataList = data.result.value.identities.value.list;
                if(dataList){
                const filterIdentities = HelperF.FilterIdentitiesByProvisionedAddress(dataList, userAddress)
                console.log(filterIdentities, "identities")
                setIdentityList(filterIdentities);
                }
                else{
                    console.log("no identities found")
                }

            })
        }
        fetchtoIdentities();
    }, []);


    return (
        <div className="container">
            <div className="accountInfo">
                <div className="row row-cols-1 row-cols-md-2 card-deck createAccountSection">
                    <div className="col-md-6 custom-pad card">
                        {identityList.map((identity, index) => {
                            return (
                                <a href="#" key={index}>{identity.value.id.value.classificationID.value.idString}</a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default IdentityList