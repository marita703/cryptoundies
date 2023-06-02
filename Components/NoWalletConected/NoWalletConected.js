import React from "react";
import { Col, Row, Spacer, Container, Text } from "@nextui-org/react";

function NoWalletConected() {
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
}

export default NoWalletConected;
