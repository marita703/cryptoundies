import React from "react";
import {
  Spacer,
  Button,
  Col,
  Row,
  Container,
  Dropdown,
} from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import NavBarButtonsData from "@/Lib/NavBarButtonsData/NavBarButtonsData.js";

function Navbar() {
  return (
    <Container lg css={{ marginTop: "$5" }}>
      <Row justify="center">
        <Col css={{ marginTop: "$8" }}>
          <Image
            width={100}
            height={100}
            src="/Images/Final.png"
            alt="logo image"
          />
        </Col>

        {NavBarButtonsData.map((button) => {
          return (
            <Col css={{ marginTop: "$8" }} key={button.name}>
              <Link href={button.href}>
                <Button
                  size="sm"
                  style={{
                    background: "#00000070",
                    boxShadow: "0px 0px 4px #ffffff",
                  }}
                >
                  <a
                    style={{
                      fontFamily: "SF Pro Display",
                      fontWeight: "500",
                      color: "white",
                      fontSize: "20px",
                    }}
                  >
                    {button.name}
                  </a>
                </Button>
              </Link>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}

export default Navbar;
