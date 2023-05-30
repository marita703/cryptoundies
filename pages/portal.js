import { ethers } from "ethers";
import { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";
import Resell from "../engine/Resell.json";
import NFTCollection from "../engine/NFTCollection.json";
import {
  Card,
  Button,
  Input,
  Col,
  Row,
  Spacer,
  Container,
  Text,
  Grid,
} from "@nextui-org/react";
import axios from "axios";
import "sf-font";
import Web3 from "web3";
import {
  hhresell,
  hhnftcol,
  mainnet,
  cipherHH,
  simpleCrypto,
} from "../engine/configuration";

export default function Sell() {
  const [user, getUser] = useState([]);
  // this will show the user that is conected with the metamask.
  const [resalePrice, updateresalePrice] = useState({ price: "" });
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    connectUser();
    getWalletNFTs();
  }, [setNfts, getUser]);
  const router = useRouter();

  async function connectUser() {
    if (window.ethereum) {
      // this function compare the user that is connected to the metamask, and then changes the useStae of the variable "user"
      var web3 = new Web3(window.ethereum);
      await window.ethereum.send("eth_requestAccounts");
      var accounts = await web3.eth.getAccounts();
      var account = accounts[0];
    }
    getUser(account);
  }
}
