import {network, senderAddress, senderKey, contractAddress, contractName, UUID} from './common.js'
import {
  bufferCVFromString,
  callReadOnlyFunction
} from "@stacks/transactions";

const functionName = "get-dlc";

const txOptions = {
  contractAddress: contractAddress,
  contractName: contractName,
  functionName: functionName,
  functionArgs: [
    bufferCVFromString(UUID),
  ],
  senderAddress: senderAddress,
  network,
};

const transaction = await callReadOnlyFunction(txOptions);
console.log(transaction);
