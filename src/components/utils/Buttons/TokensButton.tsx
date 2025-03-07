import React, { useState, useEffect } from 'react';
import { Button } from '@radix-ui/themes';
import { useUser, useClerk, useAuth } from '@clerk/clerk-react';
import {
    RocketIcon,
} from '@radix-ui/react-icons';
import { setIsSidebarOpen } from '../../../store/editorSlice';
import { useAppDispatch } from '../../../hooks/useAppDispatch';

export interface ITokensButtonProps {
    style?: React.CSSProperties;
}

export function TokensButton(props: ITokensButtonProps) {
    const { style } = props;
    const dispatch = useAppDispatch();
    const { isSignedIn, user } = useUser();
    const { openSignUp, openSignIn } = useClerk();
    const [showReferralModal, setShowReferralModal] = useState(false);
    const [referralLink, setReferralLink] = useState('');
    const [copied, setCopied] = useState(false);
    const [isGeneratingLink, setIsGeneratingLink] = useState(false);
    const { getToken } = useAuth()

    // Generate a referral link when the modal is opened
    useEffect(() => {
        if (showReferralModal && isSignedIn && user) {
            const generateReferralLink = async () => {
                try {
                    setIsGeneratingLink(true);
                    // Create or get existing invitation
                    if (!user.publicMetadata.referralId) {
                        const token = await getToken()

                        // Create a new invitation
                        const response = await fetch(`${process.env.GATSBY_API_URL}/api/create-invitation`, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        });

                        const data = await response.json();

                        if (response.ok) {
                            setReferralLink(data.invitationUrl);
                        }
                    } else {
                        // Use existing invitation
                        setReferralLink(`${window.location.origin}/signup?referral=${user.publicMetadata.referralId}`);
                    }
                } catch (error) {
                    console.error('Error generating referral link:', error);
                } finally {
                    setIsGeneratingLink(false);
                }
            };

            generateReferralLink();
        }
    }, [showReferralModal, isSignedIn, user]);

    const handleOnClickGetFreeTokens = () => {
        dispatch(setIsSidebarOpen(false));

        // Always sign up for now, will be a no op for new tokens if they already have an account
        openSignUp({
            redirectUrl: '/'
        });
    };

    // Handle copying referral link
    const copyReferralLink = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);

        // Reset copied status after 3 seconds
        setTimeout(() => {
            setCopied(false);
        }, 3000);
    };

    // If not signed in, show the "Get 50 Free Tokens" button
    if (!isSignedIn) {
        return (
            <Button
                style={{ cursor: 'pointer', ...style }}
                size="1"
                variant="solid"
                color="amber"
                onClick={handleOnClickGetFreeTokens}
            >
                <RocketIcon />
                Get 50 Free Tokens
            </Button>
        );
    }

    return <></>

    // // TODO: activate backend logic for this
    // // If signed in, show the referral button
    // return (
    //     <>
    //         <Button
    //             size="1"
    //             variant="solid"
    //             color="amber"
    //             onClick={() => setShowReferralModal(true)}
    //         >
    //             <PlusCircledIcon />
    //             Invite and Get 10 Free Tokens
    //         </Button>

    //         {/* Referral Modal */}
    //         <Dialog.Root open={showReferralModal} onOpenChange={setShowReferralModal}>

    //             <Dialog.Content size="3">
    //             <Dialog.Close style={{ position: 'absolute', top: 20, right: 20 }}>
    //                 <IconButton variant="ghost" color="gray" size="1">
    //                     <Cross2Icon />
    //                 </IconButton>
    //             </Dialog.Close>
    //                 <Dialog.Title>Invite Friends, Get Free Tokens</Dialog.Title>
    //                 <Dialog.Description size="2" mb="4">
    //                     Share this link with your friends. You'll both get 10 free tokens when they sign up!
    //                 </Dialog.Description>

    //                 {isGeneratingLink ? (
    //                     <Flex justify="center" align="center" py="4">
    //                         <Text size="2" color="gray">Generating your referral link...</Text>
    //                     </Flex>
    //                 ) : (
    //                     <Box mb="4">
    //                         <Text size="2" weight="medium" mb="1">
    //                             Your Referral Link
    //                         </Text>
    //                         <Flex gap="2">
    //                             <TextField.Root style={{ flexGrow: 1 }}

    //                                 value={referralLink}
    //                                 readOnly
    //                                 placeholder="Your referral link"
    //                             />


    //                             <Tooltip content={copied ? "Copied!" : "Copy link"}>
    //                                 <IconButton
    //                                     variant="soft"
    //                                     color={copied ? "green" : "gray"}
    //                                     onClick={copyReferralLink}
    //                                 >
    //                                     {copied ? <CheckIcon /> : <CopyIcon />}
    //                                 </IconButton>
    //                             </Tooltip>
    //                         </Flex>
    //                     </Box>
    //                 )}

    //                 <Flex gap="3" mt="4" justify="end">
    //                     <Dialog.Close>
    //                         <Button variant="soft" color="gray">
    //                             Close
    //                         </Button>
    //                     </Dialog.Close>

    //                     <Button
    //                         variant="solid"
    //                         color="blue"
    //                         onClick={() => {
    //                             // Open native share dialog if supported
    //                             if (navigator.share) {
    //                                 navigator.share({
    //                                     title: 'Join me and get 10 free tokens!',
    //                                     text: 'Use my referral link to sign up and we both get 10 free tokens!',
    //                                     url: referralLink
    //                                 });
    //                             } else {
    //                                 copyReferralLink();
    //                             }
    //                         }}
    //                     >
    //                         <Share1Icon />
    //                         Share Link
    //                     </Button>
    //                 </Flex>
    //             </Dialog.Content>
    //         </Dialog.Root>
    //     </>
    // );
}