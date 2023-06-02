import { ethers } from "ethers";
import { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";
import NFTMarketResell from "../engine/NFTMarketResell.json";
import NFTCollection from "../engine/NFTCollection.json";
import CreateCustomNFT from "../Engine/CreateCustomNFT.json";
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
import { hhresell, hhnftcol } from "../engine/configuration";
import { getCreatedNFTs } from "@/Functions/Portal/getCreatedNfts";
import { getWalletNFTs } from "@/Functions/Portal/getWalletNfts";
import WalletComponent from "@/Components/WalletComponent/WalletComponent";

export default function Sell() {
  //this is the wallet that is conected in metamask...
  const [user, getUser] = useState([]);
  // this will show the user that is conected with the metamask.
  const [resalePrice, updateresalePrice] = useState({ price: "" });
  //with this I can build the nft map
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  //Here we are going to store the created NFTs
  const [created, getCreated] = useState([]);

  useEffect(() => {
    connectUser();
    getWalletNFTs(setNfts, setLoadingState);
    getCreatedNFTs();
  }, [setNfts, getUser, getCreated]);
  const router = useRouter();

  async function connectUser() {
    if (window.ethereum) {
      // this function compare the user that is connected to the metamask, and then changes the useStae of the variable "user"
      //he used web3 inseat of ethers
      var web3 = new Web3(window.ethereum);
      await window.ethereum.send("eth_requestAccounts");
      var accounts = await web3.eth.getAccounts();
      var account = accounts[0];
    }
    getUser(account);
  }

  if (loadingState === "loaded" && !nfts.length)
    return (
      <Container sm>
        <Row>
          <Col>
            <Text h3>No NFTs Found, Connect Wallet</Text>
          </Col>
        </Row>
        <Spacer></Spacer>
      </Container>
    );
  return (
    <div>
      <Container sm>
        <WalletComponent />
        <Grid.Container gap={3}>
          {/* here we are goint to start rendering the NFTs depending on the wallet that is conected */}
          {nfts.map((nft, i) => {
            // thsi is the user conected to metamask
            var owner = user;

            // this compares the owner of the NFT is the same as the user of the wallet conected.
            if (owner.indexOf(nft.wallet) !== -1) {
              async function executeRelist() {
                // this should be the price that the user should provide to resell his NFT again.
                const { price } = resalePrice;
                if (!price) return;
                try {
                  // this calls the relist function in order to be able to resell the NFTs he has.
                  relistNFT();
                } catch (error) {
                  console.log("Transaction Failed", error);
                }
              }
              async function relistNFT() {
                // this part queries the wallet of the user
                const web3Modal = new Web3Modal();
                const connection = await web3Modal.connect();
                const provider = new ethers.providers.Web3Provider(connection);
                const signer = provider.getSigner();
                // this should be the same price as they entered inside of the placeholder for relist.
                // using ethers will allow us to convert the values into decimal.. because remember that this works with wei and wei has 16 extra ceros.
                const price = ethers.utils.parseUnits(
                  resalePrice.price,
                  "ether"
                );
                //this call the contract that created the NFT, calling it from the abi,
                const contractnft = new ethers.Contract(
                  hhnftcol,
                  NFTCollection,
                  signer
                );
                //this calls the nft contract and allows the resell of the collectionNFT  in the contract of the market place (hhresell)
                await contractnft.setApprovalForAll(hhresell, true);
                //  Here we create the contract of resell, and this recieves as parameters the address of the contract, the abi of the market place, and the wallet
                let contract = new ethers.Contract(
                  hhresell,
                  NFTMarketResell,
                  signer
                );

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
              return (
                <Grid key={i}>
                  <Card
                    isHoverable
                    css={{ mw: "200px", marginRight: "$1" }}
                    variant="bordered"
                  >
                    <Card.Image src={nft.img} />
                    <Card.Body sm key={i}>
                      <h3
                        style={{
                          color: "#9D00FF",
                          fontFamily: "SF Pro Display",
                        }}
                      >
                        Owned by You
                      </h3>
                      <Text h5>
                        {nft.name} Token-{nft.tokenId}
                      </Text>
                      <Text>{nft.desc}</Text>
                      {/* in this input puts the price of relist price that comes from the resale price */}
                      <Input
                        size="sm"
                        css={{
                          marginTop: "$2",
                          maxWidth: "120px",
                          marginBottom: "$2",
                          border: "$blue500",
                        }}
                        style={{
                          color: "black",
                          fontFamily: "SF Pro Display",
                          fontWeight: "bolder",
                          fontSize: "15px",
                        }}
                        placeholder="Set your price"
                        onChange={(e) =>
                          updateresalePrice({
                            ...resalePrice,
                            price: e.target.value,
                          })
                        }
                      />
                      <Button
                        size="sm"
                        color="gradient"
                        onPress={executeRelist}
                        style={{ fontSize: "20px" }}
                      >
                        Relist for Sale
                      </Button>
                    </Card.Body>
                  </Card>
                </Grid>
              );
            }
          })}
        </Grid.Container>
      </Container>
    </div>
  );
}
