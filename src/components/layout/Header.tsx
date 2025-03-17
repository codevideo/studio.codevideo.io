import * as React from 'react';
import { Link } from 'gatsby';
import {
    Box,
    Flex,
    Button,
    IconButton,
    Text,
    Card,
    Link as RadixLink,
    Badge
} from '@radix-ui/themes';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { toggleSidebar } from '../../store/editorSlice';
import { ThemeToggle } from './ThemeToggle';
import { TutorialButton } from '../utils/Buttons/TutorialButton';
import { TokensButton } from '../utils/Buttons/TokensButton';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { useIsDesktop } from '../../hooks/useIsDesktop';
import { WhitepaperButton } from '../utils/Buttons/WhitepaperButton';
import { TutorialCSSClassConstants } from './sidebar/StudioTutorial';
import { TokenCountBadge } from '../utils/TokenCountBadge';
import { AccountButton } from '../utils/Buttons/AccountButton';

export function Header() {
    const dispatch = useAppDispatch();
    const isDesktop = useIsDesktop();

    console.log('isDesktop', isDesktop);

    return (
        <Box position="fixed" left="0" right="0" style={{ zIndex: 10000, backdropFilter: 'blur(8px)' }} className="z-40" mx="3">
            <Card>
                <Flex direction="row" align="center" justify="between">
                    <Flex direction="row" align="center" gap="3">
                        <IconButton
                            style={{ cursor: 'pointer' }}
                            onClick={() => dispatch(toggleSidebar())}
                            size="1"
                            variant="solid"
                            color="mint"
                            aria-label="Toggle menu"
                        >
                            <HamburgerMenuIcon width="18" height="18" />
                        </IconButton>
                        <Box
                            className={TutorialCSSClassConstants.HEADER_SELECTOR}
                        >
                            <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>
                                <Flex align="center" gap="1">
                                    <Text color="mint" weight="bold">{'/>'}</Text>
                                    <Text color="mint" weight="bold">CodeVideo™ Studio</Text>
                                </Flex>
                            </Link>
                        </Box>
                        <Flex gap="3" style={{ display: isDesktop ? 'flex' : 'none' }}>
                            <TutorialButton />
                            <Link to="/faq">
                                <Button size="1" color="mint" style={{ cursor: 'pointer' }}>
                                    FAQs
                                </Button>
                            </Link>
                            <Link to="/contact">
                                <Button size="1" color="mint" style={{ cursor: 'pointer' }}>
                                    Contact
                                </Button>
                            </Link>
                            <RadixLink href="https://codevideo.substack.com/" target="_blank">
                                <Button size="1" color="mint" style={{ cursor: 'pointer' }}>
                                    Blog
                                </Button>
                            </RadixLink>
                        </Flex>
                    </Flex>

                    {/* tokens button is exception on mobile */}
                    {!isDesktop && (
                        <Flex justify="end" align="center" gap="2">
                            <TokensButton />
                        </Flex>
                    )}

                    {/* or, if signed in on mobile the account button*/}
                    {!isDesktop && (
                        <SignedIn>
                            <Flex justify="end" align="center" gap="2">
                                <AccountButton />
                            </Flex>
                        </SignedIn>
                    )}

                    {/* don't show any of this stuff in mobile */}
                    <Flex justify="end" align="center" gap="2" style={{ display: isDesktop ? 'flex' : 'none' }}>
                        <TokensButton />
                        <WhitepaperButton />
                        <a
                            href="https://github.com/orgs/codevideo/repositories"
                            target="_blank"
                            rel="noreferrer"
                            style={{ display: isDesktop ? 'inline-block' : 'none' }}
                        >
                            <Button
                                style={{ cursor: 'pointer' }}
                                size="1"
                                variant="soft"
                                color="mint"
                            >
                                GitHub
                            </Button>
                        </a>
                        <SignedOut>
                            <Badge
                                style={{ display: isDesktop ? 'inline-block' : 'none', cursor: 'pointer' }}
                                size="2"
                                variant="soft"
                                color="mint"
                            >
                                <SignInButton />
                            </Badge>
                        </SignedOut>
                        <SignedIn >
                            <Box >
                                <TokenCountBadge />
                            </Box>
                            <AccountButton />
                            <TokensButton />
                        </SignedIn>
                        <ThemeToggle />
                    </Flex>
                </Flex>
            </Card>
        </Box>
    );
}