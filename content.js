function getProductInfo() {
    let productName = document.querySelector("h1")?.innerText || "";
    let price = document.querySelector("[class*='price']")?.innerText || "Unknown Price";

    return { productName, price };
}

// Send data to the background script
chrome.runtime.sendMessage({ action: "extractData", data: getProductInfo() });
