import { ExportType } from "@fullstackcraftllc/codevideo-types";

export const decrementTokens = async (clerkUserToken: string, exportType: ExportType) => {
    try {
        const response = await fetch("/.netlify/functions/decrementTokens", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ clerkUserToken, exportType }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error decrementing tokens:", error);
    }
};