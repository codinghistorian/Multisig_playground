const hre = require("hardhat");
const fs = require('fs');
const path = require('path');
require("dotenv").config();

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
  //14:33 KST
  //Yeah, lets just get them wallet addresses from private key.

  const url = "http://localhost:7545";
  const privateKey0 = process.env.PRIVATE_KEY0;
  const privateKey1 = process.env.PRIVATE_KEY1;
  const privateKey2 = process.env.PRIVATE_KEY2;
  const privateKey3 = process.env.PRIVATE_KEY3;
  const privateKey4 = process.env.PRIVATE_KEY4;
  const privateKey5 = process.env.PRIVATE_KEY5;

  const provider = new ethers.providers.JsonRpcProvider(url)
  const wallet0 = new ethers.Wallet(privateKey0,provider);
  const wallet1 = new ethers.Wallet(privateKey1,provider);
  const wallet2 = new ethers.Wallet(privateKey2,provider);
  const wallet3 = new ethers.Wallet(privateKey3,provider);
  const wallet4 = new ethers.Wallet(privateKey4,provider);
  const wallet5 = new ethers.Wallet(privateKey5,provider);

  let owners = [
    wallet0.address,
    wallet1.address,
    wallet2.address,
    wallet3.address,
    wallet4.address,
    wallet5.address,
  ]
  console.log

  const MultiSig = await hre.ethers.getContractFactory("MultiSigWallet");
  const multiSig = await MultiSig.deploy(owners, 3);

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
