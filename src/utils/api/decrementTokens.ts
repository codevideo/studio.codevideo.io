import { AppDispatch } from "../../store";
import { signalTokenRefresh } from "../../store/authSlice";
import { addToast } from "../../store/toastSlice";

export const decrementTokens = async (clerkUserToken: string, decrementAmount: number, dispatch: AppDispatch) => {
    try {
        const response = await fetch("/.netlify/functions/decrementTokens", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ clerkUserToken, decrementAmount }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        // const data = await response.json();
        dispatch(signalTokenRefresh())
        dispatch(addToast('Your export has completed successfully and your token balance updated accordingly.'));
    } catch (error) {
        console.error("Error decrementing tokens:", error);
    }
};