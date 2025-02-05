chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === "extractData") {
        let product = message.data.productName;
        let price = message.data.price;

        if (!product) return;

        // Query OpenAI for sustainable alternatives
        let response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer YOUR_OPENAI_API_KEY`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{ role: "system", content: `Find sustainable and minority-owned alternatives for "${product}" under price ${price}` }]
            })
        });

        let data = await response.json();
        chrome.runtime.sendMessage({ action: "showResults", results: data.choices[0].message.content });
    }
});
