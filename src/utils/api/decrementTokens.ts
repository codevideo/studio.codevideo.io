export const decrementTokens = async (userToken: string, decrementAmount: number) => {

    try {
        const response = await fetch("/.netlify/functions/decrementTokens", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Assuming your Go function uses "Bearer <userID>" in the Authorization header:
                "Authorization": `Bearer ${userToken}`,
            },
            body: JSON.stringify({ tokens: decrementAmount }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("New token balance:", data.newTokens);
        // You can update your UI with the new token count here.
    } catch (error) {
        console.error("Error decrementing tokens:", error);
    }
};