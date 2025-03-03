import * as React from 'react';
import { Header } from './Header';
import { PropsWithChildren, useEffect } from 'react';
import { Modal } from './modal/Modal';
import { Flex, Theme } from '@radix-ui/themes';
import { SVGBackground } from './SVGBackground';
import { Footer } from './Footer';
import { useAppSelector } from '../../hooks/useAppSelector';
import { ToastContainer } from './toast/ToastContainer';

export interface ILayoutProps {
    withHeader?: boolean;
}

export function Layout(props: PropsWithChildren<ILayoutProps>) {
    const { children, withHeader } = props;
    const { theme } = useAppSelector(state => state.theme);
    const { isFullScreen } = useAppSelector((state) => state.editor);

    // for firefox to work with speech synthesis, need to load the voices 2x
    // see https://caniuse.com/?search=speechsynthesis
    const getVoices = () => {
        if (typeof window !== "undefined" && window.speechSynthesis) {
            window.speechSynthesis.getVoices();
        }
        setTimeout(() => {
            if (typeof window !== "undefined" && window.speechSynthesis) {
                window.speechSynthesis.getVoices();
            }
        }, 3000);
    }

    useEffect(() => {
        getVoices();
    }, []);

    if (isFullScreen) {
        return (
            <Theme
                accentColor="mint"
                appearance={theme}
                panelBackground="translucent"
                radius="large"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    height: '100vh',
                    width: '100vw',
                }}
            >
                <Flex gap="0" p="0" m="1" direction="column" justify="center" align="center">
                    {children}
                <Modal />
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
            {withHeader && <Header />}
            <Flex gap="0" p="0" direction="column" justify="between">
                {children}
                <Footer />
                <Modal />
                <ToastContainer />
            </Flex>
        </Theme>
    );
}
