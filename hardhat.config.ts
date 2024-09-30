import { HardhatUserConfig } from "hardhat/config";
import * as dotenv from "dotenv";
import "@nomicfoundation/hardhat-toolbox";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    hardhat: {},
    blastSepolia: {
      url: `${process.env.BLAST_RPC_URL}`,
      accounts: [`${process.env.PRIVATE_KEY_DEPLOY}`],
    },
  },
};

export default config;
