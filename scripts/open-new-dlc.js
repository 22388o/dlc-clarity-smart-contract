import {network, senderAddress, senderKey, contractAddress, contractName, UUID} from './common.js'
import {
  makeContractCall,
  broadcastTransaction,
  bufferCVFromString,
  uintCV,
  standardPrincipalCV,
  AnchorMode
} from "@stacks/transactions";

const functionName = "open-new-dlc";

const txOptions = {
  contractAddress: contractAddress,
  contractName: contractName,
  functionName: functionName,
  functionArgs: [
    bufferCVFromString(UUID),                                  // uuid
    bufferCVFromString("BTC"),                                       // asset
    uintCV(1651830015),                                              // closing-time
    uintCV(1651830015),                                              // emergency-refund-time
    standardPrincipalCV("STWYKHG01H1RPXB4Z74SM3CMGB3SGCWVYV9YEHHZ"), // creator
  ],
  senderKey: senderKey,
  validateWithAbi: true,
  network,
  fee: 100000,
  anchorMode: AnchorMode.OffChainOnly,
};

const transaction = await makeContractCall(txOptions);
console.log(transaction);
const broadcastResponse = await broadcastTransaction(transaction, network);
console.log("2: ", broadcastResponse);

// You can check the call status on https://explorer.stacks.co/?chain=testnet
console.log("txid:", broadcastResponse.txid);