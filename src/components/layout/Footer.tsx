import * as React from "react";
import { Card, Flex, Link } from "@radix-ui/themes";

export function Footer() {
  return (
    <Card>
      <Flex m="3">
        © {new Date().getFullYear()} 👨‍💻 with ❤️ by&nbsp;
        <Link href="https://fullstackcraft.com"> Full Stack Craft</Link>
      </Flex>
    </Card>
  );
}
