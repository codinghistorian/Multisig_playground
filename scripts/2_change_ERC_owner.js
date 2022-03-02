const hre = require("hardhat");
const fs = require('fs');

require("dotenv").config();

let rawdata = fs.readFileSync('addresses.json');
let addresses = JSON.parse(rawdata);

async function main() {
  const target = {
    address : addresses.target
  };
  const multiSig = {
    address : addresses.multiSig
  };

  const ERC20 = await hre.ethers.getContractFactory("Target");
  const erc20 = await ERC20.attach(
    target.address // The deployed contract address
  );

  var result = await erc20.transferOwnership(multiSig.address);
    // wait until the transaction is mined
  await result.wait();
  console.log(result);



// 220302 14:53
// function below is from ownable.sol

// I just need to call this function to change owner of the ERC20 contract to MultiSig Wallet.
// function transferOwnership(address newOwner) public virtual onlyOwner {
//     require(newOwner != address(0), "Ownable: new owner is the zero address");
//     _transferOwnership(newOwner);
// }

// 15:02
// now that I tried to change owner of the ERC20 token, I need to check if it really changed by
// trying to mint tokens. go to talktotoken.js


}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
