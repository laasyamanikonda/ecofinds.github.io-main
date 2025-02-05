function getProductInfo() {
    let productName = document.querySelector("h1")?.innerText || "";
    let price = document.querySelector("[class*='price']")?.innerText || "Unknown Price";

    chrome.runtime.sendMessage({ action: "extractData", data: { productName, price } });
}

// Run automatically when the page loads
getProductInfo();
