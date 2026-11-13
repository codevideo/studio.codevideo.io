import * as React from "react";
import { Card, Flex, Link, Text } from "@radix-ui/themes";
import { APP_VERSION } from "../../runtime/environment";

export function Footer() {
  return (
    <Card mt="9">
      <Flex justify="between" wrap="wrap" gap="2">
        <Flex>
          CodeVideo Studio © {new Date().getFullYear()} 👨‍💻 with ❤️ by&nbsp;
          <Link href="https://fullstackcraft.com"> Full Stack Craft</Link>
        </Flex>
        {APP_VERSION && (
          <Text color="gray" title="Studio version">
            v{APP_VERSION}
          </Text>
        )}
      </Flex>
    </Card>
  );
}
