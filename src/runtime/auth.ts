import { useAuth, useClerk } from "@clerk/clerk-react";
import { IS_DESKTOP } from "./environment";

// The desktop app has no ClerkProvider, so Clerk's hooks must never run there.
// Each hook is picked once per build, which keeps the order of hook calls fixed.

const noToken = async (): Promise<string | null> => null;

/** Returns a function that resolves to the signed-in user's token (always null on desktop). */
export const useAuthToken: () => () => Promise<string | null> = IS_DESKTOP
  ? () => noToken
  : function useClerkToken() {
      return useAuth().getToken;
    };

/** True once auth has settled, so pages that wait for Clerk can render. Desktop never waits. */
export const useAuthReady: () => boolean = IS_DESKTOP
  ? () => true
  : function useClerkLoaded() {
      return useClerk().loaded;
    };
