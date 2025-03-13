import * as React from 'react';
import { PersonIcon } from '@radix-ui/react-icons';
import { Button } from '@radix-ui/themes';
import { Link } from 'gatsby';
import { useIsDesktop } from '../../../hooks/useIsDesktop';

export function AccountButton() {
    const isDesktop = useIsDesktop();
    return (
        <Link to="/account">
            <Button
                style={{ cursor: 'pointer', display: isDesktop ? 'inline-block' : 'none' }}
                size="1"
                variant="soft"
                color="mint"
            >
                <PersonIcon height="12" width="12" />
                Account
            </Button>
        </Link>
    );
}
