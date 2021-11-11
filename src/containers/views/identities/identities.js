import React, {useState} from "react";
import {defineIdentity} from "persistencejs/build/transaction/identity/define";
import {Define} from "../../forms";
import {IssueIdentity, Nub} from "../../forms/identities";
import IdentityList from "./identityList";

const identitiesDefine = new defineIdentity(process.env.REACT_APP_ASSET_MANTLE_API);

const Identities = () => {
    const [externalComponent, setExternalComponent] = useState("");

    return (
        <div className="accountInfo">
            <IdentityList/>
            {externalComponent === 'Nub' ?
                <Nub setExternalComponent={setExternalComponent}/> :
                null
            }
            {externalComponent === 'DefineIdentity' ?
                <Define setExternalComponent={setExternalComponent} ActionName={identitiesDefine}
                    FormName={'Define Identity'}/> :
                null
            }
            {externalComponent === 'IssueIdentity' ?

                <IssueIdentity setExternalComponent={setExternalComponent}/> :
                null
            }
        </div>
    );
};
export default Identities;
