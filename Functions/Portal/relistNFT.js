import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";
import NFTMarketResell from "@/Engine/NFTMarketResell.json";
import NFTCollection from "@/Engine/NFTCollection.json";
import "sf-font";
import { hhresell, hhnftcol } from "@/Engine/configuration";

const router = useRouter();

async function relistNFT() {
  // this part queries the wallet of the user
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  // this should be the same price as they entered inside of the placeholder for relist.
  // using ethers will allow us to convert the values into decimal.. because remember that this works with wei and wei has 16 extra ceros.
  const price = ethers.utils.parseUnits(resalePrice.price, "ether");
  //this call the contract that created the NFT, calling it from the abi,
  const contractnft = new ethers.Contract(hhnftcol, NFTCollection, signer);
  //this calls the nft contract and allows the resell of the collectionNFT  in the contract of the market place (hhresell)
  await contractnft.setApprovalForAll(hhresell, true);
  //  Here we create the contract of resell, and this recieves as parameters the address of the contract, the abi of the market place, and the wallet
  let contract = new ethers.Contract(hhresell, NFTMarketResell, signer);

  // Here we get the listing fee from the market place smart contract, remember that we named this contract as just "contract"
  let listingFee = await contract.getListingFee();
  // this convert the value to a string
  listingFee = listingFee.toString();

  let transaction = await contract.listSale(nft.tokenId, price, {
    value: listingFee,
  });
  await transaction.wait();
  router.push("/");
}

export { relistNFT };
