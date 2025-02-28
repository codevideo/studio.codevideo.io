import * as React from "react";
import { Container, Flex, Text, Link, Heading } from "@radix-ui/themes";

export function NotFound() {
  return (
    <Container size="4" style={{ minHeight: "100vh" }}>
      <Flex
        direction="column"
        align="center"
        justify="center"
        gap="3"
        style={{ height: "100vh" }}
      >
        <Heading size="9" m="9" weight="bold">
          {'/>'} CodeVideo Studio
        </Heading>
        <Heading size="6" weight="bold">
          Woops, that's a 404!
        </Heading>
        <Text align="center">
          CodeVideo is revolutionizing the way software creators make video
          content.
        </Text>
        <Text align="center">Get back to the homepage and see!</Text>
        <Link href="/" color="mint" highContrast>
          Return Home
        </Link>
      </Flex>
    </Container>
  );
}