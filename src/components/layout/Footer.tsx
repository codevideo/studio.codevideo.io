import * as React from "react";
import { Card, Flex, Link } from "@radix-ui/themes";

export function Footer() {
  return (
    <Card mt="9">
      <Flex>
        CodeVideo Studio © {new Date().getFullYear()} 👨‍💻 with ❤️ by&nbsp;
        <Link href="https://fullstackcraft.com"> Full Stack Craft</Link>
      </Flex>
    </Card>
  );
}
