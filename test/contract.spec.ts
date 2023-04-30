import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

import contractUri from "../data/contract_uri.json";
import tokenUri from "../data/token_uri.json";

describe("Lock", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContractFixture() {
    const MAX_SUPPLY = 3;
    const INITIAL_CONTRACT_URI = "data:application/json;utf8," + JSON.stringify(contractUri);
    const INITIAL_TOKEN_URI = "data:application/json;utf8," + JSON.stringify(tokenUri);

    const [owner, secondAccount, thirdAccount] = await ethers.getSigners();

    const Contract = await ethers.getContractFactory("CDxIcolab");
    const contract = await Contract.deploy(
      secondAccount.address,
      MAX_SUPPLY,
      INITIAL_CONTRACT_URI,
      INITIAL_TOKEN_URI
    );

    return {
      contract,
      owner,
      secondAccount,
      thirdAccount,
      MAX_SUPPLY,
      INITIAL_TOKEN_URI,
      INITIAL_CONTRACT_URI,
    };
  }

  describe("Deployment", () => {
    it("Should set the right contract URI", async () => {
      const { contract, INITIAL_CONTRACT_URI } = await loadFixture(deployContractFixture);

      expect(await contract.contractURI()).to.equal(INITIAL_CONTRACT_URI);
    });
  });

  describe("Funcionalities", () => {
    it("Should revert when minting with unathorized account", async () => {
      const { contract, thirdAccount } = await loadFixture(deployContractFixture);

      await expect(contract.connect(thirdAccount).mint(thirdAccount.address)).to.be.reverted;
    });

    it("Should allow minting with admin role", async () => {
      const { contract, secondAccount } = await loadFixture(deployContractFixture);
      await contract.connect(secondAccount).mint(secondAccount.address);

      expect(await contract.balanceOf(secondAccount.address)).to.equal(1);
    });

    it("Should return the correct base URI", async () => {
      const { contract, secondAccount, INITIAL_TOKEN_URI } = await loadFixture(
        deployContractFixture
      );
      await contract.connect(secondAccount).mint(secondAccount.address);

      expect(await contract.tokenURI(0)).to.equal(INITIAL_TOKEN_URI);
    });

    it("Should batchmint successfully", async () => {
      const { contract, secondAccount, thirdAccount } = await loadFixture(deployContractFixture);
      await contract.batchMint([secondAccount.address, thirdAccount.address]);

      expect(await contract.balanceOf(secondAccount.address)).to.equal(1);
      expect(await contract.balanceOf(thirdAccount.address)).to.equal(1);
    });

    it("Should not mint beyond max supply", async () => {
      const { contract, owner } = await loadFixture(deployContractFixture);

      for (let i = 0; i <= 2; i++) {
        await contract.mint(owner.address);
      }

      await expect(contract.connect(owner).mint(owner.address)).to.be.revertedWith(
        "Max supply exceeded"
      );
    });
  });
});
