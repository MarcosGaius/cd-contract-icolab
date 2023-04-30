import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    mumbai: {
      chainId: 80001,
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY!],
    },
  },
};

export default config;
