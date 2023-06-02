const { ethers } = require("hardhat");

async function deploy() {
  const NFTMarketResell = await ethers.getContractFactory("NFTMarketResell");
  const nft = "0xd153Ba2481A9249580b42C058eE81055F17A74F5";
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
