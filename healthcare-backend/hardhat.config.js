require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/WXw05GNrpj4zdRhM9S980nTY1-mHgt5h",
      chainId: 11155111, // Sepolia Chain ID
      accounts: ["0x5ce548c9e488280287c16c251fd7f11bc980ebb255ec2feb92fcfce0c9f6ca84"], // Private Key 
    },
  },
};
