import { ethers } from "ethers";
import axios from "axios";
import NFT from "@/Engine/CreateCustomNFT.json";
import Market from "@/Engine/Market.json";
import { hhnft, hhmarket, mainnet } from "@/Engine/configuration";
import { simpleCrypto, cipherEth } from "@/Engine/configuration";
import "sf-font";
import "react-multi-carousel/lib/styles.css";

async function loadNewSaleNFTs(hhSetNfts) {
  const hhPrivkey = simpleCrypto.decrypt(cipherEth);
  const provider = new ethers.providers.JsonRpcProvider(mainnet);
  const wallet = new ethers.Wallet(hhPrivkey, provider);
  //until here, is a normal conection with the wallet.
  const tokenContract = new ethers.Contract(hhnft, NFT, wallet);
  //create a contract for the CustomMadeNFT
  const marketContract = new ethers.Contract(hhmarket, Market, wallet);
  //Create a contract for the market.

  const data = await marketContract.getAvailableNft();
  //we retrive the getavailablenft from the market contract the data so we can create the metadata
  const items = await Promise.all(
    data.map(async (i) => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId);
      const meta = await axios.get(tokenUri);
      let price = ethers.utils.formatUnits(i.price.toString(), "ether");
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      };
      return item;
    })
  );
  hhSetNfts(items);
}

export { loadNewSaleNFTs };
