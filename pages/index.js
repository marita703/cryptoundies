import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";
import NFTCollection from "../Engine/NFTCollection.json";
import Resell from "../Engine/NFTMarketResell.json";
import {
  Grid,
  Card,
  Text,
  Button,
  Row,
  Spacer,
  Container,
} from "@nextui-org/react";
import { hhresell, hhnftcol, mainnet } from "@/Engine/configuration";
import { cipherHH, simpleCrypto, cipherEth } from "@/Engine/configuration";
import confetti from "canvas-confetti";
import "sf-font";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Image from "next/image";

export default function Home() {
  const [hhlist, hhResellNfts] = useState([]);
  useEffect(() => {
    loadHardHatResell();
  }, [hhResellNfts]);

  //this will trough confetti when people press the button.
  const handleConfetti = () => {
    confetti();
  };
  const router = useRouter();

  async function loadHardHatResell() {
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
    </div>
  );
}
