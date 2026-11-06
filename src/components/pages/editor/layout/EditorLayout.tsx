import { PropsWithChildren } from "react";
import { Theme } from "@radix-ui/themes";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { useStudioBootstrap } from "../../../../hooks/useStudioBootstrap";
import { SidebarMenu } from "../../../layout/sidebar/SidebarMenu";
import { Modal } from "../../../layout/modal/Modal";
import { SignUpOverlay } from "../../../layout/auth/SignUpOverlay";
import { SignInOverlay } from "../../../layout/auth/SignInOverlay";
import { ToastContainer } from "../../../layout/toast/ToastContainer";
export function EditorLayout({ children }: PropsWithChildren) {
  const { theme } = useAppSelector((s) => s.theme);
  useStudioBootstrap();
  return (
    <Theme
      accentColor="mint"
      appearance={theme}
      panelBackground="translucent"
      radius="large"
    >
      <div className="cv-editor-shell">{children}</div>
      <SidebarMenu />
      <Modal />
      <SignUpOverlay />
      <SignInOverlay />
      <ToastContainer />
    </Theme>
  );
}
