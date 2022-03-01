const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  const ERC20 = await hre.ethers.getContractFactory("Target");
  const erc20 = await ERC20.deploy();

  await erc20.deployed();

  console.log("Target ERC20 token deployed to : ", erc20.address);

  //220302 05:19 KST
  //need array of addresses(string) and minimum required aproval as uint when deploying
  //Multisig contract.
  //Ah.. should I just copy paste public addresses or make address from private key...is..upto me
  //I will think tomorrow.
  const MultiSig = await hre.ethers.getContractFactory("MultiSigWallet");
  const multiSig = await MultiSig.deploy();

  await multiSig.deployed();

  console.log("Multisig wallet deplyed to : ", multiSig.address);

  let addresses = { 
    target: erc20.address,
    multiSig: multiSig.address, 
  };
  
  let data = JSON.stringify(addresses);
  fs.writeFileSync('addresses.json', data);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
