import { ExportType } from "@fullstackcraftllc/codevideo-types";

// throws when the charge fails, so the caller can say so instead of reporting a successful charge
export const decrementTokens = async (clerkUserToken: string, exportType: ExportType) => {
    const response = await fetch("/.netlify/functions/decrementTokens", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ clerkUserToken, exportType }),
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
};
