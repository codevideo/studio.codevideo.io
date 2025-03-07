import * as React from 'react';
import { Link } from 'gatsby';
import {
    Box,
    Flex,
    Button,
    IconButton,
    Text,
    Card,
    Link as RadixLink
} from '@radix-ui/themes';
import { HamburgerMenuIcon, PersonIcon } from '@radix-ui/react-icons';
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

export function Header() {
    const dispatch = useAppDispatch();
    const isDesktop = useIsDesktop();

    return (
        <Box position="fixed" left="0" right="0" style={{ zIndex: 10000, backdropFilter: 'blur(8px)' }} className="z-40" mx="3">
            <Card>
                <Flex align="center" justify="between">
                    <Flex direction="row" gap="3"> {/* Fixed width container for left side */}
                        <IconButton
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
                        <Link to="/faq">
                            <Button size="1" color="mint">
                                FAQs
                            </Button>
                        </Link>
                        <RadixLink href="https://codevideo.substack.com/" target="_blank">
                            <Button size="1" color="mint">
                                Blog
                            </Button>
                        </RadixLink>
                    </Flex>

                    <Flex justify="end" align="center" gap="2"> {/* Fixed width container for right side */}
                        <TokensButton style={{ display: isDesktop ? 'inline-block' : 'none' }} />
                        <TutorialButton style={{ display: isDesktop ? 'inline-block' : 'none' }} />
                        <WhitepaperButton style={{ display: isDesktop ? 'inline-block' : 'none' }} />
                        <a
                            href="https://github.com/orgs/codevideo/repositories"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Button
                                style={{ cursor: 'pointer', display: isDesktop ? 'inline-block' : 'none' }}
                                size="1"
                                variant="soft"
                                color="mint"
                            >
                                GitHub
                            </Button>
                        </a>

                        <SignedOut>
                            <Button
                                size="1"
                                variant="soft"
                                color="mint"
                            >
                                <SignInButton />
                            </Button>
                        </SignedOut>

                        <SignedIn>
                            <Link to="/account">
                                <TokenCountBadge />
                            </Link>
                            <Link to="/account">
                                <Button
                                    size="1"
                                    variant="soft"
                                    color="mint"
                                >
                                    <PersonIcon height="12" width="12" />
                                    Account
                                </Button>
                            </Link>
                        <TokensButton style={{ display: isDesktop ? 'inline-block' : 'none' }} />

                        </SignedIn>
                        <ThemeToggle />
                    </Flex>
                </Flex>
            </Card>
        </Box>
    );
}