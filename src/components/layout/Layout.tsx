import * as React from 'react';
import { Header } from './Header';
import { PropsWithChildren } from 'react';

export interface ILayoutProps {
    withHeader?: boolean;
}

export function Layout(props: PropsWithChildren<ILayoutProps>) {
    const { children, withHeader } = props;
    return (
        <>
            {withHeader && <Header />}
            {children}
        </>
    );
}
