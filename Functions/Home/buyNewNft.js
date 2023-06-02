import { ethers } from "ethers";
import Web3Modal from "web3modal";
import Market from "@/Engine/Market.json";
import { hhnft, hhmarket } from "@/Engine/configuration";

import "sf-font";

async function buyNewNft(nft, hhSetNfts) {
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(hhmarket, Market, signer);
  const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
  const transaction = await contract.n2DMarketSale(hhnft, nft.tokenId, {
    value: price,
  });
  await transaction.wait();
  loadNewSaleNFTs(hhSetNfts);
}

export { buyNewNft };
