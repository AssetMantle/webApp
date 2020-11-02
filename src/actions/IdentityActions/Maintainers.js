import React, {useState, useEffect} from "react";
import Identities from "persistenceJS/transaction/identity/query";
import MaintainerQuery from "persistenceJS/transaction/maintainers/query";
import Helpers from "../../utilities/helper";


const Maintainers = () => {
  const Helper = new Helpers();
  const [maintainersList, setMaintainersList] = useState([]);
  const userAddress = localStorage.getItem('address');
          useEffect(() => {
              const fetchOrder =() => {
                const identities = Identities.queryIdentityWithID("all")
                identities.then(function (item) {
                    const data = JSON.parse(item);
                    const dataList = data.result.value.identities.value.list;
                    const filterIdentities = Helper.FilterIdentitiesByProvisionedAddress(dataList, userAddress)
                    const maintainersData = MaintainerQuery.queryMaintainerWithID("all")
                    maintainersData.then(function(item) {
                        const parsedMaintainersData = JSON.parse(item);
                        console.log(parsedMaintainersData)
                        const maintainersDataList = parsedMaintainersData.result.value.maintainers.value.list;
                        if(maintainersDataList){
                        const filterMaintainersByIdentity = Helper.FilterMaintainersByIdentity(filterIdentities, maintainersDataList)
                        setMaintainersList(filterMaintainersByIdentity);
                        }
                        else{
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
        <div className="row row-cols-1 row-cols-md-2 card-deck createAccountSection">
          <div className="col-md-6 custom-pad card">
          {maintainersList.map((maintainer, index) => {
              return (
                  <a href="#" key={index}>{maintainer.value.id.value.identityID.value.idString}</a>
              );
          })}
          </div>
         </div>
          </div>
        </div>
    );
};

export default Maintainers;
