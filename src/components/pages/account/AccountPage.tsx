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
import mixpanel from 'mixpanel-browser';
import { BuyTokensButton } from '../../utils/Buttons/BuyTokensButton';
import { ICodeVideoUserMetadata } from '@fullstackcraftllc/codevideo-types';

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

const fallbackValues: ICodeVideoUserMetadata = {
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
  const getUserData = (): ICodeVideoUserMetadata => {
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

  const onClickSupportOrFeature = () => {
    mixpanel.track('Clicked Support or Feature Request Studio');
  }

  const handleOnClickBuy = (plan: string) => {
    mixpanel.track('Clicked Buy Plan on Account Page Studio', { plan });
  }

  const onClickManageInStripe = () => {
    mixpanel.track('Clicked Manage in Stripe Studio');
  }

  const onClickLogout = () => {
    mixpanel.track('Clicked Logout Studio');
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

  const htmlsLeft = Math.floor(userData.tokens / TokenCosts['html'])
  const pdfsLeft = Math.floor(userData.tokens / TokenCosts['pdf'])
  const tsxsLeft = Math.floor(userData.tokens / TokenCosts['tsx'])
  const jsxsLeft = Math.floor(userData.tokens / TokenCosts['jsx'])
  const advancedMarkdownsLeft = Math.floor(userData.tokens / TokenCosts['complex-markdown'])
  const videoGenerationsLeft = Math.floor(userData.tokens / TokenCosts['mp4'])
  const pptxsLeft = Math.floor(userData.tokens / TokenCosts['pptx'])

  const videosPer10 = Math.floor(10 / TokenCosts['mp4'])
  const pptxPer10 = Math.floor(10 / TokenCosts['pptx'])
  const pdfPer10 = Math.floor(10 / TokenCosts['pdf'])
  const tsxPer10 = Math.floor(10 / TokenCosts['tsx'])
  const jsxPer10 = Math.floor(10 / TokenCosts['jsx'])
  const htmlPer10 = Math.floor(10 / TokenCosts['html'])
  const advancedMarkdownPer10 = Math.floor(10 / TokenCosts['complex-markdown'])

  // console.log('userData', userData);

  return (
    <Box mt="4" p="1" pt="9">
      <SignedIn>
        <Card size="1" mb="3">
          <Flex direction="column" gap="2">
            <Text size="1" color="gray">Your Account</Text>
            {user && (
              <Flex align="center" gap="2">
                <UserButton />
                <Text weight="bold" size="1">{user.primaryEmailAddress?.emailAddress}</Text>
              </Flex>
            )}
          </Flex>
        </Card>
        
        <Card size="1" mb="3">
          <Flex direction="column" gap="2">
            <Text size="1" color="gray">Available tokens</Text>
            <Flex align="center" gap="1" mx="1">
              <TokenCountBadge />
            </Flex>
            <Text size="1" color="gray">~{advancedMarkdownsLeft} Advanced markdown generations</Text>
            <Text size="1" color="gray">~{htmlsLeft} HTML generations</Text>
            <Text size="1" color="gray">~{pdfsLeft} PDF generations</Text>
            <Text size="1" color="gray">~{tsxsLeft} Interactive React TypeScript (TSX) page generations</Text>
            <Text size="1" color="gray">~{jsxsLeft} Interactive React (JSX) page generations</Text>
            <Text size="1" color="gray">~{pptxsLeft} Powerpoint generations</Text>
            <Text size="1" color="gray">~{videoGenerationsLeft} Video generations</Text>
          </Flex>
        </Card>
        <Card size="1" mb="3">
          <Flex direction="column" gap="2">
            <Text size="1" color="gray">Add more tokens</Text>
            <Text size="1" color="gray">10 tokens per $2</Text>
            <Flex direction="column" gap="1">
              <Box>
                <BuyTokensButton />
              </Box>
              {/* Info icon with tooltip for generations per token */}
              <Flex>
                <Tooltip content={<>
                  10 tokens can be used for the following exports:<br />
                  <br />
                  {advancedMarkdownPer10} Advanced Markdown<br />
                  {htmlPer10} HTML<br />
                  {pdfPer10} PDF<br />
                  {tsxPer10} TSX (React TypeScript)<br />
                  {jsxPer10} JSX (React)<br />
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
          </Flex>
        </Card>

        <Card size="1" mb="3">
          <Flex direction="column" gap="2">
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
                  </Button>
                </RadixLink>}
            </Flex>
          </Flex>
        </Card>

        <Card size="1" mb="3">
          <Flex direction="column" gap="2">
            <Text size="1" color="gray">Change Plan</Text>
            <Flex direction="column" gap="1">
              {userData.subscriptionPlan !== 'starter' && <Box>
                <RadixLink href={process.env.GATSBY_STRIPE_STARTER_PAYMENT_LINK} target="_blank">
                  <Button size="1" onClick={() => handleOnClickBuy("Starter")} color="mint">Buy Starter</Button>
                </RadixLink>
                <Text size="1" color="gray" ml="1">50 tokens for $10 / mo.</Text>
              </Box>}
              {userData.subscriptionPlan !== 'creator' && <Box>
                <RadixLink href={process.env.GATSBY_STRIPE_CREATOR_PAYMENT_LINK} target="_blank">
                  <Button size="1" onClick={() => handleOnClickBuy("Creator")} color="mint">Buy Creator</Button>
                </RadixLink>
                <Text size="1" color="gray" ml="1">500 tokens for $49 / mo.</Text>
              </Box>}
              {userData.subscriptionPlan !== 'enterprise' && <Box>
                <RadixLink href={process.env.GATSBY_STRIPE_ENTERPRISE_PAYMENT_LINK} target="_blank">
                  <Button size="1" onClick={() => handleOnClickBuy("Enterprise")} color="mint">Buy Enterprise</Button>
                </RadixLink>
                <Text size="1" color="gray" ml="1">10000 tokens for $499 / mo.</Text>
              </Box>}
              {userData.subscriptionPlan !== 'lifetime' && <Box>
                <RadixLink href={process.env.GATSBY_STRIPE_LIFETIME_PAYMENT_LINK} target="_blank">
                  <Button size="1" onClick={() => handleOnClickBuy("Lifetime")} color="amber">Buy Lifetime</Button>
                </RadixLink>
                <Text size="1" color="gray" ml="1">Lifetime usage for $2000</Text>
              </Box>}
            </Flex>
          </Flex>
        </Card>

        <Card size="1" mb="3">
          <Flex direction="column" gap="2">
            <Text size="1" color="gray">Contact</Text>
            <Flex direction="column" gap="1">
              <Box>
                <Link to="/contact">
                  <Button size="1" color="mint" ml="1" onClick={onClickSupportOrFeature}>Request Support or Feature</Button>
                </Link>
              </Box>
            </Flex>
          </Flex>
        </Card>

        <Card size="1" mb="3">
          <Flex direction="column" gap="2">
            <Text size="1" color="gray">Payment Methods</Text>
            <Flex>
              <RadixLink href={process.env.GATSBY_STRIPE_CUSTOMER_PORTAL_LINK} target="_blank">
                <Button size="1" variant="outline" onClick={onClickManageInStripe}>
                  Manage in Stripe
                </Button>
              </RadixLink>
            </Flex>
          </Flex>
        </Card>

        <Card size="1" mb="3">
          <Flex direction="column" gap="2">
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