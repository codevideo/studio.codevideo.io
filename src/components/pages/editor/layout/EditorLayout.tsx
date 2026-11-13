import { PropsWithChildren } from "react";
import { Theme } from "@radix-ui/themes";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { useStudioBootstrap } from "../../../../hooks/useStudioBootstrap";
import { SidebarMenu } from "../../../layout/sidebar/SidebarMenu";
import { Modal } from "../../../layout/modal/Modal";
import { SignUpOverlay } from "../../../layout/auth/SignUpOverlay";
import { SignInOverlay } from "../../../layout/auth/SignInOverlay";
import { ToastContainer } from "../../../layout/toast/ToastContainer";
import { IS_DESKTOP } from "../../../../runtime/environment";
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
      {/* The web studio's project sidebar and sign-in need an account; desktop has neither. */}
      {!IS_DESKTOP && <SidebarMenu />}
      <Modal />
      {!IS_DESKTOP && <SignUpOverlay />}
      {!IS_DESKTOP && <SignInOverlay />}
      <ToastContainer />
    </Theme>
  );
}
