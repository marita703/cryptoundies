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

https://sepolia.etherscan.io/address/0xd153Ba2481A9249580b42C058eE81055F17A74F5#code

address: 0xd153Ba2481A9249580b42C058eE81055F17A74F5

Wallet that deployed: 0x3200c9E4FF0A35e8417cdEE82F659108E4663408

## NFT Market Resell:

Here we had to modify the deploy script because this contract recieves an NFT as parameter.. so we had to create a const that is called nft, and give the address of the nft contract that is already deployed. at the moment of verify the contract we had to give the next comand:

npx hardhat verify --network sepolia 0x68bdbfcf956f4d316304b1759567c08cd4151b12 0xd153Ba2481A9249580b42C058eE81055F17A74F5

the first address is the one of the contract to verify , and the second address is the one of the nft. ß

https://sepolia.etherscan.io/address/0x68bdbfcf956f4d316304b1759567c08cd4151b12#code

address: 0x68bdbfcf956f4d316304b1759567c08cd4151b12

Wallet that deployed: 0x3200c9E4FF0A35e8417cdEE82F659108E4663408

## Market

https://sepolia.etherscan.io/address/0xb7f4F9BADD8Ca25fa2831A4371A04E9AB063d5cB#code
Address: 0xb7f4F9BADD8Ca25fa2831A4371A04E9AB063d5cB
Wallet that deployed: 0x3200c9E4FF0A35e8417cdEE82F659108E4663408

## Create Custom NFT

had to verify with the next command:
npx hardhat verify --network sepolia 0x835F39489b4F74e853B36D750dDC023c49d41c5D 0xb7f4F9BADD8Ca25fa2831A4371A04E9AB063d5cB

since the constructor recieves the parameter of the address of the market contract.

https://sepolia.etherscan.io/address/0x835F39489b4F74e853B36D750dDC023c49d41c5D#code
Address: 0x835F39489b4F74e853B36D750dDC023c49d41c5D
Wallet that deployed: 0x3200c9E4FF0A35e8417cdEE82F659108E4663408

## ABI ...

Remember to change the abi from the artifacts directory to the engine directory so we can interact with the contract from with the front end.

## remember to change this on the Engine configuration js:

the address of my actual deployed contracs
