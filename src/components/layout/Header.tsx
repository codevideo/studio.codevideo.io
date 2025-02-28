import * as React from 'react';
import { Link } from 'gatsby';
import {
    Box,
    Flex,
    Button,
    IconButton,
    Text,
    Container,
    Card
} from '@radix-ui/themes';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { toggleSidebar } from '../../store/editorSlice';
import { useAppSelector } from '../../hooks/useAppSelector';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
    const { currentProjectIndex } = useAppSelector(state => state.editor)
    // const { isUserLoggedIn } = useAppSelector(state => state.user)
    const dispatch = useAppDispatch();

    return (
        <Box position="fixed" left="0" right="0" style={{ zIndex: 10000, backdropFilter: 'blur(8px)' }} className="z-40" mx="3">
            <Card>
                <Flex align="center" justify="between">
                    <Box> {/* Fixed width container for left side */}
                        <IconButton
                            onClick={() => dispatch(toggleSidebar())}
                            size="2"
                            variant="solid"
                            color="mint"
                            aria-label="Toggle menu"
                        >
                            <HamburgerMenuIcon width="18" height="18" />
                        </IconButton>
                    </Box>
                    <Box
                        style={{
                            position: 'absolute',
                            left: '50%',
                            transform: 'translateX(-50%)'
                        }}
                    >
                        <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>
                            <Flex align="center" gap="2">
                                <Text color="mint" weight="bold">{'/>'}</Text>
                                <Text color="mint" weight="bold">CodeVideo™ Studio</Text>
                            </Flex>
                        </Link>
                    </Box>
                    <Flex justify="end" style={{ width: '300px' }} align="center"> {/* Fixed width container for right side */}
                        <Link
                            to="/pdf/CodeVideo_Framework_White_Paper.pdf"
                            style={{ textDecoration: 'none', marginRight: '0.75rem' }}
                        >
                            <Button
                                size="2"
                                variant="solid"
                                color="mint"
                            >
                                Read white paper
                            </Button>
                        </Link>
                        <a
                            href="https://github.com/orgs/codevideo/repositories"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Button
                                mr="2"
                                size="2"
                                variant="solid"
                                color="mint"
                            >
                                GitHub
                            </Button>
                        </a>
                        <ThemeToggle />
                    </Flex>
                    {/* {isUserLoggedIn ? (
                  <Link
                    to="/purchase-credits"
                    style={{ textDecoration: 'none' }}
                  >
                    <Button
                      size="2"
                      variant="solid"
                      color="mint"
                    >
                      Purchase Credits
                    </Button>
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    style={{ textDecoration: 'none' }}
                  >
                    <Button
                      size="2"
                      variant="solid"
                      color="mint"
                    >
                      Login
                    </Button>
                  </Link>
                )} */}
                </Flex>

            </Card>
        </Box>
    );
}