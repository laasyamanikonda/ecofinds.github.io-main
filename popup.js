document.addEventListener("DOMContentLoaded", function () {
    chrome.storage.local.get("recommendations", (data) => {
        let resultsContainer = document.getElementById("results");
        resultsContainer.innerText = data.recommendations || "No recommendations found.";
    });
});
