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
  Tooltip,
  Link as RadixLink
} from '@radix-ui/themes';
import {
  InfoCircledIcon,
} from '@radix-ui/react-icons';
import { Link } from 'gatsby';
import { TokenCountBadge } from '../../utils/TokenCountBadge';
import { TokenCosts } from '../../../constants/TokenCosts';

export interface ClerkMetadata {
  tokens: number;
  stripeId: string;
  unlimited: boolean;
  subscriptionPlan: string;
  subscriptionStatus: string;
  tokensPerCycle: number;
}

const subscriptionPlansToMonthlyTokens = (plan: string) => {
  switch (plan) {
    case 'starter':
      return 50;
    case 'creator':
      return 500;
    case 'enterprise':
      return 10000;
    default:
      return 0;
  }
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

  const htmlsLeft = Math.floor(userData.tokens/TokenCosts['html'])
  const pdfsLeft = Math.floor(userData.tokens/TokenCosts['pdf'])
  const reactsLeft = Math.floor(userData.tokens/TokenCosts['react'])
  const advancedMarkdownsLeft = Math.floor(userData.tokens/TokenCosts['complex-markdown'])
  const videoGenerationsLeft = Math.floor(userData.tokens/TokenCosts['mp4'])
  const pptxsLeft = Math.floor(userData.tokens/TokenCosts['pptx'])

  const videosPer10 = Math.floor(10/TokenCosts['mp4'])
  const pptxPer10 = Math.floor(10/TokenCosts['pptx'])
  const pdfPer10 = Math.floor(10/TokenCosts['pdf'])
  const reactPer10 = Math.floor(10/TokenCosts['react'])
  const htmlPer10 = Math.floor(10/TokenCosts['html'])
  const advancedMarkdownPer10 = Math.floor(10/TokenCosts['complex-markdown'])

  console.log('userData', userData);

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
            <Flex align="center" gap="1" mx="1">
              <TokenCountBadge />
            </Flex>
            <Text size="1" color="gray">~{advancedMarkdownsLeft} Advanced markdown generations</Text>
            <Text size="1" color="gray">~{htmlsLeft} HTML generations</Text>
            <Text size="1" color="gray">~{pdfsLeft} PDF generations</Text>
            <Text size="1" color="gray">~{reactsLeft} Interactive React page generations</Text>
            <Text size="1" color="gray">~{pptxsLeft} Powerpoint generations</Text>
            <Text size="1" color="gray">~{videoGenerationsLeft} Video generations</Text>

            <Separator size="1" my="2" />

            <Text size="1" color="gray">Add more tokens</Text>
            <Text size="1" color="gray">10 tokens per $2</Text>

            <Flex direction="column" gap="1">
              <Box>
                <RadixLink href={process.env.GATSBY_STRIPE_TOPUP_PAYMENT_LINK}>
                  <Button size="1" color="mint" ml="1">Buy Tokens</Button>
                </RadixLink>
              </Box>
              {/* Info icon with tooltip for generations per token */}
              <Flex>
                <Tooltip content={<>
                  10 tokens can be used for the following exports:<br />
                  <br />
                  {advancedMarkdownPer10} Advanced Markdown<br />
                  {htmlPer10} HTML<br />
                  {pdfPer10} PDF<br />
                  {reactPer10} React<br />
                  {pptxPer10} Powerpoint<br />
                  {videosPer10} Video<br />
                  <br />
                  *Simple Markdown and JSON always free</>}>
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
              <Text color="mint" size="1" weight="bold">{userData.subscriptionPlan}</Text>
              {userData.subscriptionPlan === 'lifetime' && (
                <Badge size="1" color="mint" variant="soft">Unlimited Tokens; You're a Legend!</Badge>
              )}
              {userData.subscriptionPlan !== 'lifetime' && userData.subscriptionPlan !== fallbackValues.subscriptionPlan && (
                <Badge size="1" color="mint" variant="soft">
                  {subscriptionPlansToMonthlyTokens(userData.subscriptionPlan)} tokens/month
                </Badge>
              )}
              {userData.subscriptionPlan !== 'No plan found' && 
              <RadixLink href={process.env.GATSBY_STRIPE_CUSTOMER_PORTAL_LINK}>
              <Button size="1" variant="soft" color="red">
                Cancel
              </Button></RadixLink>}
            </Flex>

            <Separator size="1" my="2" />

            <Text size="1" color="gray">Change Plan</Text>

            <Flex direction="column" gap="1">
              {userData.subscriptionPlan !== 'starter' && <Box>
                <RadixLink href={process.env.GATSBY_STRIPE_STARTER_PAYMENT_LINK}>
                  <Button size="1" color="mint">Buy Starter</Button>
                </RadixLink>
                <Text size="1" color="gray" ml="1">50 tokens for $10 / mo.</Text>
              </Box>}
              {userData.subscriptionPlan !== 'creator' && <Box>
                <RadixLink href={process.env.GATSBY_STRIPE_CREATOR_PAYMENT_LINK}>
                  <Button size="1" color="mint">Buy Creator</Button>
                </RadixLink>
                <Text size="1" color="gray" ml="1">500 tokens for $49 / mo.</Text>
              </Box>}
              {userData.subscriptionPlan !== 'enterprise' && <Box>
                <RadixLink href={process.env.GATSBY_STRIPE_ENTERPRISE_PAYMENT_LINK}>
                  <Button size="1" color="mint">Buy Enterprise</Button>
                </RadixLink>
                <Text size="1" color="gray" ml="1">10000 tokens for $499 / mo.</Text>
              </Box>}
              {userData.subscriptionPlan !== 'lifetime' && <Box>
                <RadixLink href={process.env.GATSBY_STRIPE_LIFETIME_PAYMENT_LINK}>
                  <Button size="1" color="amber">Buy Lifetime</Button>
                </RadixLink>
                <Text size="1" color="gray" ml="1">Lifetime usage for $2000</Text>
              </Box>}
            </Flex>

            <Separator size="1" my="2" />

            <Text size="1" color="gray">Payment Methods</Text>
            <Flex>
            <RadixLink href={process.env.GATSBY_STRIPE_CUSTOMER_PORTAL_LINK}>
              <Button size="1" variant="outline">
                Manage in Stripe
              </Button>
              </RadixLink>
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