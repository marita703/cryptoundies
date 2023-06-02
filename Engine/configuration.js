/* Update values accordingly
xxnft is the NFT SmartContract Address
xxmarket is the NFT MarketPlace Address
xxresell is the NFT MarketResell Address
xxnftcol is the already create NFT Collection Address
*/

/*
Private Key Encryption
Replace ethraw with your private key "0xPRIVATEKEY" (Ethereum and other EVM)
Replace hhraw with your private key "0xPRIVATEKEY" (Hardhat)
*/
import SimpleCrypto from "simple-crypto-js";
// this encrypts the private key

const cipherKey = "#ertyuhn456cvbnsdcvghjm9876jfsadfa123t";
const ethraw =
  "37b5335e5ab50453a962c7429feb93e449da17dcac52ba0ccc4c62acd817d01b";
// already changed for the private key that deployed all the contracts
//   this is the wallet that is going to deploy the contract for the marketPlace Modify??
// Remember that the wallet for eth also works for polygon.
const hhraw =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
// this one we would use only if we deployed contracts using the hardhat enviroment, but in this case I used my eth sepolia wallet so I have to change all the cipherHH for cipherEth
//   this is the wallet from hardat... Modify??
export const simpleCrypto = new SimpleCrypto(cipherKey);
export const cipherEth = simpleCrypto.encrypt(ethraw);
export const cipherHH = simpleCrypto.encrypt(hhraw);

/*
IPFS API DETAILS
*/

import { create as ipfsHttpClient } from "ipfs-http-client";
export const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

//this is not an api key, we are not logging to infura, is just public.

/*
HardHat Testnet
*/

export var hhresell = "0x9AA77a01931c9994B66b7767EF7023d1151e9033";
// this is the smart contract for resale
export var hhnftcol = "0xd153Ba2481A9249580b42C058eE81055F17A74F5";
// this is the smart contract for Creating the NFTs.
export var hhnft = "0x835F39489b4F74e853B36D750dDC023c49d41c5D";
// this is the address for the custom NFT
export var hhmarket = "0xb7f4F9BADD8Ca25fa2831A4371A04E9AB063d5cB";
var hhrpc =
  "https://eth-sepolia.g.alchemy.com/v2/n6PonKLb8Gfr0g9_Rq65e2YNoRb0HRsz";

/*
Global Parameters
*/
export var mainnet = hhrpc;

// this is the the network... please look how to do it with sepolia.
