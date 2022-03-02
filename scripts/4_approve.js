const hre = require("hardhat");
const fs = require('fs');
const path = require('path');
require("dotenv").config();

let rawdata = fs.readFileSync('addresses.json');
let addresses = JSON.parse(rawdata);

  const target = {
    address : addresses.target
  };
  const multiSigAdd = {
    address : addresses.multiSig
  };

async function main() {
  // const ReceiverV8Artifact = require('../artifacts/contracts/4_ReceiverV8.sol/ReceiverV8.json');
  const url = "http://localhost:7545";
  const privateKey0 = process.env.PRIVATE_KEY0;
  const privateKey1 = process.env.PRIVATE_KEY1;
  const privateKey2 = process.env.PRIVATE_KEY2;
  const privateKey3 = process.env.PRIVATE_KEY3;
  const privateKey4 = process.env.PRIVATE_KEY4;
  const privateKey5 = process.env.PRIVATE_KEY5;

  const provider = new ethers.providers.JsonRpcProvider(url);

  const wallet0 = new ethers.Wallet(privateKey0,provider);
  const wallet1 = new ethers.Wallet(privateKey1,provider);
  const wallet2 = new ethers.Wallet(privateKey2,provider);
  const wallet3 = new ethers.Wallet(privateKey3,provider);
  const wallet4 = new ethers.Wallet(privateKey4,provider);
  const wallet5 = new ethers.Wallet(privateKey5,provider);



  const multiSig = require('../artifacts/contracts/2_Multisig.sol/MultiSigWallet.json');

  const abiMultiSig = multiSig.abi;

  const MultisigW0 = new ethers.Contract(multiSigAdd.address,abiMultiSig,wallet0);
  const MultisigW1 = new ethers.Contract(multiSigAdd.address,abiMultiSig,wallet1);
  const MultisigW2 = new ethers.Contract(multiSigAdd.address,abiMultiSig,wallet2);
  const MultisigW3 = new ethers.Contract(multiSigAdd.address,abiMultiSig,wallet3);
  const MultisigW4 = new ethers.Contract(multiSigAdd.address,abiMultiSig,wallet4);
  const MultisigW5 = new ethers.Contract(multiSigAdd.address,abiMultiSig,wallet5);

  // function approve(uint _txId) external {

  // var approveW0 = await MultisigW0.approve(0);
  // await approveW0.wait();
  // console.log(approveW0);

  var approveW1 = await MultisigW1.approve(2);
  await approveW1.wait();
  // console.log(approveW0);

  var approveW2 = await MultisigW2.approve(2);
  await approveW2.wait();
  // console.log(approveW0);

  var approveW3 = await MultisigW3.approve(2);
  await approveW3.wait();
  // console.log(approveW0);

  //220302 19:10 now that this is approved only once, execute should not work.
  //Desired error will be "not eough approvals"
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
