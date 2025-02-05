chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "showResults") {
        document.getElementById("results").innerText = message.results;
    }
});
