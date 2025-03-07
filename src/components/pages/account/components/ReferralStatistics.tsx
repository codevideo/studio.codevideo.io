// src/components/ReferralStats.jsx
import React, { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import {
    Text,
    Flex,
    Box,
    Button,
    Badge,
    TextField,
    Grid,
    Tooltip,
    Card
} from '@radix-ui/themes';
import {
    CopyIcon,
    CheckIcon,
    Share1Icon,
    PlusCircledIcon,
    InfoCircledIcon
} from '@radix-ui/react-icons';
import { TokensButton } from '../../../utils/Buttons/TokensButton';

export const ReferralStats = () => {
    const { user, isLoaded, isSignedIn } = useUser();
    const [stats, setStats] = useState({
        totalReferrals: 0,
        totalEarned: 0,
        referralId: ''
    });
    const [loading, setLoading] = useState(true);
    const [referralLink, setReferralLink] = useState('');
    const [copied, setCopied] = useState(false);
    const { getToken } = useAuth()

    useEffect(() => {
        const fetchStats = async () => {
            if (isLoaded && isSignedIn) {
                try {
                    const token = await getToken()
                    // Fetch referral stats
                    const response = await fetch(`${process.env.GATSBY_API_URL}/api/referral-stats`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    const data = await response.json();

                    if (response.ok) {
                        setStats(data);

                        // Generate referral link if there's a referral ID
                        if (data.referralId) {
                            setReferralLink(`${window.location.origin}/signup?referral=${data.referralId}`);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching referral stats:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchStats();
    }, [isLoaded, isSignedIn, user]);

    // Handle copying referral link
    const copyReferralLink = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);

        // Reset copied status after 3 seconds
        setTimeout(() => {
            setCopied(false);
        }, 3000);
    };

    // Handle sharing referral link
    const shareReferralLink = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Join me and get 10 free tokens!',
                text: 'Use my referral link to sign up and we both get 10 free tokens!',
                url: referralLink
            }).catch((error) => {
                console.error('Error sharing:', error);
            });
        } else {
            copyReferralLink();
        }
    };

    if (loading) {
        return (
            <Flex justify="center" align="center" py="4">
                <Text size="2" color="gray">Loading referral data...</Text>
            </Flex>
        );
    }

    if (!stats || !stats.referralId) {
        return (
            <Flex direction="column" align="center" gap="3" py="4">
                <InfoCircledIcon width="24" height="24" color="var(--gray-8)" />
                <Text size="2" color="gray" align="center">
                    Generating your referral link...
                </Text>
                <TokensButton />
            </Flex>
        );
    }

    return (
        <Flex direction="column" gap="4">
            <Grid columns="2" gap="3">
                <Card size="1" variant="surface">
                    <Flex direction="column" align="center" justify="center" gap="1" py="2">
                        <Text size="6" weight="bold">{stats.totalReferrals}</Text>
                        <Text size="1" color="gray">People Invited</Text>
                    </Flex>
                </Card>

                <Card size="1" variant="surface">
                    <Flex direction="column" align="center" justify="center" gap="1" py="2">
                        <Text size="6" weight="bold">{stats.totalEarned}</Text>
                        <Text size="1" color="gray">Tokens Earned</Text>
                    </Flex>
                </Card>
            </Grid>

            <Box>
                <Flex align="center" justify="between" mb="1">
                    <Text size="2" weight="medium">Your Referral Link</Text>
                    <Badge size="1" color="orange" variant="soft">
                        50 tokens per referral
                    </Badge>
                </Flex>

                <Flex gap="2" mb="2">
                    <TextField.Root style={{ flexGrow: 1 }}
                        value={referralLink}
                        readOnly
                        placeholder="Your referral link"
                        size="2"
                    />


                    <Tooltip content={copied ? "Copied!" : "Copy link"}>
                        <Button
                            size="2"
                            variant="soft"
                            color={copied ? "green" : "gray"}
                            onClick={copyReferralLink}
                        >
                            {copied ? <CheckIcon /> : <CopyIcon />}
                        </Button>
                    </Tooltip>

                    <Tooltip content="Share link">
                        <Button
                            size="2"
                            variant="soft"
                            color="blue"
                            onClick={shareReferralLink}
                        >
                            <Share1Icon />
                        </Button>
                    </Tooltip>
                </Flex>

                <Text size="1" color="gray">
                    Friends get 50 tokens on sign-up, and you get 50 tokens for each friend who joins.
                </Text>
            </Box>
            <Button
                size="2"
                variant="outline"
                color="orange"
                onClick={shareReferralLink}
                style={{ width: '100%' }}
            >
                <PlusCircledIcon />
                Invite Friends
            </Button>
        </Flex>
    );
};