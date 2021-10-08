import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import {LedgerSigner} from "@cosmjs/ledger-amino";
import transactions from "./transactions";

const interactiveTimeout = 120_000;

export async function createTransport() {
    const ledgerTransport = await TransportWebUSB.create(interactiveTimeout, interactiveTimeout);
    return ledgerTransport;
}

export const fetchAddress = async (prefix, accountNumber = "0", addressIndex = "0") => {
    let transport = await createTransport();
    transport.on("disconnect", () => {
        alert("ledger disconnected please login again");
        localStorage.clear();
        window.location.reload();
    });
    let signer;
    signer = new LedgerSigner(transport, {
        testModeAllowed: true,
        hdPaths: [transactions.makeHdPath(accountNumber, addressIndex)],
        prefix: prefix
    });

    const [firstAccount] = await signer.getAccounts();
    return firstAccount.address;
};
