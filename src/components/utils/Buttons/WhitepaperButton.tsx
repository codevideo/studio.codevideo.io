import { Button } from '@radix-ui/themes';
import { Link } from 'gatsby';
import * as React from 'react';

export interface IWhitepaperButtonProps {
    style?: React.CSSProperties;
}

export function WhitepaperButton(props: IWhitepaperButtonProps) {
    const { style } = props;
    return (
        <Link
            to="/pdf/CodeVideo_Framework_White_Paper.pdf"
        >
            <Button
                style={{ cursor: 'pointer', ...style }}
                size="1"
                variant="soft"
                color="mint"
            >
                Read white paper
            </Button>
        </Link>
    );
}
