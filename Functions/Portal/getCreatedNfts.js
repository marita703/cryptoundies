import { ethers } from "ethers";
import CreateCustomNFT from "@/Engine/CreateCustomNFT";
import axios from "axios";
import "sf-font";

import {
  mainnet,
  simpleCrypto,
  hhnft,
  cipherEth,
} from "@/Engine/configuration";

async function getCreatedNFTs(getCreated, setLoadingState) {
  const provider = new ethers.providers.JsonRpcProvider(mainnet);
  const key = simpleCrypto.decrypt(cipherEth);
  const wallet = new ethers.Wallet(key, provider);
  const contract = new ethers.Contract(hhnft, CreateCustomNFT, wallet);
  const itemArray = [];
  contract._tokenIds().then((result) => {
    for (let i = 0; i < result; i++) {
      var token = i + 1;
      const owner = contract.ownerOf(token).catch(function (error) {
        console.log("tokens filtered");
      });
      const rawUri = contract.tokenURI(token).catch(function (error) {
        console.log("tokens filtered");
      });
      const Uri = Promise.resolve(rawUri);
      const getUri = Uri.then((value) => {
        var cleanUri = value.replace("ipfs://", "https://ipfs.io/ipfs/");
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
        Promise.resolve(owner).then((value) => {
          let ownerW = value;
          let meta = {
            name: name,
            img: image,
            tokenId: token,
            wallet: ownerW,
            desc,
          };
          console.log(meta);
          itemArray.push(meta);
        });
      });
    }
  });
  await new Promise((r) => setTimeout(r, 3000));
  getCreated(itemArray);
  setLoadingState("loaded");
}

export { getCreatedNFTs };
