import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";
import NFTCollection from "../Engine/NFTCollection.json";
import Resell from "../Engine/NFTMarketResell.json";
import CreateCustomNFT from "../Engine/CreateCustomNFT.json";
import Market from "../Engine/Market.json";
import {
  Grid,
  Card,
  Text,
  Button,
  Row,
  Spacer,
  Container,
} from "@nextui-org/react";
import {
  hhnft,
  hhmarket,
  hhresell,
  hhnftcol,
  mainnet,
} from "@/Engine/configuration";
import { simpleCrypto, cipherEth } from "@/Engine/configuration";
import confetti from "canvas-confetti";
import "sf-font";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Image from "next/image";
import { loadNewSaleNFTs } from "@/Functions/Home/loadNewSaleNFTs";
import { buyNewNft } from "@/Functions/Home/buyNewNft";
import { loadHardHatResell } from "@/Functions/Home/loadHardHatResell";

export default function Home() {
  const [hhlist, hhResellNfts] = useState([]);
  //this stores the nfts from the nft Collection that are listed for sale.
  const [hhnfts, hhSetNfts] = useState([]);
  //here we are going to store the nfts that someone created for sale.

  useEffect(() => {
    loadHardHatResell(hhResellNfts);
    loadNewSaleNFTs(hhSetNfts);
  }, [hhResellNfts, hhSetNfts]);

  //this will trough confetti when people press the button.
  const handleConfetti = () => {
    confetti();
  };
  const router = useRouter();

  // this is from next ui ...
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };

  return (
    <div>
      <div>
        <Container
          xl
          style={{
            backgroundImage:
              "linear-gradient(to top, #020202, #050505, #080808, #0b0b0b, #0e0e0e, #16141a, #1e1724, #291a2d, #451a3a, #64133c, #820334, #9b0022)",
          }}
        >
          <Container xs css={{ marginBottom: "$3" }}>
            <Text css={{ marginLeft: "$40", justifyContent: "" }} h2>
              Top Collections
            </Text>
            {/* this is how to set the carrousel! please go and read the documentation */}
            <Carousel
              swipeable={false}
              draggable={false}
              showDots={true}
              responsive={responsive}
              ssr={true}
              infinite={true}
              autoPlay={true}
              autoPlaySpeed={6000}
              keyBoardControl={true}
              customTransition="all .5"
              transitionDuration={800}
              containerClass="carousel-container"
              removeArrowOnDeviceType={["tablet", "mobile"]}
              dotListClass="custom-dot-list-style"
              itemClass="carousel-item-padding-60-px"
            >
              {/* this is rendering everything inside of the carousel */}
              {hhlist.map((nft, i) => (
                <div key={i}>
                  <Card.Image
                    css={{ marginLeft: "$15", maxWidth: "450px" }}
                    src={nft.img}
                    key={i}
                  />
                </div>
              ))}
            </Carousel>
          </Container>
        </Container>
      </div>
      <Container sm>
        <Row css={{ marginTop: "$3", marginBottom: "$3" }}>
          <Text h3>Latest NFTs</Text>
        </Row>
        <Grid.Container gap={1} justify="flex-start">
          {/* this is to separate things, will start from cero to nine, starts rendering but only from chunks of 9 nfts  */}
          {hhlist.slice(0, 9).map((nft, id) => {
            //
            async function buylistNft() {
              const web3Modal = new Web3Modal();
              const connection = await web3Modal.connect();
              const provider = new ethers.providers.Web3Provider(connection);
              const signer = provider.getSigner();
              const contract = new ethers.Contract(hhresell, Resell, signer);
              //this will buy the nft and give the nft we want to sell and the value of it as parameters to the functions
              const transaction = await contract.buyNft(nft.tokenId, {
                value: nft.cost,
              });
              await transaction.wait();
              router.push("/portal");
            }
            return (
              <Grid xs={3} key={id}>
                <Card
                  style={{ boxShadow: "1px 1px 10px #ffffff" }}
                  variant="bordered"
                  key={id}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontFamily: "SF Pro Display",
                      fontWeight: "200",
                      fontSize: "20px",
                      marginLeft: "3px",
                    }}
                  >
                    {nft.name} Token-{nft.tokenId}
                  </Text>
                  <Card.Body css={{ p: 0 }}>
                    <Card.Image
                      style={{ maxWidth: "150px", borderRadius: "6%" }}
                      src={nft.img}
                    />
                  </Card.Body>
                  <Card.Footer css={{ justifyItems: "flex-start" }}>
                    <Row
                      key={id}
                      wrap="wrap"
                      justify="space-between"
                      align="center"
                    >
                      <Text wrap="wrap">{nft.desc}</Text>
                      <Text style={{ fontSize: "30px" }}>
                        {nft.val}{" "}
                        <Image
                          src="n2dr-logo.png"
                          style={{
                            width: "60px",
                            height: "25px",
                            marginTop: "4px",
                          }}
                          alt="image of the log"
                        />
                      </Text>
                      <Button
                        color="gradient"
                        style={{ fontSize: "20px" }}
                        //this will set the confetti and call the buylist nft function, passing as a parameter the price of the nft
                        onPress={() => handleConfetti(buylistNft(nft))}
                      >
                        Buy
                      </Button>
                    </Row>
                  </Card.Footer>
                </Card>
              </Grid>
            );
          })}
        </Grid.Container>
      </Container>
      <Spacer></Spacer>

      <Spacer></Spacer>
      <Container sm>
        <Row css={{ marginTop: "$3", marginBottom: "$3" }}>
          <Text h3>Latest NFTs on</Text>
          <Image
            src="/"
            style={{ width: "190px", height: "45px", marginLeft: "4px" }}
            width="190"
            height="45"
            alt="ethlogo"
          />
        </Row>
        <Grid.Container gap={1} justify="flex-start">
          {hhnfts.slice(0, 4).map((nft, i) => (
            <Grid xs={3} key={i}>
              <Card
                style={{
                  marginRight: "3px",
                  boxShadow: "1px 1px 10px #ffffff",
                }}
                variant="bordered"
                key={i}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontFamily: "SF Pro Display",
                    fontWeight: "200",
                    fontSize: "20px",
                    marginLeft: "3px",
                  }}
                >
                  {nft.name}
                </Text>
                <Card.Body css={{ p: 0 }}>
                  <Card.Image
                    style={{
                      maxWidth: "150px",
                      maxHeight: "150px",
                      borderRadius: "6%",
                    }}
                    src={nft.image}
                  />
                </Card.Body>
                <Card.Footer css={{ justifyItems: "flex-start" }}>
                  <Row wrap="wrap" justify="space-between" align="center">
                    <Text wrap="wrap">{nft.description}</Text>
                    <Text style={{ fontSize: "30px" }}>
                      {nft.price}
                      <Image
                        src="/"
                        style={{
                          marginTop: "4px",
                        }}
                        width="60px"
                        height="25px"
                        alt="another logo"
                      />
                    </Text>
                    <Button
                      color="gradient"
                      style={{ fontSize: "20px" }}
                      onClick={() => handleConfetti(buyNewNft(nft))}
                    >
                      Buy
                    </Button>
                  </Row>
                </Card.Footer>
              </Card>
            </Grid>
          ))}
        </Grid.Container>
      </Container>
    </div>
  );
}
