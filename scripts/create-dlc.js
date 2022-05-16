import {network, senderAddress, senderKey, contractAddress, contractName} from './common.js'

import {
  makeContractCall,
  broadcastTransaction,
  bufferCVFromString,
  uintCV
} from "@stacks/transactions";

const functionName = "create-dlc";

// Replace this with the options required for your contract.
const txOptions = {
  contractAddress: contractAddress,
  contractName: contractName,
  functionName: functionName,
  functionArgs: [
    bufferCVFromString("BTC"),                 // asset
    uintCV(1651243090),                        // closing-time
    uintCV(1651243090),                        // emergency-refund-time
  ],
  senderKey: senderKey,
  validateWithAbi: true,
  network,
  fee: 100000,
  anchorMode: 1,
};

const transaction = await makeContractCall(txOptions);
console.log(transaction);
const broadcastResponse = await broadcastTransaction(transaction, network);
console.log("2: ", broadcastResponse);

// You can check the call status on https://explorer.stacks.co/?chain=testnet
console.log("txid:", broadcastResponse.txid);