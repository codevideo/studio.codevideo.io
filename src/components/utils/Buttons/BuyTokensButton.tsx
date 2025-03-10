import * as React from 'react';
import { Button, Link } from '@radix-ui/themes';
import mixpanel from 'mixpanel-browser';

export function BuyTokensButton() {
    const onClickBuyTokens = () => {
        mixpanel.track('Clicked Buy Tokens Studio');
    }

    return (
        <Link href={process.env.GATSBY_STRIPE_TOPUP_PAYMENT_LINK} target='_blank'>
            <Button style={{ cursor: 'pointer' }}
                onClick={onClickBuyTokens} size="1" color="amber" ml="1">
                Buy Tokens
            </Button>
        </Link>
    );
}
