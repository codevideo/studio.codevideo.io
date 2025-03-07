import React, { useEffect, useState } from 'react';
import { Box, Button, Text, Link as RadixLink, Flex } from '@radix-ui/themes';
import Confetti from 'react-confetti';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'gatsby';

interface IPaymentSuccessContentProps {
    tier: string; // e.g. "starter", "creator", "enterprise", "topup", "lifetime"
}

export const PaymentSuccessContent = (props: IPaymentSuccessContentProps) => {
    const { tier } = props;
    const { user, isLoaded } = useUser();
    const [loading, setLoading] = useState(true);
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined' || !isLoaded) return;

        // Parse the URL query parameters.
        const searchParams = new URLSearchParams(window.location.search);
        const stripeSessionId = searchParams.get('session_id');

        if (!stripeSessionId || !user) {
            setLoading(false);
            return;
        }

        // Build the payload.
        const payload = {
            clerkUserId: user.id,
            stripeSessionId,
            product: tier,
        };

        // Call the serverless function.
        fetch('/.netlify/functions/stripeSuccess', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
        })
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error('Payment verification failed');
                }
                return res.json();
            })
            .then(() => {
                setVerified(true);
            })
            .catch((error) => {
                console.error('Error verifying payment:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [isLoaded, user, tier]);

    const formatTierName = () => {
        switch (tier) {
            case 'starter':
                return 'Starter subscription';
            case 'creator':
                return 'Creator subscription';
            case 'enterprise':
                return 'Enterprise subscription';
            case 'topup':
                return 'new tokens';
            case 'lifetime':
                return 'CodeVideo Lifetime license';
            default:
                return 'custom plan';
        }
    }

    const formattedTier = formatTierName();

    return (
        <Box mt="9" style={{ textAlign: 'center', padding: '2rem', height: '80vh' }}>
            {loading && (
                <Text size="3" style={{ marginBottom: '1rem' }}>
                    Verifying your payment...
                </Text>
            )}
            {!loading && verified && (
                <>
                    <Text size="4" style={{ marginBottom: '1rem' }}>
                        {tier === 'starter' || tier === 'creator' || tier === 'enterprise' ? `Your ${formattedTier} is active!` : `Your ${formattedTier} have been applied to your account!`}
                    </Text>
                    <Confetti
                        numberOfPieces={500}
                        recycle={false}
                        colors={['mint', 'amber']} // Radix UI theme colors
                    />
                    <Link to="/studio">
                        <Button variant="solid" color="mint" size="3">
                            Start Creating
                        </Button>
                    </Link>
                </>
            )}
            {!loading && !verified && (
                <Flex direction="column" gap="6">
                    <Text size="3" color="red">
                        There was an error verifying your payment. Please contact us at <RadixLink color="mint" href="mailto:hi@fullstackraft.com" target='_blank' rel='noreferrer'>hi@fullstackcraft.com</RadixLink>.
                    </Text>
                    <Box>
                        <Link to="/account">
                            <Button variant="solid" color="mint" size="3">
                                Manage Account
                            </Button>
                        </Link>
                    </Box>
                    <Box>
                        <Link to="/studio">
                            <Button variant="solid" color="mint" size="3">
                                Return to Studio
                            </Button>
                        </Link>
                    </Box>
                </Flex>
            )}
        </Box>
    );
};
