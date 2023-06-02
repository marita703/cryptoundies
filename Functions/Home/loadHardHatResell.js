import { ethers } from "ethers";
import axios from "axios";
import NFTCollection from "@/Engine/NFTCollection.json";
import Resell from "@/Engine/NFTMarketResell.json";
import { hhresell, hhnftcol, mainnet } from "@/Engine/configuration";
import { simpleCrypto, cipherEth } from "@/Engine/configuration";
import "react-multi-carousel/lib/styles.css";

async function loadHardHatResell(hhResellNfts) {
  const provider = new ethers.providers.JsonRpcProvider(mainnet);
  const key = simpleCrypto.decrypt(cipherEth);
  const wallet = new ethers.Wallet(key, provider);
  // this is the nftsmartcontract
  const contract = new ethers.Contract(hhnftcol, NFTCollection, wallet);
  // this is the market place contract
  const market = new ethers.Contract(hhresell, Resell, wallet);
  const itemArray = [];
  contract.totalSupply().then((result) => {
    for (let i = 0; i < result; i++) {
      var token = i + 1;
      var owner = contract.ownerOf(token);
      var getOwner = Promise.resolve(owner);
      getOwner.then((address) => {
        if (address == hhresell) {
          const rawUri = contract.tokenURI(token);
          const Uri = Promise.resolve(rawUri);
          const getUri = Uri.then((value) => {
            let str = value;
            let cleanUri = str.replace("ipfs://", "https://ipfs.io/ipfs/");
            console.log(cleanUri);
            let metadata = axios.get(cleanUri).catch(function (error) {
              console.log(error.toJSON());
            });
            return metadata;
          });
          getUri.then((value) => {
            let rawImg = value.data.image;
            var name = value.data.name;
            var desc = value.data.description;
            let image = rawImg.replace("ipfs://", "https://ipfs.io/ipfs/");
            const price = market.getPrice(token);
            Promise.resolve(price).then((_hex) => {
              var salePrice = Number(_hex);
              var txPrice = salePrice.toString();
              Promise.resolve(owner).then((value) => {
                let ownerW = value;
                let outPrice = ethers.utils.formatUnits(
                  salePrice.toString(),
                  "ether"
                );
                let meta = {
                  name: name,
                  img: image,
                  cost: txPrice,
                  val: outPrice,
                  tokenId: token,
                  wallet: ownerW,
                  desc,
                };
                console.log(meta);
                //this will store all of these in the array
                itemArray.push(meta);
              });
            });
          });
        }
      });
    }
  });

  //hold on for 3 seconds and display anything
  await new Promise((r) => setTimeout(r, 3000));
  hhResellNfts(itemArray);
}

export { loadHardHatResell };
