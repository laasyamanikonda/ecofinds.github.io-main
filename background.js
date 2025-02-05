chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "extractData") {
        let { productName, price } = message.data;

        if (!productName) {
            console.error("No product name provided.");
            sendResponse({ error: "Product name is required." });
            return;
        }

        // Default price if missing
        if (!price) price = "a reasonable price range";

        fetchAlternatives(productName, price).then((alternatives) => {
            // Save results locally
            chrome.storage.local.set({ recommendations: alternatives }, () => {
                console.log("Alternatives saved.");
            });

            // Send response back
            chrome.runtime.sendMessage({ action: "showResults", results: alternatives });
            sendResponse({ success: true });
        }).catch((error) => {
            console.error("Error:", error);
            sendResponse({ error: "Failed to fetch alternatives." });
        });

        return true; // Required for async `sendResponse`
    }
});

async function fetchAlternatives(product, price) {
    try {
        let config = await fetch(chrome.runtime.getURL("config.json"));
        let configData = await config.json();
        let apiKey = configData.OPENAI_API_KEY;

        let response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{ role: "user", content: `Find sustainable and minority-owned alternatives for "${product}" under ${price}.` }]
            })
        });

        let data = await response.json();

        // Check if response is valid
        if (!data.choices || data.choices.length === 0) {
            console.error("Invalid API response:", data);
            return "No valid alternatives found.";
        }

        return data.choices[0].message.content;
    } catch (error) {
        console.error("Error fetching alternatives:", error);
        return "Error finding alternatives. Try again!";
    }
}
