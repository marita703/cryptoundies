const hre = require("hardhat");

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;

  const lockedAmount = hre.ethers.utils.parseEther("0.001");

  const marketAddress = "0xb7f4F9BADD8Ca25fa2831A4371A04E9AB063d5cB";

  const CreateCustomNFT = await hre.ethers.getContractFactory(
    "CreateCustomNFT"
  );
  const createCustomNFT = await CreateCustomNFT.deploy(marketAddress);

  await createCustomNFT.deployed();

  console.log(
    `Lock with ${ethers.utils.formatEther(
      lockedAmount
    )}ETH and unlock timestamp ${unlockTime} deployed to ${
      createCustomNFT.address
    }`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
