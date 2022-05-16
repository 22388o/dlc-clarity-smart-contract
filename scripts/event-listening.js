// once you started the script run the create-dlc script which will emit a print event

import { connectWebSocketClient } from '@stacks/blockchain-api-client';
import fetch from "node-fetch";

const URLAPI = 'https://stacks-node-api.testnet.stacks.co/extended/v1/tx/';

let tx;

function setTx(_tx) {
    tx = _tx;
}

const client = await connectWebSocketClient('wss://stacks-node-api.testnet.stacks.co/');

const sub = await client.subscribeAddressTransactions('ST31H4TTX6TVMEE86TYV6PN6XPQ6J7NCS2DD0XFW0.discreet-log-storage', function (transactionInfo) {
    if (transactionInfo.tx_status == "success") {
        const tx = fetchTxAndExtractPrintEvent(transactionInfo.tx_id);
    } else {
        console.log("Failed transaction....");
    }
});

//wait sub.unsubscribe();

function fetchTxAndExtractPrintEvent(txId) {
    fetch(URLAPI + txId)
        .then(response => response.json()).then(json => setTx(json))
        .catch(error => console.error(error))
        .finally(() => {
            // extracting print event (it can have multiple print events, 
            //but since we know we only have 1 currently we can safely access it at 0 index)
            const event = tx.events[0].contract_log.value.repr;
            // value is a tuple in string format
            console.log(event);
            // parsing the tuple string
            parsePrintEvent(event);
        });
}

function parsePrintEvent(event) {
    const parsed = event.replace(/\(|\)|tuple/g, '').replace(/-/g, '_').trim().split(' ');

    const data = {};

    for (let index = 0; index < parsed.length; index += 2) {
        data[parsed[index]] = parsed[index + 1]
    }

    console.log(data);
}