# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```

## NFT COLLECTION NFT:

to this contract, I changed the baseURI to a new folder that I uploaded to IPFS.. I do not know if this is correct or not, but its working until now.

https://sepolia.etherscan.io/address/0x07Ba06b359B2F369c7CF3fA0FDdbb2F2fdb102C0#code

address: 0x07Ba06b359B2F369c7CF3fA0FDdbb2F2fdb102C0

Wallet that deployed: 0x3200c9E4FF0A35e8417cdEE82F659108E4663408

## NFT Market Resell:

Here we had to modify the deploy script because this contract recieves an NFT as parameter.. so we had to create a const that is called nft, and give the address of the nft contract that is already deployed. at the moment of verify the contract we had to give the next comand:

npx hardhat verify --network sepolia 0xD8b6521d9aeF5F30C4d0bB2709748f10c52F5318 0x07Ba06b359B2F369c7CF3fA0FDdbb2F2fdb102C0

the first address is the one of the contract to verify , and the second address is the one of the nft. ß

https://sepolia.etherscan.io/address/0xD8b6521d9aeF5F30C4d0bB2709748f10c52F5318#code

address: 0xD8b6521d9aeF5F30C4d0bB2709748f10c52F5318
Wallet that deployed: 0x3200c9E4FF0A35e8417cdEE82F659108E4663408

## ABI ...

Remember to change the abi from the artifacts directory to the engine directory so we can interact with the contract from with the front end.
