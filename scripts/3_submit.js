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


  // 220302 15:23 KST would the lines below work? never tried before, but should work 
  // 15:25 KST... abi undefined.. hm.. I will attach and see if there will be abi
  // 15:26 KST... hm... way below don't really work.
  // const MultiSig = await hre.ethers.getContractFactory("MultiSigWallet");
  // const multiSig = await MultiSig.attach(
  //   multiSigAdd.address // The deployed contract address
  // );
  const multiSig = require('../artifacts/contracts/2_Multisig.sol/MultiSigWallet.json');

  const abiMultiSig = multiSig.abi;

  const MultisigW0 = new ethers.Contract(multiSigAdd.address,abiMultiSig,wallet0);
  const MultisigW1 = new ethers.Contract(multiSigAdd.address,abiMultiSig,wallet1);
  const MultisigW2 = new ethers.Contract(multiSigAdd.address,abiMultiSig,wallet2);
  const MultisigW3 = new ethers.Contract(multiSigAdd.address,abiMultiSig,wallet3);
  const MultisigW4 = new ethers.Contract(multiSigAdd.address,abiMultiSig,wallet4);
  const MultisigW5 = new ethers.Contract(multiSigAdd.address,abiMultiSig,wallet5);

//   function submit(address _to, uint _value, bytes calldata _data) external {
// }
  //try to submit empty data
  //220302 15:29 KST, when I put empty string "" so the last parameter of submit, it gave error
  //telling me that I need to put bytes. so I put 0x34234 and seems to work fine.
  //Now I need to check if the submit really went through.

  //220302 19:23 KST, let's see how I can do keccak256(abiencoded) with ethers.js
  // syntax of calldata below  
  https://kushgoyal.com/ethereum-solidity-how-use-call-delegatecall/#:~:text=Solidity%20has%20the%20call%20function,to%20transfer%20ether%20to%20addresses.

  // abi.encodeWithSignature offchain can work from one of these day articles. Let's just try
  // https://ethereum.stackexchange.com/questions/111343/etherjs-equivalent-of-abi-encodewithsignature
//or
// https://docs.ethers.io/v5/api/utils/abi/coder/#AbiCoder--methods

  //I need ERC20 abi not abiMultisig below.

  var targetArtifact = require('../artifacts/contracts/1_ERC20.sol/Target.json');

  let iface = new ethers.utils.Interface(targetArtifact.abi);
  // var calldata = iface.encodeFunctionData('mint', [wallet0.address, 111111]);
  // console.log(calldata);
  // 0x40c10f19000000000000000000000000a51c003b1d56b35544c674c0b42c1d7c95f31aba000000000000000000000000000000000000000000000000000000000001b207
  // 220302 20:05 KST 
  // hm... should I just use the signature in the front or the whole thing.
  // Let's just use the whole thing. and then also use just the signature.
  // 220302 20:08 KST
  // So it works when I put in the whole calldata :))))))))) happy happy it was mintd.
  //Imma try to just use the first 10 digit from the encoded data
  // 0x40c10f19
  var calldata = 0x40c10f19;
  // 220302 20:12 KST when used just the first 10 digits, it did not work. 
  var submitW0 = await MultisigW0.submit(target.address, 0, calldata);
  await submitW0.wait();

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
