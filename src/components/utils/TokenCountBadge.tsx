import * as React from 'react';
import { Badge, Text } from '@radix-ui/themes';
import { useEffect, useState } from 'react';
import { resolveTokensColor } from '../../utils/resolveTokensColor';
import { useUser } from '@clerk/clerk-react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { BuyTokensButton } from './Buttons/BuyTokensButton';
import { Link } from 'gatsby';

export function TokenCountBadge() {
    const { tokenRefresh } = useAppSelector(state => state.auth);
    const { user } = useUser();
    const [tokens, setTokens] = useState(user?.publicMetadata.tokens as any || 0);
    const tokensColor = resolveTokensColor(tokens);

    // whenever tokenRefresh or user changes, we need to update the color of the badge
    useEffect(() => {
        user?.reload()
    }, [tokenRefresh]);

    useEffect(() => {
        setTokens(user?.publicMetadata.tokens as any || 0);
    }, [user]);

    return (
        <>
            <Link to="/account">
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
