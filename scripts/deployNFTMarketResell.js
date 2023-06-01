const { ethers } = require("hardhat");

async function deploy() {
  const NFTMarketResell = await ethers.getContractFactory("NFTMarketResell");
  const nft = "0x07Ba06b359B2F369c7CF3fA0FDdbb2F2fdb102C0";
  const nftMarketResell = await NFTMarketResell.deploy(nft);

  await nftMarketResell.deployed();

  console.log("NFTMarketResell deployed to:", nftMarketResell.address);
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
