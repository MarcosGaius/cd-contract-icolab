import { ethers } from "hardhat";
import contractUri from "../data/contract_uri.json";
import tokenUri from "../data/token_uri.json";

async function main() {
  const MAX_SUPPLY = 15;
  const INITIAL_CONTRACT_URI = "data:application/json;utf8," + JSON.stringify(contractUri);
  const INITIAL_TOKEN_URI = "data:application/json;utf8," + JSON.stringify(tokenUri);

  const Contract = await ethers.getContractFactory("CDxIcolab");
  const contract = await Contract.deploy(
    "0xcB89C3c17BC5f0F3dcb878a5803DFF8319F54513",
    MAX_SUPPLY,
    INITIAL_CONTRACT_URI,
    INITIAL_TOKEN_URI
  );

  await contract.deployed();

  console.log(`CDxiCoLab deployed to ${contract.address}`);

  await contract.mint("0xA789CFD14Bebcb62C3274fb22355094B59Ab13EC");
  console.log("Minted 1 NFT to 0xA789CFD14Bebcb62C3274fb22355094B59Ab13EC");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
