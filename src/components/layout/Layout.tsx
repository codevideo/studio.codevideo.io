import { useStudioBootstrap } from '../../hooks/useStudioBootstrap';
import * as React from 'react';
import { Header } from './Header';
import { PropsWithChildren } from 'react';
import { Modal } from './modal/Modal';
import { Flex, Theme } from '@radix-ui/themes';
import { SVGBackground } from './SVGBackground';
import { Footer } from './Footer';
import { useAppSelector } from '../../hooks/useAppSelector';
import { ToastContainer } from './toast/ToastContainer';
import { SidebarMenu } from './sidebar/SidebarMenu';
import { SignUpOverlay } from './auth/SignUpOverlay';
import { SignInOverlay } from './auth/SignInOverlay';

export interface ILayoutProps {
    withHeader?: boolean;
}

export function Layout(props: PropsWithChildren<ILayoutProps>) {
    const { children, withHeader } = props;
    const { theme } = useAppSelector(state => state.theme);
    const { isFullScreen } = useAppSelector((state) => state.editor);

    useStudioBootstrap();

    if (isFullScreen) {
        return (
            <Theme
                accentColor="mint"
                appearance={theme}
                panelBackground="translucent"
                radius="large"
            >
                <Flex direction="column" justify="center" align="center">
                    {children}
                    <Modal />
                    <ToastContainer />
                </Flex>
            </Theme>
        )
    }

    return (
        <Theme
            accentColor="mint"
            appearance={theme}
            panelBackground="translucent"
            radius="large"
        >
            <SVGBackground />
            <SidebarMenu />
            {withHeader && <Header />}
            <Flex direction="column" justify="between">
                {children}
                <Footer />
                <Modal />
                <SignUpOverlay />
                <SignInOverlay />
                <ToastContainer />
            </Flex>
        </Theme>
    );
}
