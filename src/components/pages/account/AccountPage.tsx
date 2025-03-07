import React from 'react';
import { useUser, SignedIn, SignedOut, RedirectToSignIn, UserButton, useClerk } from '@clerk/clerk-react';
import {
  Box,
  Card,
  Text,
  Flex,
  Badge,
  Button,
  Separator,
  Tooltip
} from '@radix-ui/themes';
import {
  InfoCircledIcon,
} from '@radix-ui/react-icons';
import { Link } from 'gatsby';
import { resolveTokensColor } from '../../../utils/resolveTokensColor';

export interface ClerkMetadata {
  tokens: number;
  stripeId: string;
  unlimited: boolean;
  subscriptionPlan: string;
  subscriptionStatus: string;
  tokensPerCycle: number;
}

const fallbackValues: ClerkMetadata = {
  tokens: 0,
  stripeId: '',
  unlimited: false,
  subscriptionPlan: 'No plan found',
  subscriptionStatus: 'No status found',
  tokensPerCycle: 0
};

export const AccountPage = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  console.log(user)

  // Get subscription data from Clerk metadata
  const getUserData = (): ClerkMetadata => {
    if (!isLoaded || !user) return fallbackValues;

    return {
      tokens: (user.publicMetadata as any).tokens || fallbackValues.tokens,
      stripeId: (user.publicMetadata as any).stripeId || fallbackValues.stripeId,
      unlimited: (user.publicMetadata as any).unlimited || fallbackValues.unlimited,
      subscriptionPlan: (user.publicMetadata as any).subscriptionPlan || fallbackValues.subscriptionPlan,
      subscriptionStatus: (user.publicMetadata as any).subscriptionStatus || fallbackValues.subscriptionStatus,
      tokensPerCycle: (user.publicMetadata as any).tokensPerCycle || fallbackValues.tokensPerCycle
    };
  };

  // Get subscription plan name and details
  const getSubscriptionInfo = (userData: any) => {
    if (!userData || !userData.subscription) return { name: 'No Active Subscription', tokens: 0 };

    switch (userData.subscription.plan) {
      case 'subscription-standard':
        return { name: 'Standard Plan', tokens: 50 };
      case 'subscription-premium':
        return { name: 'Premium Plan', tokens: 500 };
      default:
        return { name: 'Custom Plan', tokens: userData.subscription.tokens_per_cycle || 0 };
    }
  };

  const onClickLogout = () => {
    signOut();
  }

  // Render loading state
  if (!isLoaded) {
    return (
      <Flex justify="center" align="center" style={{ height: '50vh' }}>
        <Text size="1">Loading dashboard...</Text>
      </Flex>
    );
  }

  const userData = getUserData();
  const subscriptionInfo = getSubscriptionInfo(userData);

  const tokensColor = resolveTokensColor(userData.tokens);

  return (
    <Box mt="4" p="1" pt="9">
      <SignedIn>
        <Card size="1">
          <Flex direction="column" gap="2">
            <Text size="1" color="gray">Your Account</Text>

            {user && (
              <Flex align="center" gap="2">
                <UserButton />
                <Text size="1">{user.primaryEmailAddress?.emailAddress}</Text>
              </Flex>
            )}

            <Separator size="1" my="2" />

            <Text size="1" color="gray">Contact</Text>
            <Flex direction="column" gap="1">
              <Box>
                <Link to="/contact">
                  <Button size="1" color="mint" ml="1">Support or Feature Request</Button>
                </Link>
              </Box>
            </Flex>

            <Separator size="1" my="2" />

            <Text size="1" color="gray">Available tokens</Text>
            <Flex align="center" gap="2">
              <Text size="1" weight="bold" color={tokensColor}>{userData.tokens}</Text>
            </Flex>
            <Flex direction="column" gap="1">
              <Box>
                <Button size="1" color="mint" ml="1">+ 50 tokens for $10</Button>
              </Box>
              <Box>
                <Button size="1" color="mint" ml="1">+ 100 tokens for $20</Button>
              </Box>
              <Box>
                <Button size="1" color="mint" ml="1">+ 500 tokens for $49</Button>
              </Box>
              <Box>
                <Button size="1" color="mint" ml="1">+ 10000 tokens for $499</Button>
              </Box>
              {/* Info icon with tooltip for generations per token */}
              <Flex>
                <Tooltip content={<>10 tokens can generate:<br /><br />1 Video<br />2 Powerpoint<br />2 PDF<br />2 React<br />5 HTML<br />10 Markdown<br /></>}>
                  <Box>
                    <InfoCircledIcon />
                    <Text size="1" color="gray">Token usage and costs</Text>
                  </Box>
                </Tooltip>
              </Flex>

            </Flex>

            <Separator size="1" my="2" />

            <Text size="1" color="gray">Plan</Text>
            <Flex align="center" gap="2" wrap="wrap">
              <Text size="1" weight="bold">{subscriptionInfo.name}</Text>
              {userData.subscriptionPlan === 'lifetime' && (
                <Badge size="1" color="mint" variant="soft">Unlimited</Badge>
              )}
              {userData.subscriptionPlan !== 'lifetime' && userData.subscriptionPlan !== fallbackValues.subscriptionPlan && (
                <Badge size="1" color="mint" variant="soft">
                  {subscriptionInfo.tokens} tokens/month
                </Badge>
              )}
              {userData.subscriptionPlan !== fallbackValues.subscriptionPlan && <Button size="1" variant="soft" color="red">
                Cancel
              </Button>}
            </Flex>

            {userData.subscriptionPlan === fallbackValues.subscriptionPlan && (
              <Flex direction="column" gap="1">
                <Box>
                  <Button size="1" color="mint">Buy Starter</Button>
                  <Text size="1" color="gray" ml="1">50 tokens for $10 / mo.</Text>
                </Box>
                <Box>
                  <Button size="1" color="mint">Buy Creator</Button>
                  <Text size="1" color="gray" ml="1">500 tokens for $49 / mo.</Text>
                </Box>
                <Box>
                  <Button size="1" color="mint">Buy Enterprise</Button>
                  <Text size="1" color="gray" ml="1">10000 tokens for $499 / mo.</Text>
                </Box>
                <Box>
                  <Button size="1" color="amber">Buy Lifetime</Button>
                  <Text size="1" color="gray" ml="1">Lifetime usage for $2000</Text>
                </Box>
              </Flex>
            )}

            <Separator size="1" my="2" />

            <Text size="1" color="gray">Payment Methods</Text>
            <Flex>
              <Button size="1" variant="outline">
                Manage in Stripe
              </Button>
            </Flex>

            <Separator size="1" my="2" />

            <Text size="1" color="gray">Logout</Text>
            <Flex>
              <Button size="1" variant="outline" onClick={onClickLogout}>
                Logout
              </Button>
            </Flex>

          </Flex>
        </Card>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </Box>
  );
};