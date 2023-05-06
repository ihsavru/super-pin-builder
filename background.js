chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (
    changeInfo.status === "complete" &&
    tab.url &&
    tab.url.includes("/pin-builder")
  ) {
    chrome.tabs.sendMessage(tabId, {
      message: "run-pin-builder-magic",
      url: changeInfo.url,
    });
  }
});
