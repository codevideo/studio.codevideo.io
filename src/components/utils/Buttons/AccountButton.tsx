import * as React from 'react';
import { PersonIcon } from '@radix-ui/react-icons';
import { Button } from '@radix-ui/themes';
import Link from 'next/link';
import { useIsDesktop } from '../../../hooks/useIsDesktop';

export function AccountButton() {
    return (
        <Link href="/account">
            <Button
                style={{ cursor: 'pointer' }}
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
