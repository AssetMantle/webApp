import React, {useState, useEffect} from "react";
import Identities from "persistenceJS/transaction/identity/query";


const IdentityList = () => {
    const [identityList, setIdentityList] = useState([]);
    const userAddress = localStorage.getItem('address');
            useEffect(() => {
                const fetchtoIdentities =() => {
                    const identities = Identities.queryIdentityWithID("reaj")
                    console.log(identities, "identities")
                    identities.then(function(item) {
                        const data = JSON.parse(item);
                        const dataList = data.result.value.identities.value.list;
                        dataList.forEach((dataValue) => {
                            const provisionedAddressList = dataValue.value.provisionedAddressList;
                            provisionedAddressList.forEach((provisionedAddressValue) => {
                            if(provisionedAddressValue === userAddress ){
                                setIdentityList((identityList) => [
                                    ...identityList,
                                    dataValue,
                                ]);
                            }
                            });
                        })
                
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
                        <a href="#">{identity.value.id.value.classificationID.value.idString}</a>
                        );
                    })}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default IdentityList