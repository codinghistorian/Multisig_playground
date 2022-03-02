const hre = require("hardhat");
const fs = require('fs');
require("dotenv").config();

let rawdata = fs.readFileSync('addresses.json');
let addresses = JSON.parse(rawdata);
const target = {
  address : addresses.target
};
const multiSig = {
  address : addresses.multiSig
};

async function main() {
  const MultiSigContract = await hre.ethers.getContractFactory("Target");
  const multiSigContract = await MultiSigContract.attach(
    multiSig.address // The deployed contract address
  );
  
  //220302 15:32 KST
  // The smart contract has this public state variable of arrays.
  // I will first just call the first element in the array.
  // Transaction[] public transactions;
  // 15:34... TypeError: Cannot read property '0' of undefine
  // TypeError: Cannot read property '0' of undefinedd
  // gotta google how to read public state variable ethers.js
  // 220302 17:16 KST
  // ah, okay. for arrays, I need a getter function...
  // I can either..make a getter function in the smart contract or just ignore and continue
  // with approve and execute to see if works.

  var result = multiSigContract.transactions();
  console.log(result);


}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
