import { useState, useEffect } from "react";
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
import "sf-font";
import Web3 from "web3";
import { getCreatedNFTs } from "@/Functions/Portal/getCreatedNfts";
import { getWalletNFTs } from "@/Functions/Portal/getWalletNfts";
import WalletComponent from "@/Components/WalletComponent/WalletComponent";
import NoWalletConected from "@/Components/NoWalletConected/NoWalletConected";
import { relistNFT } from "@/Functions/Portal/relistNFT";

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

  if (loadingState === "loaded" && !nfts.length) return <NoWalletConected />;
  return (
    <div>
      <Container sm>
        <WalletComponent />
        <Row>
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
        </Row>
      </Container>

      {/* Here starts the Created NFTs  */}
      <Spacer></Spacer>
      <Container md>
        <Text h4>Created NFTs in Wallet</Text>
        <Row>
          <Grid.Container justify="flex-start" gap={4}>
            {created.map((nft, i) => {
              var owner = user;
              if (owner.indexOf(nft.wallet) !== -1) {
                return (
                  <Grid key={i}>
                    <Card
                      isHoverable
                      key={i}
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
                      </Card.Body>
                    </Card>
                  </Grid>
                );
              }
            })}
          </Grid.Container>
        </Row>
      </Container>
    </div>
  );
}
