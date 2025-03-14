import * as React from 'react';
import { Badge, Text } from '@radix-ui/themes';
import { useEffect, useState } from 'react';
import { resolveTokensColor } from '../../utils/resolveTokensColor';
import { useUser } from '@clerk/clerk-react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { BuyTokensButton } from './Buttons/BuyTokensButton';
import { Link } from 'gatsby';
import { setIsSidebarOpen } from '../../store/editorSlice';
import { useAppDispatch } from '../../hooks/useAppDispatch';

export function TokenCountBadge() {
    const { tokenRefresh } = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();
    const { user } = useUser();
    const [tokens, setTokens] = useState(user?.publicMetadata.tokens as any || 0);
    const tokensColor = resolveTokensColor(tokens);

    // on mount once user exists, also refresh the token count
    useEffect(() => {
        if (user) {
            user.reload();
        }
    }, [user]);

    // whenever tokenRefresh or user changes, we need to update the color of the badge
    useEffect(() => {
        user?.reload()
    }, [tokenRefresh]);

    useEffect(() => {
        setTokens(user?.publicMetadata.tokens as any || 0);
    }, [user]);

    // also at interval of 5 seconds, refresh the token count
    useEffect(() => {
        const interval = setInterval(() => {
            user?.reload();
        }, 5000);

        return () => clearInterval(interval);
    }, [user]);

    const onClickTokenCountBadge = () => {
        dispatch(setIsSidebarOpen(false));
    }
    
    return (
        <>
            <Link to="/account" onClick={onClickTokenCountBadge}>
                <Badge size="2" color="amber">
                    <Text size="1" color="amber">Tokens:
                        <Text ml="1" weight="bold" color={tokensColor}>{tokens}</Text>
                    </Text>
                </Badge>
            </Link>
            {tokens === 0 && (
                <BuyTokensButton />
            )}
        </>
    );
}
