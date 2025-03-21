import * as React from 'react';
import { Header } from './Header';
import { PropsWithChildren, useEffect } from 'react';
import { Modal } from './modal/Modal';
import { Flex, Theme } from '@radix-ui/themes';
import { SVGBackground } from './SVGBackground';
import { Footer } from './Footer';
import { useAppSelector } from '../../hooks/useAppSelector';
import { ToastContainer } from './toast/ToastContainer';
import { SidebarMenu } from './sidebar/SidebarMenu';
import { SignUpOverlay } from './auth/SignUpOverlay';
import { SignInOverlay } from './auth/SignInOverlay';
import useUtmTracking from '../../hooks/useUtmTracking';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { loadProjectsFromLocalStorage } from '../../utils/persistence/loadProjectsFromLocalStorage';
import { setProjects } from '../../store/editorSlice';

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

    // bootstrap: get voices and load projects from local storage on mount 
    // (should be fine for all pages so we put it here in layout)
    useEffect(() => {
        getVoices();
        console.log('loading projects from local storage');
        const projects = loadProjectsFromLocalStorage();
        console.log('loaded projects:', projects);
        dispatch(setProjects(projects));
    }, []);

    // use utm tracking for mixpanel
    useUtmTracking();

    const dispatch = useAppDispatch();

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
