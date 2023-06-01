require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
const dotenv = require("dotenv");
dotenv.config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: process.env.MY_ALCHEMY_RPC_ENDPOINT,
      accounts: [process.env.MY_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.MY_ETHERSCAN_KEY,
  },
};
