import React, { useEffect, useState } from 'react';
import { Box, Button, Text, Link as RadixLink, Flex, Card } from '@radix-ui/themes';
import Confetti from 'react-confetti';
import { Link } from 'gatsby';
import { setShowSignInOverlay, signalTokenRefresh } from '../../../store/authSlice';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import mixpanel from 'mixpanel-browser';

interface IPaymentSuccessContentProps {
    tier: string; // e.g. "starter", "creator", "enterprise", "topup", "lifetime"
}

export const PaymentSuccessContent = (props: IPaymentSuccessContentProps) => {
    const { tier } = props;
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);
    const [verified, setVerified] = useState(false);
    const [email, setEmail] = useState<string | null>(null);
    const [tempPassword, setTempPassword] = useState<string | null>(null);
    const [passwordCopied, setPasswordCopied] = useState(false);

    const verifyPayment = async (stripeSessionId: string, product: string) => {
        try {
            // Build the payload.
            const payload = {
                stripeSessionId,
                product,
            };

            // Call the serverless function.
            const res = await fetch('/.netlify/functions/stripeSuccess', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                mixpanel.track('Payment Verification Error Studio', { tier, status: res.status, statusText: res.statusText });
                // Get the error response text to help with debugging
                const errorText = await res.text();
                console.error('Payment verification error response:', errorText);
                throw new Error(`Payment verification failed: ${res.status} ${res.statusText}`);
            }

            mixpanel.track('Payment Verified Studio', { tier });
            const data = await res.json();
            setVerified(true);
            if (data.email) {
                setEmail(data.email);
            }
            if (data.tempPassword) {
                setTempPassword(data.tempPassword);
            }
            return data;
        } catch (error) {
            console.error('Error verifying payment:', error);
            throw error;
        }
    };

    // on mount with tier, verify the payment
    useEffect(() => {
        if (typeof window === 'undefined') return;
        mixpanel.track('Payment Success Page Viewed', { tier });

        // Parse the URL query parameters.
        const searchParams = new URLSearchParams(window.location.search);
        const stripeSessionId = searchParams.get('session_id');

        if (!stripeSessionId) {
            setLoading(false);
            return;
        }

        const handlePaymentVerification = async () => {
            try {
                await verifyPayment(stripeSessionId, tier);
                dispatch(signalTokenRefresh());
            } catch (error) {
                // Error is already logged in verifyPayment
            } finally {
                setLoading(false);
            }
        };

        handlePaymentVerification();
    }, [tier]);

    const formatTierName = () => {
        switch (tier) {
            case 'starter':
                return 'Starter subscription';
            case 'creator':
                return 'Creator subscription';
            case 'enterprise':
                return 'Enterprise subscription';
            case 'topup':
                return 'token top up';
            case 'lifetime':
                return 'CodeVideo Lifetime License';
            default:
                return 'custom plan';
        }
    };

    const onClickCopyPassword = () => {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(tempPassword || '');
            setPasswordCopied(true);
        }
    };

    const onClickSetNewPassword = () => {
        dispatch(setShowSignInOverlay(true));
    }

    const formattedTier = formatTierName();

    const copyPasswordButtonText = passwordCopied ? 'Copied!' : 'Copy Password';

    return (
        <Box mt="9" style={{ textAlign: 'center', height: '80vh' }}>
            {loading && (
                <Text size="3" style={{ marginBottom: '1rem' }}>
                    Verifying your payment...
                </Text>
            )}
            {!loading && verified && (
                <>
                    {tempPassword ? (
                        <Card>
                            <Flex direction="column" align="center" justify="center" gap="6">
                                <Text size="4" style={{ marginBottom: '1rem' }}>
                                    Your <Text color="mint" weight="bold">{formattedTier}</Text> for email {email} has been successfully confirmed!
                                </Text>
                                <Text size="3" color="red" style={{ marginBottom: '1rem' }}>
                                    Your temporary password is: <strong>{tempPassword}</strong>
                                </Text>
                                <Button onClick={onClickCopyPassword} variant="solid" color="mint" size="3">
                                    {copyPasswordButtonText}
                                </Button>
                                <Text size="3" style={{ marginBottom: '1rem' }}>
                                    Copy this password and set a new one after signing in for your security.
                                </Text>
                                <Button onClick={onClickSetNewPassword} style={{ display: passwordCopied ? 'block' : 'none' }} variant="solid" color="mint" size="3">
                                    Sign In
                                </Button>
                            </Flex>
                        </Card>
                    ) : (
                        <Text size="4" style={{ marginBottom: '1rem' }}>
                            {tier === 'starter' || tier === 'creator' || tier === 'enterprise'
                                ? `Your ${formattedTier} is active!`
                                : `Your ${formattedTier} has been applied to your account!`}
                        </Text>
                    )}
                    <Confetti
                        numberOfPieces={500}
                        recycle={false}
                        colors={['#86EAD4', '#FFC53D']} // Radix UI theme colors mint-9 & amber-9
                    />
                    <Flex direction="column" align="center" justify="center" gap="6">
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <Button variant="solid" style={{ display: tempPassword ? 'none' : 'block' }} size="3">
                                Start Creating
                            </Button>
                        </Link>
                    </Flex>
                </>
            )}
            {!loading && !verified && (
                <Flex direction="column" gap="6">
                    <Text size="3" color="red">
                        There was an error verifying your payment. Please contact us at{' '}
                        <RadixLink color="mint" href="mailto:hi@fullstackcraft.com" target='_blank' rel='noreferrer'>
                            hi@fullstackcraft.com
                        </RadixLink>.
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
