import * as React from 'react'
import { Link } from 'gatsby'
import { Container, Heading, Text, Grid, Box, Flex, Button } from '@radix-ui/themes'
import { setShowSignUpOverlay } from '../../../store/authSlice'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { SignedOut } from '@clerk/clerk-react'

export interface IFAQsProps {
    isMainPage: boolean
}

export function FAQs(props: IFAQsProps) {
    const { isMainPage } = props
    const dispatch = useAppDispatch()

    return (
        <Container size="3" py="9">
            {isMainPage ? (
                <Heading size="8" align="center" mb="5">
                    FAQs
                </Heading>
            ) : (
                <Heading size="7" mb="5">
                    FAQs
                </Heading>
            )}

            <Text align="center" size="5" mb="9">
                Everything you need to know about our subscription plans at CodeVideo. Can't find the answer you're looking for?{' '}
                <Link to="/contact"><Button size="1" mt="1">Please contact us</Button></Link>.
            </Text>

            <Grid columns={{ initial: '1', md: '3' }} gap="6" mt="9">
                <SignedOut>
                    <Box>
                        <Heading size="4" mb="3">
                            Is there a free trial available?
                        </Heading>
                        <Text size="3" mb="4">
                            Yes! We offer 50 free tokens when you sign up to try out CodeVideo.{' '}
                            <Flex direction="column" gap="2" mt="3">
                                <Box>
                                    <Button size="1" onClick={() => dispatch(setShowSignUpOverlay(true))} variant="solid">
                                        Sign Up Free
                                    </Button>
                                </Box>
                                <Box>
                                    <Button size="1" asChild variant="solid" >
                                        <a href={process.env.GATSBY_STRIPE_STARTER_MONTHLY_LINK}>
                                            Get Starter Plan ($10/month)
                                        </a>
                                    </Button>
                                </Box>
                            </Flex>
                        </Text>
                    </Box>
                </SignedOut>
                <Box>
                    <Heading size="4" mb="3">
                        Can I change my plan?
                    </Heading>
                    <Text size="3">
                        Yes! Our plans can scale with you as you get more comfortable with CodeVideo and your content creation needs change.
                        At any time, you can upgrade or downgrade and we'll just prorate the difference.
                    </Text>
                </Box>

                <Box>
                    <Heading size="4" mb="3">
                        What is the cancellation policy?
                    </Heading>
                    <Text size="3">
                        You can cancel at any time. Your subscription will remain active until the end of your current billing period.
                        Manage your subscription from your{' '}
                        <Link to="/account"><Button size="1" mt="1">account page</Button></Link>.
                    </Text>
                </Box>

                <Box>
                    <Heading size="4" mb="3">
                        What is your refund policy?
                    </Heading>
                    <Text size="3">
                        If you cancel, your subscription will remain active for the remainder of your paid billing period.
                        In extraordinary cases, a CodeVideo Lifetime License can be refunded, but typically these are considered as long term supporters and users of the CodeVideo framework.
                    </Text>
                </Box>

                <Box>
                    <Heading size="4" mb="3">
                        Do I need to download anything?
                    </Heading>
                    <Text size="3">
                        No, CodeVideo is a web-based platform that runs completely in your browser which means you never
                        have to download any local desktop software.
                    </Text>
                </Box>

                <Box>
                    <Heading size="4" mb="3">
                        What are tokens and how do they work?
                    </Heading>
                    <Text size="3">
                        Tokens are our currency for creating exports. Each token allows you to create professional educational
                        content. Our plans provide different token amounts:
                        <Flex direction="column" gap="1" mt="3">
                            <Text>• Starter: $10/month for 50 tokens</Text>
                            <Text>• Creator: $49/month for 500 tokens</Text>
                            <Text>• Enterprise: $499/month for 10,000 tokens</Text>
                            <Text>• Pay-as-you-go: $2 for 10 tokens</Text>
                            <Text>• Lifetime: $2,000 one-time payment</Text>
                        </Flex>
                    </Text>
                </Box>

                <Box>
                    <Heading size="4" mb="3">
                        How long do tokens last?
                    </Heading>
                    <Text size="3">
                        Tokens never expire: tokens from monthly subscriptions roll over at the end of each billing cycle. Even when you already have a subscription, you can always purchase additional tokens if you are running low.
                    </Text>
                </Box>

                <Box>
                    <Heading size="4" mb="3">
                        Can I share tokens with my team?
                    </Heading>
                    <Text size="3">
                        Yes! The enterprise plan is designed for team collaboration and sharing your account tokens with
                        team members. Get in touch with us if you're looking for custom team solutions, integrations, or connectors.
                    </Text>
                </Box>

                <Box>
                    <Heading size="4" mb="3">
                        How do I get started?
                    </Heading>
                    <Text size="3" mb="3">
                        Getting started is easy! Simply sign up for an account, get your free tokens, and start creating
                        professional educational videos in minutes. Upgrade to other plans or top up at anytime.
                    </Text>
                    <Button size="1" ml="1" onClick={() => dispatch(setShowSignUpOverlay(true))} variant="solid" >
                        Sign Up Now
                    </Button>
                </Box>
            </Grid>
        </Container>
    )
}