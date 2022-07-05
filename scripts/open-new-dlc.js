import { network, senderAddress, senderKey, contractAddress, contractName, UUID, timestamp } from './common.js'
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
    bufferCVFromString(UUID),                                        // uuid
    uintCV(timestamp),                                              // closing-time
    uintCV(timestamp),                                              // emergency-refund-time
    standardPrincipalCV("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"), // creator
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
console.log("\nYou can check the call status on https://explorer.stacks.co/?chain=testnet\nbroadcastTransaction: ", broadcastResponse);
