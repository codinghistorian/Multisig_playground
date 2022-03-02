const hre = require("hardhat");
const fs = require('fs');
require("dotenv").config();

let rawdata = fs.readFileSync('addresses.json');
let addresses = JSON.parse(rawdata);
const target = {
  address : addresses.target
};

async function main() {
  const ERC20 = await hre.ethers.getContractFactory("Target");
  const erc20 = await ERC20.attach(
    target.address // The deployed contract address
  );
  const url = "http://localhost:7545";
  const privateKey0 = process.env.PRIVATE_KEY0;
  const provider = new ethers.providers.JsonRpcProvider(url)
  const wallet0 = new ethers.Wallet(privateKey0,provider);

  
//   function mint(address to, uint256 amount) public onlyOwner {
//     _mint(to, amount);
// }

  var result = await erc20.mint(wallet0.address, 111111111111);
  await result.wait();
  console.log(result);

  const totalSupply = await erc20.totalSupply();
  console.log("totalSupply of target token is " + totalSupply);

  // 220302 15:08
  // okay, checked that the caller is not the owner
  // Wallet0 was the deployer so was supposed to be the owner.
  // now just need to try to mint with Multisig wallet's execution by using low-level call function
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
