import { ethers } from "ethers";
import { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";
import NFTCollection from "@/Engine/NFTCollection";
import axios from "axios";
import "sf-font";
import Web3 from "web3";
import {
  hhresell,
  hhnftcol,
  mainnet,
  simpleCrypto,
  cipherEth,
  hhnft,
} from "@/Engine/configuration";

async function getWalletNFTs(setNfts, setLoadingState) {
  const provider = new ethers.providers.JsonRpcProvider(mainnet);
  const key = simpleCrypto.decrypt(cipherEth);
  // this grab the cipher key, and unencrypt it so it can be used in the code.
  const wallet = new ethers.Wallet(key, provider);
  const contract = new ethers.Contract(hhnftcol, NFTCollection, wallet);
  const itemArray = [];
  contract.totalSupply().then((result) => {
    let totalSup = parseInt(result, 16);
    for (let i = 0; i < totalSup; i++) {
      var token = i + 1;
      const owner = contract.ownerOf(token).catch(function (error) {
        console.log("tokens filtered");
      });
      const rawUri = contract.tokenURI(token).catch(function (error) {
        console.log("tokens filtered");
      });
      const Uri = Promise.resolve(rawUri);
      const getUri = Uri.then((value) => {
        let str = value;
        let cleanUri = str.replace("ipfs://", "https://ipfs.io/ipfs/");
        //   this converts the ipfs jason data into https and then we can render the images of the nfts.
        console.log(cleanUri);
        let metadata = axios.get(cleanUri).catch(function (error) {
          console.log(error.toJSON());
        });
        return metadata;
      });
      getUri.then((value) => {
        // here we start using AXIOS
        let rawImg = value.data.image;
        var name = value.data.name;
        var desc = value.data.description;
        let image = rawImg.replace("ipfs://", "https://ipfs.io/ipfs/");
        Promise.resolve(owner).then((value) => {
          let ownerW = value;
          // Here we start creating the metadata object for each NFT
          let meta = {
            name: name,
            img: image,
            tokenId: token,
            wallet: ownerW,
            desc,
          };
          // console.log(meta);
          itemArray.push(meta);
        });
      });
    }
  });
  await new Promise((r) => setTimeout(r, 3000));
  // here we are givin time to the code to render the images...
  setNfts(itemArray);
  setLoadingState("loaded");
}

export { getWalletNFTs };
